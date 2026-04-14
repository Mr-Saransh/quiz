import { navigate, getCurrentRoute } from '../router.js';
import { isLoggedIn, getUser } from '../utils/storage.js';

export async function renderCourses(container) {
  if (!isLoggedIn()) {
    navigate('/auth');
    return;
  }

  const user = getUser();
  let courses = [];
  let enrolledCourseIds = new Set();
  let mentors = [];
  let isLoading = true;

  // Check for coupon code from URL params
  const hash = window.location.hash;
  const urlParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  let prefillCoupon = urlParams.get('coupon') || '';

  // Coupon state
  let couponCode = prefillCoupon;
  let couponValid = false;
  let couponDiscount = 0;
  let couponMessage = '';
  let couponChecked = false;

  // Combo course config
  const COMBO_COURSE_ID = 'combo-all-in-one';
  const COMBO_ORIGINAL_PRICE = 12000;
  const COMBO_DISCOUNTED_PRICE = 6000;

  async function fetchData() {
    try {
      const [coursesRes, enrolledRes, mentorsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch(`/api/courses/enrolled?userId=${user.id}`),
        fetch('/api/mentors')
      ]);
      
      const coursesData = await coursesRes.json();
      const enrolledData = await enrolledRes.json();
      const mentorsData = await mentorsRes.json();
      
      courses = coursesData.courses || [];
      enrolledCourseIds = new Set((enrolledData.enrolledCourses || []).map(c => c.id));
      mentors = mentorsData.mentors || [];
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      isLoading = false;
      render();

      // Auto-apply coupon if came from assessment
      if (prefillCoupon && !couponChecked) {
        applyCoupon();
      }
    }
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;

    try {
      const res = await fetch('/api/assessment/verify-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: couponCode.trim() })
      });
      const data = await res.json();

      couponChecked = true;
      if (data.valid) {
        couponValid = true;
        couponDiscount = data.discount;
        couponMessage = data.message;
      } else {
        couponValid = false;
        couponMessage = data.message || 'Invalid coupon code';
      }
      render();
    } catch (err) {
      couponMessage = 'Failed to verify coupon';
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

  async function handlePayment(courseId, price, title, appliedCoupon = null) {
    isLoading = true;
    render();
    
    try {
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please check your internet connection.');
        return;
      }

      const orderBody = { courseId, userId: user.id };
      if (appliedCoupon) {
        orderBody.couponCode = appliedCoupon;
      }

      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody),
      });
      
      const order = await orderRes.json();
      
      if (!order || !order.id) {
        alert('Failed to create order. Please try again.');
        return;
      }

      // MOCK FLOW
      if (order.id.startsWith('order_mock_')) {
        try {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: order.id,
              razorpay_payment_id: `pay_mock_${Date.now()}`,
              razorpay_signature: 'mock_signature',
              userId: user.id,
              courseId,
              couponCode: appliedCoupon || undefined
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            enrolledCourseIds.add(courseId);
            render();
            alert('Enrollment successful! A confirmation email has been sent.');
          } else {
            alert('Payment verification failed.');
          }
        } catch (err) {
          alert('An error occurred during verification.');
        } finally {
          isLoading = false;
          render();
        }
        return;
      }

      // Real Razorpay Flow
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', 
        amount: order.amount,
        currency: 'INR',
        name: 'Find Your Spark',
        description: `Enrollment for ${title}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
                courseId,
                couponCode: appliedCoupon || undefined
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
            alert('An error occurred during verification.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.contact || '',
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
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

  function getComboFinalPrice() {
    return couponValid ? COMBO_DISCOUNTED_PRICE - couponDiscount : COMBO_DISCOUNTED_PRICE;
  }

  function render() {
    const searchQuery = container.querySelector('.search-input')?.value.toLowerCase() || '';
    const filteredCourses = courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery) || 
      course.description.toLowerCase().includes(searchQuery)
    );

    const finalPrice = getComboFinalPrice();

    container.innerHTML = `
      <div class="courses-container page-enter">
        <header class="courses-header">
          <h1 class="courses-title">Discover Courses</h1>
          <p class="courses-subtitle">Level up your skills with our curated curriculum.</p>
        </header>

        <!-- ========== COMBO COURSE ADVERTISEMENT ========== -->
        <div class="combo-hero" id="combo-section">
          <div class="combo-floating-icons">
            <span class="combo-float-icon">🤝</span>
            <span class="combo-float-icon">💻</span>
            <span class="combo-float-icon">🤖</span>
            <span class="combo-float-icon">🔒</span>
            <span class="combo-float-icon">💰</span>
          </div>

          <div class="combo-content">
            <div class="combo-badge">🔥 LIMITED TIME OFFER</div>
            <h2 class="combo-title">All-in-One Combo Course</h2>
            <p class="combo-subtitle">Master 6 essential skills in one comprehensive program. Designed by IITian mentors to future-proof your career.</p>

            <div class="combo-subjects">
              <div class="combo-subject">
                <span class="combo-subject-icon">🤝</span>
                <span class="combo-subject-name">Soft Skills</span>
              </div>
              <div class="combo-subject">
                <span class="combo-subject-icon">💻</span>
                <span class="combo-subject-name">Computer</span>
              </div>
              <div class="combo-subject">
                <span class="combo-subject-icon">🤖</span>
                <span class="combo-subject-name">AI</span>
              </div>
              <div class="combo-subject">
                <span class="combo-subject-icon">👨‍💻</span>
                <span class="combo-subject-name">Coding</span>
              </div>
              <div class="combo-subject">
                <span class="combo-subject-icon">🔒</span>
                <span class="combo-subject-name">Cyber Security</span>
              </div>
              <div class="combo-subject">
                <span class="combo-subject-icon">💰</span>
                <span class="combo-subject-name">Financial Literacy</span>
              </div>
            </div>

            <div class="combo-pricing">
              <span class="combo-price-original">₹${COMBO_ORIGINAL_PRICE.toLocaleString('en-IN')}</span>
              <span class="combo-price-current">₹${COMBO_DISCOUNTED_PRICE.toLocaleString('en-IN')}</span>
              <span class="combo-discount-badge">50% OFF</span>
            </div>

            <!-- Coupon Input -->
            <div class="combo-coupon-area">
              <div class="combo-coupon-label">🎟️ Have a coupon code? Apply for extra ₹3,000 OFF!</div>
              <div class="combo-coupon-input-row">
                <input type="text" class="combo-coupon-input" id="coupon-input" 
                  placeholder="Enter coupon code" value="${couponCode}" />
                <button class="combo-coupon-apply" id="apply-coupon-btn">Apply</button>
              </div>
              ${couponMessage ? `
                <div class="combo-coupon-result ${couponValid ? 'success' : 'error'}">
                  ${couponValid ? '✅' : '❌'} ${couponMessage}
                </div>
              ` : ''}
              ${couponValid ? `
                <div class="combo-final-price">
                  <span class="combo-final-price-label">Final Price:</span>
                  <span class="combo-final-price-value">₹${finalPrice.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}
            </div>

            <div class="combo-actions">
              <button class="combo-btn combo-btn-buy" id="combo-buy-btn">
                🛒 Buy Now — ₹${finalPrice.toLocaleString('en-IN')}
              </button>
              <button class="combo-btn combo-btn-assess" id="combo-assess-btn">
                🎯 Get Coupon
              </button>
            </div>

            <!-- More Info -->
            <div class="combo-more-info">
              <button class="combo-info-toggle" id="combo-info-toggle">
                ℹ️ More Details <span class="toggle-arrow">▼</span>
              </button>
              <div class="combo-info-details" id="combo-info-details">
                <div class="combo-info-item">
                  <span class="combo-info-icon">📚</span>
                  <div class="combo-info-text">
                    <h4>Comprehensive Curriculum</h4>
                    <p>100+ lessons across 6 domains covering everything from communication to coding, AI to cybersecurity.</p>
                  </div>
                </div>
                <div class="combo-info-item">
                  <span class="combo-info-icon">🎓</span>
                  <div class="combo-info-text">
                    <h4>IITian Mentors</h4>
                    <p>Learn from graduates of IIT Delhi, IIT Bombay, IIT Kanpur, and other top institutes with industry experience.</p>
                  </div>
                </div>
                <div class="combo-info-item">
                  <span class="combo-info-icon">🏆</span>
                  <div class="combo-info-text">
                    <h4>Certificate of Completion</h4>
                    <p>Earn a verified certificate for each module you complete, add them to your LinkedIn profile.</p>
                  </div>
                </div>
                <div class="combo-info-item">
                  <span class="combo-info-icon">♾️</span>
                  <div class="combo-info-text">
                    <h4>Lifetime Access</h4>
                    <p>Once enrolled, access all course content forever. New content added regularly at no extra cost.</p>
                  </div>
                </div>
                <div class="combo-info-item">
                  <span class="combo-info-icon">🤖</span>
                  <div class="combo-info-text">
                    <h4>AI & Future Skills</h4>
                    <p>Stay ahead with modules on prompt engineering, AI tools, and emerging tech trends shaping the future.</p>
                  </div>
                </div>
                <div class="combo-info-item">
                  <span class="combo-info-icon">💼</span>
                  <div class="combo-info-text">
                    <h4>Career Ready</h4>
                    <p>Financial literacy, cybersecurity awareness, and soft skills to make you job-ready and financially smart.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== SEARCH & COURSE GRID ========== -->
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

        <!-- ========== MENTORS SECTION ========== -->
        <div class="mentors-section" id="mentors-section">
          <div class="mentors-header">
            <div class="mentors-badge">🎓 IITian Mentors</div>
            <h2 class="mentors-title">Learn from the Best</h2>
            <p class="mentors-subtitle">Our mentors are IIT graduates with real-world industry experience.</p>
          </div>

          ${mentors.length > 0 ? `
            <div class="mentors-scroll">
              ${mentors.map(m => `
                <div class="mentor-card">
                  <div class="mentor-photo">
                    ${m.photo ? `<img src="${m.photo}" alt="${m.name}" />` : `<span class="mentor-photo-placeholder">👨‍🏫</span>`}
                  </div>
                  <div class="mentor-info">
                    <h3 class="mentor-name">${m.name}</h3>
                    <div class="mentor-iit">🏛️ ${m.iitBranch}</div>
                    <p class="mentor-desc">${m.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="mentors-empty">
              <div class="mentors-empty-icon">🎓</div>
              <h3 style="color: var(--gray-500); font-size: 16px;">Our mentors are being onboarded</h3>
              <p style="color: var(--gray-400); font-size: 13px; margin-top: 4px;">Stay tuned for introductions to our IITian mentors!</p>
            </div>
          `}
        </div>
      </div>
    `;

    // ===== EVENT LISTENERS =====

    // Search
    container.querySelector('.search-input')?.addEventListener('input', () => {
      render();
      container.querySelector('.search-input').focus();
      const len = container.querySelector('.search-input').value.length;
      container.querySelector('.search-input').setSelectionRange(len, len);
    });

    // Course Grid Enroll/Start
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
        navigate(`/course/${btn.dataset.id}`);
      });
    });

    // Combo: Apply Coupon
    document.getElementById('apply-coupon-btn')?.addEventListener('click', () => {
      couponCode = document.getElementById('coupon-input')?.value || '';
      applyCoupon();
    });

    document.getElementById('coupon-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        couponCode = e.target.value;
        applyCoupon();
      }
    });

    // Combo: Buy Now
    document.getElementById('combo-buy-btn')?.addEventListener('click', () => {
      const fp = getComboFinalPrice();
      // Use the first published course or a special combo product
      // For now we trigger payment for a "combo" product
      handlePayment(
        courses.length > 0 ? courses[0].id : 'combo-course', 
        fp, 
        'All-in-One Combo Course',
        couponValid ? couponCode : null
      );
    });

    // Combo: Get Coupon / Assessment
    document.getElementById('combo-assess-btn')?.addEventListener('click', () => {
      navigate('/course-assessment');
    });

    // Combo: More Info Toggle
    document.getElementById('combo-info-toggle')?.addEventListener('click', () => {
      const details = document.getElementById('combo-info-details');
      const toggle = document.getElementById('combo-info-toggle');
      if (details) {
        details.classList.toggle('show');
        toggle.classList.toggle('open');
      }
    });
  }

  // Initial fetch
  fetchData();
}
