import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Submit quiz result
router.post('/submit', async (req, res) => {
  try {
    const {
      userId, setIndex, totalScore, totalCorrect, totalQuestions,
      categoryScores, personalityType, personalityEmoji, personalityDesc,
      topStrengths, areasToImprove, skillPlan, careers, 
      learningStyle, workEnvironment, actionableAdvice,
      hiddenTalent, hiddenTalentDesc, answers,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await prisma.quizResult.create({
      data: {
        userId,
        setIndex: setIndex || 0,
        totalScore: totalScore || 0,
        totalCorrect: totalCorrect || 0,
        totalQuestions: totalQuestions || 0,
        categoryScores: JSON.stringify(categoryScores || {}),
        personalityType: personalityType || '',
        personalityEmoji: personalityEmoji || '',
        personalityDesc: personalityDesc || '',
        topStrengths: JSON.stringify(topStrengths || []),
        areasToImprove: JSON.stringify(areasToImprove || []),
        skillPlan: JSON.stringify(skillPlan || []),
        careers: JSON.stringify(careers || []),
        learningStyle: learningStyle || '',
        workEnvironment: workEnvironment || '',
        actionableAdvice: actionableAdvice || '',
        hiddenTalent: hiddenTalent || '',
        hiddenTalentDesc: hiddenTalentDesc || '',
        answers: JSON.stringify(answers || []),
      },
    });

    // Determine theme color based on personality
    let themeColor = '#A78BFA'; // Default purple
    if (personalityType.includes('Innovator')) themeColor = '#3B82F6'; // Blue
    if (personalityType.includes('Humanitarian')) themeColor = '#10B981'; // Green
    if (personalityType.includes('Strategist')) themeColor = '#6366F1'; // Indigo
    if (personalityType.includes('Creator')) themeColor = '#F59E0B'; // Amber
    if (personalityType.includes('Leader')) themeColor = '#EF4444'; // Red

    // Update user profile with personality & theme
    await prisma.user.update({
      where: { id: userId },
      data: {
        personalityType: personalityType || '',
        personalityEmoji: personalityEmoji || '',
        personalityDesc: personalityDesc || '',
        themeColor: themeColor,
        primaryTrait: (topStrengths && topStrengths.length > 0) ? topStrengths[0].name : '',
      }
    }).catch(e => console.error('Failed to update user profile:', e));

    res.json({
      success: true,
      resultId: result.id,
      updatedUser: {
        personalityType,
        personalityEmoji,
        themeColor
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

// Get a specific result by ID (shareable)
router.get('/results/:id', async (req, res) => {
  try {
    const result = await prisma.quizResult.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, name: true } } },
    });

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json({
      result: {
        ...result,
        categoryScores: JSON.parse(result.categoryScores),
        topStrengths: JSON.parse(result.topStrengths || '[]'),
        areasToImprove: JSON.parse(result.areasToImprove || '[]'),
        skillPlan: JSON.parse(result.skillPlan || '[]'),
        careers: JSON.parse(result.careers),
        answers: JSON.parse(result.answers),
        userName: result.user?.name || 'Anonymous',
      },
    });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ error: 'Failed to get result' });
  }
});

// Get all results for a user
router.get('/results/user/:userId', async (req, res) => {
  try {
    const results = await prisma.quizResult.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      results: results.map(r => ({
        ...r,
        categoryScores: JSON.parse(r.categoryScores),
        topStrengths: JSON.parse(r.topStrengths || '[]'),
        areasToImprove: JSON.parse(r.areasToImprove || '[]'),
        skillPlan: JSON.parse(r.skillPlan || '[]'),
        careers: JSON.parse(r.careers),
        answers: JSON.parse(r.answers),
      })),
    });
  } catch (error) {
    console.error('Get user results error:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

export default router;
