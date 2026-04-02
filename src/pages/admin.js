import { navigate } from '../router.js';
import { isLoggedIn } from '../utils/storage.js';

export async function renderAdmin(container, params) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isLoggedIn() || !isAdmin) { 
    navigate('/admin-login'); 
    return; 
  }

  // Load Admin CSS
  if (!document.getElementById('admin-layout-css')) {
    const link = document.createElement('link');
    link.id = 'admin-layout-css';
    link.rel = 'stylesheet';
    link.href = '/src/styles/admin-layout.css';
    document.head.appendChild(link);
  }

  let events = [];
  let adminCourses = [];
  try {
    const [eventsRes, coursesRes] = await Promise.all([
      fetch('/api/competitions'),
      fetch('/api/admin/courses')
    ]);
    const eventsData = await eventsRes.json();
    events = eventsData.competitions || [];
    adminCourses = await coursesRes.json();
  } catch (e) {
    console.error('Failed to fetch admin data', e);
  }

  // State management for tabs
  let activeTab = 'events'; 
  let editingCourse = null;
  let managingLessonsFor = null; // course object

  const renderContent = () => {
    container.innerHTML = `
      <div class="admin-wrapper" style="font-family: var(--font-main);">
        <!-- Admin Navigation -->
        <nav class="admin-nav">
          <div class="admin-nav-brand">
            <span style="font-size: 24px;">🛡️</span>
            <span>Admin Console</span>
          </div>
          <div class="admin-nav-links">
            <div class="admin-nav-item ${activeTab === 'engagement' ? 'active' : ''}" data-tab="engagement">Engagement</div>
            <div class="admin-nav-item ${activeTab === 'events' ? 'active' : ''}" data-tab="events">Events</div>
            <div class="admin-nav-item ${activeTab === 'courses' ? 'active' : ''}" data-tab="courses">Courses</div>
          </div>
          <div class="admin-nav-actions">
            <button id="admin-home" class="admin-action-btn">Dashboard</button>
            <button id="admin-logout" class="admin-action-btn admin-action-btn--primary">Logout</button>
          </div>
        </nav>

        <div class="admin-content">
          
          <!-- SECTION: ENGAGEMENT -->
          <div class="admin-section ${activeTab === 'engagement' ? 'active' : ''}" id="section-engagement">
             <div class="admin-grid-engagement">
               <div class="glass-card p-mobile-4" style="background: white; border-radius: 24px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-sm);">
                  <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: var(--gray-400); letter-spacing: 1px;">User Activity</div>
                  <h3 style="font-family: var(--font-heading); font-size: 32px; font-weight: 800; margin-top: 8px;">${events.length * 42 }</h3>
                  <p style="color: var(--gray-500); font-size: 13px; margin-top: 4px;">Total interactions this month</p>
                  <button id="admin-export-btn" style="margin-top: 24px; width: 100%; border: none; padding: 14px; border-radius: 14px; background: #059669; color: white; font-weight: 800; cursor: pointer;">📥 Export User Database (CSV)</button>
               </div>
               <div class="glass-card p-mobile-4" style="background: white; border-radius: 24px; border: 1px solid var(--gray-100);">
                  <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: var(--gray-400); letter-spacing: 1px;">Course Enrollments</div>
                  <h3 style="font-family: var(--font-heading); font-size: 32px; font-weight: 800; margin-top: 8px;">${adminCourses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0)}</h3>
                  <p style="color: var(--gray-500); font-size: 13px; margin-top: 4px;">Active student base</p>
                  <div style="margin-top: 24px; height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden;">
                    <div style="width: 70%; background: #3b82f6; height: 100%;"></div>
                  </div>
               </div>
             </div>
          </div>

          <!-- SECTION: EVENTS -->
          <div class="admin-section ${activeTab === 'events' ? 'active' : ''}" id="section-events">
            <div class="admin-grid-2-to-1">
              <div class="glass-card p-mobile-4" style="background: white; border-radius: 28px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                  <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 800;">Published Events</h2>
                  <span style="font-size: 11px; font-weight: 700; color: var(--primary); background: var(--primary-lightest); padding: 4px 10px; border-radius: 100px;">${events.length} Live</span>
                </div>
                <div style="display: grid; gap: 12px;">
                  ${events.map(ev => `
                    <div class="admin-list-item" style="padding: 16px;">
                       <div>
                         <h4 style="font-weight: 800; font-family: var(--font-heading);">${ev.title}</h4>
                         <span style="font-size: 11px; color: #94a3b8;">Created: ${new Date(ev.createdAt).toLocaleDateString()}</span>
                       </div>
                       <div class="actions-row">
                         <button class="btn-alert-modal" data-id="${ev.id}" data-title="${ev.title}" style="background: white; border: 1px solid #e2e8f0; padding: 6px 14px; border-radius: 10px; font-size: 11px; font-weight: 800; color: var(--primary); cursor: pointer;">Broadcast</button>
                         <button class="btn-delete-comp" data-id="${ev.id}" style="background: #fee2e2; color: #ef4444; border: none; padding: 6px 14px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer;">Remove</button>
                       </div>
                     </div>
                  `).join('')}
                </div>
              </div>
              <div class="glass-card p-mobile-4" style="background: white; border-radius: 28px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-md);">
                <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 800; margin-bottom: 24px;">Launch Event</h2>
                <div style="display: grid; gap: 12px;">
                  <input type="text" id="comp-title" class="input-field" placeholder="Event Name" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;"/>
                  <textarea id="comp-desc" placeholder="Details..." style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; min-height: 80px; resize: none; font-weight: 600;"></textarea>
                  <input type="text" id="comp-link" placeholder="External Link" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;"/>
                  <button id="admin-comp-btn" class="btn" style="padding: 16px; border-radius: 14px; background: var(--primary); color: white; font-weight: 900; border: none; cursor: pointer; margin-top: 12px;">Publish Event →</button>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION: COURSES -->
          <div class="admin-section ${activeTab === 'courses' ? 'active' : ''}" id="section-courses">
            ${managingLessonsFor ? `
              <!-- LESSON MANAGEMENT VIEW -->
              <div class="glass-card p-mobile-4" style="background: white; border-radius: 28px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-lg);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
                  <button id="back-to-courses" style="background: none; border: none; font-size: 13px; font-weight: 800; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">←</span> BACK TO COURSES
                  </button>
                  <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 800;">Manage Content: ${managingLessonsFor.title}</h2>
                  <button id="add-lesson-btn" style="background: #3b82f6; color: white; border: none; padding: 10px 18px; border-radius: 12px; font-weight: 800; font-size: 12px; cursor: pointer;">➕ Add Lesson</button>
                </div>

                <div style="display: grid; gap: 12px;">
                  ${(managingLessonsFor.lessons || []).map((lesson, idx) => `
                    <div class="lesson-list-item">
                      <div class="lesson-meta">
                        <span class="order">Lesson ${idx + 1} • Order: ${lesson.order}</span>
                        <span class="title">${lesson.title}</span>
                      </div>
                      <div style="display: flex; gap: 8px;">
                        <button class="btn-edit-lesson" data-json='${JSON.stringify(lesson)}' style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer;">Edit</button>
                        <button class="btn-delete-lesson" data-id="${lesson.id}" style="background: #fff1f2; color: #e11d48; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer;">Delete</button>
                      </div>
                    </div>
                  `).join('')}
                  ${!managingLessonsFor.lessons?.length ? '<p style="text-align: center; color: #94a3b8; padding: 40px; font-style: italic;">No lessons added yet. Click "Add Lesson" to start building your curriculum.</p>' : ''}
                </div>
              </div>
            ` : `
              <!-- COURSE LIST VIEW -->
              <div class="admin-grid-course" style="align-items: start;">
                <div class="glass-card p-mobile-4" style="background: white; border-radius: 28px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-md);">
                  <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 800; margin-bottom: 24px;">Course Ecosystem</h2>
                  <div style="display: grid; gap: 16px;">
                    ${adminCourses.map(c => `
                      <div class="admin-list-item">
                         <div style="flex: 1;">
                           <div style="display: flex; align-items: center; gap: 8px;">
                             <h4 style="font-weight: 800; font-family: var(--font-heading); font-size: 16px;">${c.title}</h4>
                             <span style="font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 100px; background: ${c.published ? '#dcfce7' : '#fef3c7'}; color: ${c.published ? '#166534' : '#92400e'}; text-transform: uppercase;">${c.published ? 'Live' : 'Draft'}</span>
                           </div>
                           <div style="margin-top: 6px; font-size: 12px; color: #a855f7; font-weight: 700;">${c._count?.lessons || 0} Lessons • ${c._count?.enrollments || 0} Enrolled</div>
                         </div>
                         <div class="actions-row">
                           <button class="btn-manage-lessons" data-id="${c.id}" style="background: #f3f4f6; color: #374151; border: none; padding: 8px 16px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer;">Manage Content</button>
                           <button class="btn-edit-course" data-json='${JSON.stringify(c)}' style="background: white; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 10px; font-size: 11px; font-weight: 800; color: #6b7280; cursor: pointer;">Edit Settings</button>
                           <button class="btn-delete-course" data-id="${c.id}" style="background: #fff1f2; color: #ef4444; border: none; padding: 8px 16px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer;">Delete</button>
                         </div>
                       </div>
                    `).join('')}
                    ${adminCourses.length === 0 ? '<p style="text-align: center; color: #94a3b8; font-style: italic;">No courses found.</p>' : ''}
                  </div>
                </div>

                <div class="glass-card p-mobile-4" style="background: white; border-radius: 28px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-md);">
                  <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 800; margin-bottom: 24px;">Launch Portal</h2>
                  <div style="display: grid; gap: 12px;">
                    <input type="hidden" id="course-id" value=""/>
                    <input type="text" id="course-title" placeholder="Course Name" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;"/>
                    <textarea id="course-desc" placeholder="Path Description..." style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; min-height: 80px; resize: none; font-weight: 600;"></textarea>
                    <div style="display: flex; gap: 12px;">
                      <input type="number" id="course-price" placeholder="Price (₹)" style="flex:1; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;"/>
                      <div style="flex:1; display: flex; align-items: center; background: #f8fafc; border-radius: 12px; padding: 0 12px; border: 1px solid #e2e8f0;">
                         <input type="checkbox" id="course-published" style="width: 18px; height: 18px;"/>
                         <label style="margin-left:8px; font-size:12px; font-weight:800; color: #64748b;">PUBLISH</label>
                      </div>
                    </div>
                    <input type="text" id="course-thumbnail" placeholder="Thumbnail URL" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;"/>
                    <button id="admin-course-btn" class="btn" style="padding: 16px; border-radius: 14px; background: #8B5CF6; color: white; font-weight: 900; border: none; cursor: pointer; margin-top: 12px;">Create Course →</button>
                    ${editingCourse ? '<button id="btn-cancel-edit" style="background: none; border: none; font-weight: 700; color: #94a3b8; font-size: 12px; cursor: pointer; margin-top: 8px;">Discard Edits</button>' : ''}
                  </div>
                </div>
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- BROADCAST OVERLAY -->
      <div id="alert-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 16px;">
         <div style="background: white; border-radius: 28px; padding: 32px; width: 100%; max-width: 500px; box-shadow: var(--shadow-2xl);" class="p-mobile-4">
            <h2 id="modal-comp-title" style="font-family: var(--font-heading); font-weight: 800; font-size: 24px; margin-bottom: 8px;">Broadcast</h2>
            <p style="color: var(--gray-500); font-size: 14px; margin-bottom: 24px; font-weight: 500;">Message will be sent to all enrolled participants via their dashboard.</p>
            <div style="display: grid; gap: 16px;">
               <input type="text" id="alert-title" placeholder="Subject" style="width: 100%; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; font-weight: 800;"/>
               <textarea id="alert-message" placeholder="Type message body..." style="width: 100%; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; font-weight: 600; min-height: 120px; resize: none;"></textarea>
               <div style="display: flex; gap: 12px;">
                  <button id="btn-close-modal" style="flex: 1; padding: 16px; border-radius: 14px; border: none; background: #f1f5f9; color: #64748b; font-weight: 800; cursor: pointer;">Cancel</button>
                  <button id="btn-send-alert" style="flex: 2; padding: 16px; border-radius: 14px; border: none; background: var(--primary); color: white; font-weight: 800; cursor: pointer;">Fire Message →</button>
               </div>
            </div>
         </div>
      </div>

      <!-- LESSON FORM OVERLAY (Floating) -->
      <div id="lesson-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 24px;">
         <div class="lesson-modal">
            <h2 id="lesson-modal-title" style="font-family: var(--font-heading); font-weight: 800; font-size: 24px; margin-bottom: 24px;">✨ Add Path Module</h2>
            <input type="hidden" id="lesson-id" value=""/>
            <div style="display: grid; gap: 16px;">
               <input type="text" id="lesson-title" placeholder="Lesson Name" style="width: 100%; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; font-weight: 800;"/>
               <textarea id="lesson-desc" placeholder="Lesson Summary..." style="width: 100%; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; font-weight: 600; min-height: 80px; resize: none;"></textarea>
               <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
                 <input type="text" id="lesson-youtube" placeholder="YouTube Video ID (Optional)" style="padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; font-weight: 700;"/>
                 <input type="number" id="lesson-order" placeholder="Sequence #" style="padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; font-weight: 800;"/>
               </div>
               <div style="display: flex; gap: 12px; margin-top: 8px;">
                  <button id="close-lesson-modal" style="flex: 1; padding: 16px; border-radius: 14px; border: none; background: #f1f5f9; color: #64748b; font-weight: 800; cursor: pointer;">Cancel</button>
                  <button id="save-lesson-btn" style="flex: 2; padding: 16px; border-radius: 14px; border: none; background: #3b82f6; color: white; font-weight: 900; cursor: pointer;">Save Module →</button>
               </div>
            </div>
         </div>
      </div>
    `;

    // --- RE-BIND EVENT LISTENERS ---
    document.getElementById('admin-home')?.addEventListener('click', () => navigate('/dashboard'));
    document.getElementById('admin-logout')?.addEventListener('click', () => {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminToken');
      navigate('/dashboard');
    });

    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        activeTab = item.dataset.tab;
        managingLessonsFor = null;
        renderContent();
      });
    });

    // Events Page Handlers
    document.getElementById('admin-comp-btn')?.addEventListener('click', async () => {
      const title = document.getElementById('comp-title').value.trim();
      const description = document.getElementById('comp-desc').value.trim();
      const formLink = document.getElementById('comp-link').value.trim();
      if (!title || !description || !formLink) return;
      try {
        const res = await fetch('/api/competitions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, formLink })
        });
        if (res.ok) renderAdmin(container);
      } catch (e) { alert('Sync error'); }
    });

    document.querySelectorAll('.btn-delete-comp').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Archive this challenge?')) return;
        try {
          const res = await fetch(`/api/competitions/${btn.dataset.id}`, { method: 'DELETE' });
          if (res.ok) renderAdmin(container);
        } catch (e) { console.error(e); }
      });
    });

    // Courses Page Handlers
    document.getElementById('admin-course-btn')?.addEventListener('click', async () => {
      const id = document.getElementById('course-id').value;
      const title = document.getElementById('course-title').value.trim();
      const description = document.getElementById('course-desc').value.trim();
      const price = parseFloat(document.getElementById('course-price').value) || 0;
      const published = document.getElementById('course-published').checked;
      const thumbnail = document.getElementById('course-thumbnail').value.trim();
      if (!title || !description) return;
      try {
        const res = await fetch('/api/admin/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, title, description, price, published, thumbnail })
        });
        if (res.ok) renderAdmin(container);
      } catch (e) { alert('Failed'); }
    });

    document.querySelectorAll('.btn-edit-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const course = JSON.parse(btn.dataset.json);
        editingCourse = course;
        renderContent();
        document.getElementById('course-id').value = course.id;
        document.getElementById('course-title').value = course.title;
        document.getElementById('course-desc').value = course.description;
        document.getElementById('course-price').value = course.price;
        document.getElementById('course-published').checked = course.published;
        document.getElementById('course-thumbnail').value = course.thumbnail || '';
        document.getElementById('admin-course-btn').innerText = 'Update Changes →';
      });
    });
    
    document.getElementById('btn-cancel-edit')?.addEventListener('click', () => {
      editingCourse = null;
      renderContent();
    });

    document.querySelectorAll('.btn-delete-course').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this course?')) return;
        try {
          const res = await fetch(`/api/admin/courses/${btn.dataset.id}`, { method: 'DELETE' });
          if (res.ok) renderAdmin(container);
        } catch (e) { }
      });
    });

    // Lesson Management Handlers
    document.querySelectorAll('.btn-manage-lessons').forEach(btn => {
      btn.addEventListener('click', () => {
        managingLessonsFor = adminCourses.find(c => c.id === btn.dataset.id);
        renderContent();
      });
    });

    document.getElementById('back-to-courses')?.addEventListener('click', () => {
      managingLessonsFor = null;
      renderContent();
    });

    document.getElementById('add-lesson-btn')?.addEventListener('click', () => {
      document.getElementById('lesson-modal').style.display = 'flex';
      document.getElementById('lesson-modal-title').innerText = '✨ Add Path Module';
      document.getElementById('lesson-id').value = '';
      document.getElementById('lesson-title').value = '';
      document.getElementById('lesson-desc').value = '';
      document.getElementById('lesson-youtube').value = '';
      document.getElementById('lesson-order').value = (managingLessonsFor.lessons?.length || 0) + 1;
    });

    document.getElementById('close-lesson-modal')?.addEventListener('click', () => {
      document.getElementById('lesson-modal').style.display = 'none';
    });

    document.getElementById('save-lesson-btn')?.addEventListener('click', async () => {
      const id = document.getElementById('lesson-id').value;
      const title = document.getElementById('lesson-title').value.trim();
      const description = document.getElementById('lesson-desc').value.trim();
      const youtubeVideoId = document.getElementById('lesson-youtube').value.trim();
      const order = document.getElementById('lesson-order').value;
      
      if (!title) return;

      try {
        const res = await fetch('/api/admin/lessons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, courseId: managingLessonsFor.id, title, description, youtubeVideoId, order })
        });
        if (res.ok) {
          const updatedLesson = await res.json();
          // Update local state and re-render
          const resFresh = await fetch('/api/admin/courses');
          adminCourses = await resFresh.json();
          managingLessonsFor = adminCourses.find(c => c.id === managingLessonsFor.id);
          renderContent();
        }
      } catch (e) { alert('Save error'); }
    });

    document.querySelectorAll('.btn-edit-lesson').forEach(btn => {
      btn.addEventListener('click', () => {
        const lesson = JSON.parse(btn.dataset.json);
        document.getElementById('lesson-modal').style.display = 'flex';
        document.getElementById('lesson-modal-title').innerText = '📝 Edit Lesson';
        document.getElementById('lesson-id').value = lesson.id;
        document.getElementById('lesson-title').value = lesson.title;
        document.getElementById('lesson-desc').value = lesson.description || '';
        document.getElementById('lesson-youtube').value = lesson.youtubeVideoId || '';
        document.getElementById('lesson-order').value = lesson.order;
      });
    });

    document.querySelectorAll('.btn-delete-lesson').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this lesson?')) return;
        try {
          const res = await fetch(`/api/admin/lessons/${btn.dataset.id}`, { method: 'DELETE' });
          if (res.ok) {
            const resFresh = await fetch('/api/admin/courses');
            adminCourses = await resFresh.json();
            managingLessonsFor = adminCourses.find(c => c.id === managingLessonsFor.id);
            renderContent();
          }
        } catch (e) { }
      });
    });

    // Alert Modal Handlers
    let targetId = null;
    document.querySelectorAll('.btn-alert-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        targetId = btn.dataset.id;
        document.getElementById('modal-comp-title').innerText = `Pulse Alert: ${btn.dataset.title}`;
        document.getElementById('alert-modal').style.display = 'flex';
      });
    });

    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
      document.getElementById('alert-modal').style.display = 'none';
    });

    document.getElementById('btn-send-alert')?.addEventListener('click', async () => {
      const title = document.getElementById('alert-title').value.trim();
      const message = document.getElementById('alert-message').value.trim();
      if (!title || !message) return;
      try {
        const res = await fetch('/api/admin/notify-enrolled', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ competitionId: targetId, title, message })
        });
        if (res.ok) {
          alert('Alert Broadcasted!');
          document.getElementById('alert-modal').style.display = 'none';
        }
      } catch (e) { }
    });
    
    document.getElementById('admin-export-btn')?.addEventListener('click', () => {
      window.open('/api/auth/admin/export-users', '_blank');
    });
  };

  renderContent();
}
