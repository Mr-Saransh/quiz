import prisma from '../lib/prisma.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.json({
      success: true,
      resultId: result.id,
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to save result' });
  }
}
