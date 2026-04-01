import { navigate } from '../router.js';
import { isLoggedIn, getUser } from '../utils/storage.js';

export async function renderCourses(container) {
  if (!isLoggedIn()) {
    navigate('/auth');
    return;
  }

  const user = getUser();
  let courses = [];
  let enrolledCourseIds = new Set();
  let isLoading = true;

  async function fetchData() {
    try {
      const [coursesRes, enrolledRes] = await Promise.all([
        fetch('/api/courses'),
        fetch(`/api/courses/enrolled?userId=${user.id}`)
      ]);
      
      const coursesData = await coursesRes.json();
      const enrolledData = await enrolledRes.json();
      
      courses = coursesData.courses || [];
      enrolledCourseIds = new Set((enrolledData.enrolledCourses || []).map(c => c.id));
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      isLoading = false;
      render();
    }
  }

  async function handleEnroll(courseId) {
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (res.ok) {
        enrolledCourseIds.add(courseId);
        render();
        alert('Successfully enrolled!');
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Failed to enroll. Please try again.');
    }
  }

  function loadRazorpay() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handlePayment(courseId, price, title) {
    isLoading = true;
    render();
    
    try {
      // 0. Ensure Razorpay script is loaded
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please check your internet connection.');
        return;
      }

      // 1. Create order
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, userId: user.id }),
      });
      
      const order = await orderRes.json();
      
      if (!order || !order.id) {
        alert('Failed to create order. Please try again.');
        return;
      }

      // MOCK FLOW: If we got a mock order, skip real Razorpay and verify directly
      if (order.id.startsWith('order_mock_')) {
        console.log('Using Mock Payment Flow');
        try {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: order.id,
              razorpay_payment_id: `pay_mock_${Date.now()}`,
              razorpay_signature: 'mock_signature',
              userId: user.id,
              courseId: courseId
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            enrolledCourseIds.add(courseId);
            render();
            alert('Mock Enrollment successful! A confirmation email has been sent.');
          } else {
            alert('Mock Payment verification failed.');
          }
        } catch (err) {
          console.error('Mock Verification error:', err);
          alert('An error occurred during mock verification.');
        } finally {
          isLoading = false;
          render();
        }
        return;
      }

      // 2. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', 
        amount: order.amount,
        currency: 'INR',
        name: 'Apni Vidya',
        description: `Enrollment for ${title}`,
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify payment
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
                courseId: courseId
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              enrolledCourseIds.add(courseId);
              render();
              alert('Enrollment successful! A confirmation email has been sent.');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('An error occurred during verification.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.contact || '', // Using contact field as email
        },
        theme: {
          color: '#00A693'
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error.description);
        isLoading = false;
        render();
      });

      rzp.open();

    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Failed to initialize payment.');
      isLoading = false;
      render();
    }
  }

  function render() {
    const searchQuery = container.querySelector('.search-input')?.value.toLowerCase() || '';
    const filteredCourses = courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery) || 
      course.description.toLowerCase().includes(searchQuery)
    );

    container.innerHTML = `
      <div class="courses-container page-enter">
        <header class="courses-header">
          <h1 class="courses-title">Discover Courses</h1>
          <p class="courses-subtitle">Level up your skills with our curated curriculum.</p>
        </header>

        <div class="search-bar-container">
          <span class="search-icon">🔍</span>
          <input type="text" class="search-input" placeholder="Search for courses..." value="${searchQuery}">
        </div>

        ${isLoading ? `
          <div class="flex-center" style="padding: 100px 0;">
            <div class="loader"></div>
          </div>
        ` : filteredCourses.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📚</div>
            <h3>No courses found</h3>
            <p>Try a different search term or check back later.</p>
          </div>
        ` : `
          <div class="courses-grid">
            ${filteredCourses.map(course => {
              const isEnrolled = enrolledCourseIds.has(course.id);
              return `
                <div class="course-card">
                  <div class="course-thumbnail">
                    ${course.thumbnail ? `<img src="${course.thumbnail}" alt="${course.title}">` : `<div style="height:100%; display:flex; align-items:center; justify-content:center; background:var(--gray-100); color:var(--gray-400); font-weight:800;">NO PREVIEW</div>`}
                    <span class="course-badge">Ecosystem</span>
                  </div>
                  <div class="course-content">
                    <div class="course-meta">
                      <div class="course-rating">
                        ⭐ <span>4.8</span>
                      </div>
                      ${isEnrolled ? `<span style="font-size:11px; font-weight:800; color:#10B981; background:rgba(16,185,129,0.1); padding:4px 10px; border-radius:100px;">ENROLLED</span>` : ''}
                    </div>
                    <h3 class="course-title-text">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    
                    <div class="course-footer">
                      <div class="course-info">
                        <div class="course-info-item">
                          <span class="course-info-icon">📖</span>
                          ${course._count?.lessons || 0} Lessons
                        </div>
                        <div class="course-info-item">
                          <span class="course-info-icon">👤</span>
                          ${course._count?.enrollments || 0} Students
                        </div>
                      </div>
                      <div class="course-price ${course.price === 0 ? 'free' : ''}">
                        ${course.price === 0 ? 'FREE' : `₹${course.price}`}
                      </div>
                    </div>

                    ${isEnrolled ? `
                      <button class="course-action-btn btn-start" data-id="${course.id}">Start Learning →</button>
                    ` : `
                      <button class="course-action-btn btn-enroll" data-id="${course.id}">Enroll Now</button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    // Add event listeners
    container.querySelector('.search-input')?.addEventListener('input', () => {
      // Re-render only the grid to preserve focus if possible, 
      // but for simplicity we re-render the whole thing for now
      render();
      container.querySelector('.search-input').focus();
      // Set cursor to end
      const len = container.querySelector('.search-input').value.length;
      container.querySelector('.search-input').setSelectionRange(len, len);
    });

    container.querySelectorAll('.btn-enroll').forEach(btn => {
      btn.addEventListener('click', () => {
        const courseId = btn.dataset.id;
        const course = courses.find(c => c.id === courseId);
        if (course && course.price > 0) {
          handlePayment(courseId, course.price, course.title);
        } else {
          handleEnroll(courseId);
        }
      });
    });

    container.querySelectorAll('.btn-start').forEach(btn => {
      btn.addEventListener('click', () => {
        const courseId = btn.dataset.id;
        navigate(`/course/${courseId}`);
      });
    });
  }

  // Initial fetch
  fetchData();
}
