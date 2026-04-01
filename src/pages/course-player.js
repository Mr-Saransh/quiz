import { navigate } from '../router.js';
import { isLoggedIn } from '../utils/storage.js';

export async function renderCoursePlayer(container, params) {
  const courseId = params.courseId;
  if (!isLoggedIn()) { 
    navigate('/auth'); 
    return; 
  }

  let course = null;
  try {
    const res = await fetch(`/api/courses/${courseId}`);
    if (!res.ok) throw new Error('Course not found');
    const data = await res.json();
    course = data;
  } catch (error) {
    container.innerHTML = `<div class="error-view">Course not found or access denied.</div>`;
    return;
  }

  const lessons = course.lessons || [];
  let currentLessonIndex = 0;
  
  // URL can specify lesson index/ID, but we'll default to first
  const renderSelectedLesson = (index) => {
    currentLessonIndex = index;
    const lesson = lessons[index];
    const videoId = lesson?.youtubeVideoId || '';
    
    const playerArea = document.getElementById('player-main-content');
    if (!playerArea) return;

    playerArea.innerHTML = `
      <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 20px; background: #000; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
        ${videoId ? `
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        ` : `
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; text-align: center; padding: 20px;">
            <div>
              <div style="font-size: 48px; margin-bottom: 16px;">🎬</div>
              <h3 style="font-family: var(--font-heading); font-size: 24px;">Video Content Coming Soon</h3>
              <p style="opacity: 0.7;">The content for this lesson is being prepared.</p>
            </div>
          </div>
        `}
      </div>
      
      <div class="lesson-details" style="margin-top: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
          <div>
            <h1 style="font-family: var(--font-heading); font-size: 28px; font-weight: 800; color: var(--gray-900);">${lesson?.title || 'Overview'}</h1>
            <p style="color: var(--gray-500); font-weight: 600;">Course: ${course.title}</p>
          </div>
          <div style="display: flex; gap: 12px;">
            <button id="prev-lesson" ${index === 0 ? 'disabled' : ''} style="padding: 10px 20px; border-radius: 12px; border: 1px solid var(--gray-200); background: white; font-weight: 700; cursor: pointer; opacity: ${index === 0 ? 0.5 : 1};">Prev</button>
            <button id="next-lesson" ${index === lessons.length - 1 ? 'disabled' : ''} style="padding: 10px 20px; border-radius: 12px; border: none; background: var(--primary); color: white; font-weight: 700; cursor: pointer; opacity: ${index === lessons.length - 1 ? 0.5 : 1};">Next</button>
          </div>
        </div>
        
        <div class="glass-card" style="padding: 24px; border-radius: 20px; background: white; border: 1px solid var(--gray-100);">
          <h3 style="font-weight: 800; font-size: 16px; color: var(--gray-900); border-bottom: 1px solid var(--gray-100); padding-bottom: 12px; margin-bottom: 16px;">About this Lesson</h3>
          <p style="color: var(--gray-600); line-height: 1.6; font-weight: 500;">
            ${lesson?.description || course.description}
          </p>
        </div>
      </div>
    `;

    // Re-bind buttons
    document.getElementById('prev-lesson')?.addEventListener('click', () => renderSelectedLesson(index - 1));
    document.getElementById('next-lesson')?.addEventListener('click', () => renderSelectedLesson(index + 1));

    // Update active state in sidebar
    document.querySelectorAll('.lesson-nav-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
      item.style.background = idx === index ? 'var(--primary-lightest)' : 'transparent';
      item.style.borderColor = idx === index ? 'var(--primary)' : 'var(--gray-100)';
    });
  };

  container.innerHTML = `
    <div class="player-wrapper" style="display: flex; flex-direction: column; height: 100vh; background: #fafafa; overflow: hidden;">
      
      <!-- Top Header -->
      <div class="player-header" style="height: 64px; background: white; border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <button id="player-back" style="background: none; border: none; font-size: 24px; cursor: pointer;">←</button>
          <span style="font-family: var(--font-heading); font-weight: 800; font-size: 18px; color: var(--gray-900);">${course.title}</span>
        </div>
        <div style="background: var(--gray-50); padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 800; color: var(--gray-500); text-transform: uppercase; letter-spacing: 1px;">
          Learning Portal
        </div>
      </div>

      <!-- Main Columns -->
      <div class="player-body" style="display: flex; flex: 1; overflow: hidden;">
        
        <!-- Sidebar -->
        <div class="player-sidebar" style="width: 320px; background: white; border-right: 1px solid var(--gray-200); display: flex; flex-direction: column; flex-shrink: 0;">
          <div style="padding: 20px; border-bottom: 1px solid var(--gray-100);">
            <h4 style="font-weight: 800; color: var(--gray-400); font-size: 11px; text-transform: uppercase;">Course Content</h4>
            <p style="font-size: 13px; font-weight: 700; color: var(--gray-900); margin-top: 4px;">${lessons.length} Modules</p>
          </div>
          <div class="lesson-scroll" style="flex: 1; overflow-y: auto; padding: 12px;">
            ${lessons.map((lesson, idx) => `
              <div class="lesson-nav-item" data-index="${idx}" style="padding: 16px; border-radius: 16px; border: 1px solid var(--gray-100); margin-bottom: 10px; cursor: pointer; transition: all 0.2s;">
                <div style="display: flex; gap: 12px; align-items: center;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: ${idx <= currentLessonIndex ? 'var(--primary)' : 'var(--gray-200)'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900;">
                    ${idx + 1}
                  </div>
                  <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 700; color: var(--gray-800); line-height: 1.2;">${lesson.title}</div>
                    <div style="font-size: 10px; font-weight: 600; color: var(--gray-400); margin-top: 4px;">VIDEO • ${Math.floor(Math.random() * 20 + 5)}m</div>
                  </div>
                </div>
              </div>
            `).join('')}
            ${lessons.length === 0 ? '<div style="padding: 20px; text-align: center; color: var(--gray-400); font-style: italic;">No lessons available yet.</div>' : ''}
          </div>
        </div>

        <!-- Main Video Area -->
        <div class="player-main" style="flex: 1; overflow-y: auto; padding: 40px; background: #fafafa;">
          <div id="player-main-content" style="max-width: 900px; margin: 0 auto;">
            <!-- Rendered by JS -->
          </div>
        </div>
      </div>
    </div>
  `;

  // --- Handlers ---
  document.getElementById('player-back')?.addEventListener('click', () => navigate('/courses'));
  
  document.querySelectorAll('.lesson-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index);
      renderSelectedLesson(idx);
    });
  });

  // Initial Render
  if (lessons.length > 0) {
    renderSelectedLesson(0);
  } else {
    document.getElementById('player-main-content').innerHTML = `
      <div style="text-align: center; padding: 100px 0;">
         <div style="font-size: 64px;">📚</div>
         <h2 style="font-family: var(--font-heading); font-weight: 800; font-size: 28px; margin-top: 24px;">Coming Soon!</h2>
         <p style="color: var(--gray-500);">Lessons for this course are currently being uploaded.</p>
      </div>
    `;
  }
}
