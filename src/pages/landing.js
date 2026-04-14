// ===== Landing Page (Apni Vidya Branding) =====
import { navigate } from '../router.js';
import { isLoggedIn } from '../utils/storage.js';

export function renderLanding(container) {
  // Navigation Handler
  const handleStart = () => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  container.innerHTML = `
    <div class="landing">
      <!-- Floating Background Icons -->
      <div class="landing__floating-icon" style="top: 50px; left: calc(50% - 400px);">🔬</div>
      <div class="landing__floating-icon" style="top: 100px; left: calc(50% - 550px);">🚀</div>
      <div class="landing__floating-icon" style="top: 100px; left: calc(50% + 450px);">🎭</div>
      <div class="landing__floating-icon" style="top: 150px; left: calc(50% - 300px);">🎨</div>
      <div class="landing__floating-icon" style="top: 200px; left: calc(50% + 350px);">🧩</div>
      <div class="landing__floating-icon" style="top: 240px; left: calc(50% - 600px);">🌈</div>
      <div class="landing__floating-icon" style="top: 280px; left: calc(50% + 550px);">💡</div>
      <div class="landing__floating-icon" style="top: 330px; left: calc(50% - 500px);">🎯</div>
      <div class="landing__floating-icon" style="top: 370px; left: calc(50% + 400px);">🌟</div>
      <div class="landing__floating-icon" style="top: 420px; left: calc(50% - 650px);">🎶</div>
      <div class="landing__floating-icon" style="top: 470px; left: calc(50% + 250px);">📚</div>

      <div class="landing__container">
        <!-- Hero Section -->
        <section class="landing__hero">
          <div class="landing__banner">
            <span class="landing__banner-label">Students Assessed</span>
            <span class="landing__banner-count">10,000+</span>
          </div>
          
          <h1 class="landing__title">
            Unlock Your<br/>
            <span class="landing__title-accent">True Potential</span>
          </h1>
          
          <p class="landing__subtitle">
            Apni Vidya empowers you with project-based courses and expert mentorship to build skills that matter in the real world.
          </p>

          <div class="landing__cta-row">
            <button class="landing__cta-btn" id="hero-start-btn">
              Explore Our Courses
              <span class="landing__cta-icon-arrow">→</span>
            </button>
            <div class="landing__cta-note">
              <span class="landing__cta-star-yellow">⭐</span> Join 10k+ Learners
            </div>
          </div>

          <!-- Hero Metrics Grid -->
          <div class="landing__stats-grid">
            <div class="landing__stat-card">
              <span class="landing__stat-emoji">🧠</span>
              <div class="landing__stat-info">
                <div class="landing__stat-title">6 Skill Areas</div>
                <div class="landing__stat-text">Holistic learning</div>
              </div>
            </div>
            <div class="landing__stat-card">
              <span class="landing__stat-emoji">👨‍🏫</span>
              <div class="landing__stat-info">
                <div class="landing__stat-title">IITian Mentors</div>
                <div class="landing__stat-text">Learn from experts</div>
              </div>
            </div>
            <div class="landing__stat-card">
              <span class="landing__stat-emoji">🛠️</span>
              <div class="landing__stat-info">
                <div class="landing__stat-title">Project Based</div>
                <div class="landing__stat-text">Real-world experience</div>
              </div>
            </div>
            <div class="landing__stat-card">
              <span class="landing__stat-emoji">🏆</span>
              <div class="landing__stat-info">
                <div class="landing__stat-title">Certifications</div>
                <div class="landing__stat-text">Industry recognized</div>
              </div>
            </div>
          </div>
        </section>

        <!-- How It Works -->
        <section class="landing__process">
          <div class="landing__badge-simple">Simple Process</div>
          <h2 class="landing__section-title">How It Works</h2>
          
          <div class="landing__steps-container">
            <div class="landing__step-line"></div>
            
            <div class="landing__step-item">
              <div class="landing__step-icon-wrap icon-purple"><span class="landing__step-emoji">🎮</span></div>
              <div class="landing__step-card">
                <span class="landing__step-number">STEP 01</span>
                <h3 class="landing__step-title">Take the Assessment</h3>
                <p class="landing__step-text">Discover your strengths and interests through our fun, gamified assessment designed by experts.</p>
              </div>
            </div>
            
            <div class="landing__step-item">
              <div class="landing__step-icon-wrap icon-pink"><span class="landing__step-emoji">🧠</span></div>
              <div class="landing__step-card">
                <span class="landing__step-number">STEP 02</span>
                <h3 class="landing__step-title">Get Personalized Path</h3>
                <p class="landing__step-text">Receive a tailored learning journey based on your assessment results and career goals.</p>
              </div>
            </div>
            
            <div class="landing__step-item">
              <div class="landing__step-icon-wrap icon-orange"><span class="landing__step-emoji">📊</span></div>
              <div class="landing__step-card">
                <span class="landing__step-number">STEP 03</span>
                <h3 class="landing__step-title">Learn by Doing</h3>
                <p class="landing__step-text">Engage in project-based learning with hands-on exercises and expert guidance from IITian mentors.</p>
              </div>
            </div>

            <div class="landing__step-item">
              <div class="landing__step-icon-wrap icon-green"><span class="landing__step-emoji">🚀</span></div>
              <div class="landing__step-card">
                <span class="landing__step-number">STEP 04</span>
                <h3 class="landing__step-title">Achieve Your Goals</h3>
                <p class="landing__step-text">Earn certificates, build your portfolio, and launch your career in top technology fields.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Intelligence Dimensions -->
        <section class="landing__intelligence">
          <h2 class="landing__section-title">6 Core <span class="text-purple">Programs</span></h2>
          <p class="landing__section-desc">We offer high-impact courses across critical future skills.</p>
          
          <div class="landing__intelligence-grid">
            <div class="landing__intel-card intel-purple">
              <span class="landing__intel-emoji">💻</span>
              <h4 class="landing__intel-title">Web Development</h4>
              <p class="landing__intel-text">Build modern, responsive websites and applications using the latest technologies.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">SKILLS</span>
                <p class="landing__intel-careers">React, Node.js, Next.js</p>
              </div>
            </div>
            <div class="landing__intel-card intel-pink">
              <span class="landing__intel-emoji">🤖</span>
              <h4 class="landing__intel-title">AI & Data Science</h4>
              <p class="landing__intel-text">Master Python, Machine Learning, and AI tools to solve complex real-world problems.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">SKILLS</span>
                <p class="landing__intel-careers">Python, ML, NLP, Pandas</p>
              </div>
            </div>
            <div class="landing__intel-card intel-gold">
              <span class="landing__intel-emoji">📈</span>
              <h4 class="landing__intel-title">Digital Marketing</h4>
              <p class="landing__intel-text">Learn SEO, Social Media, and Performance Marketing to grow any business online.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">SKILLS</span>
                <p class="landing__intel-careers">SEO, Ads, Analytics</p>
              </div>
            </div>
            <div class="landing__intel-card intel-coral">
              <span class="landing__intel-emoji">🎨</span>
              <h4 class="landing__intel-title">Design UI/UX</h4>
              <p class="landing__intel-text">Create beautiful, user-centered designs for products that people love to use.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">SKILLS</span>
                <p class="landing__intel-careers">Figma, Adobe XD, Prototyping</p>
              </div>
            </div>
            <div class="landing__intel-card intel-blue">
              <span class="landing__intel-emoji">💼</span>
              <h4 class="landing__intel-title">Business Strategy</h4>
              <p class="landing__intel-text">Develop management and leadership skills to excel in corporate environments.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">SKILLS</span>
                <p class="landing__intel-careers">Leadership, Finance, Ops</p>
              </div>
            </div>
            <div class="landing__intel-card intel-green">
              <span class="landing__intel-emoji">🛡️</span>
              <h4 class="landing__intel-title">Cyber Security</h4>
              <p class="landing__intel-text">Stay ahead of threats and protect digital assets with advanced security practices.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">SKILLS</span>
                <p class="landing__intel-careers">Ethical Hacking, Network Security</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Testimonials -->
        <section class="landing__testimonials">
          <h2 class="landing__section-title">Success Stories</h2>
          <div class="landing__testimonial-grid">
            <div class="landing__testimonial-card">
              <p class="landing__testimonial-text">"The mentorship from IITian experts at Apni Vidya helped me land my dream role at a top tech company. Project-based learning is the way to go!"</p>
              <span class="landing__testimonial-author">— Aman S.</span>
            </div>
            <div class="landing__testimonial-card">
              <p class="landing__testimonial-text">"I started with zero coding knowledge and built my first SaaS product within 3 months. The community and mentors are amazing."</p>
              <span class="landing__testimonial-author">— Riya M.</span>
            </div>
            <div class="landing__testimonial-card">
              <p class="landing__testimonial-text">"As a working professional, the flexible learning path and actionable insights into AI really helped me transition into Data Science."</p>
              <span class="landing__testimonial-author">— Rahul K.</span>
            </div>
          </div>
        </section>

        <!-- Bottom CTA -->
        <section class="landing__bottom-cta">
          <!-- Decorative Blobs -->
          <div class="landing__blob blob-1"></div>
          <div class="landing__blob blob-2"></div>
          
          <div class="landing__bottom-drawer">
            <div class="landing__bottom-star-wrap">
              <span class="landing__bottom-star">⭐</span>
            </div>
            
            <h2 class="landing__bottom-title">
              Ready to Discover Your <span class="text-purple">True Potential?</span>
            </h2>
            
            <p class="landing__bottom-subtitle">
              Join thousands of learners who have transformed their careers with Apni Vidya. Start your journey today.
            </p>

            <button class="landing__cta-btn landing__cta-btn--large landing__cta-btn--glow" id="bottom-start-btn">
              <span class="landing__cta-icon-rocket">🚀</span>
              Get Started Now
              <span class="landing__cta-icon-arrow">→</span>
            </button>
            
            <div class="landing__bottom-note">
              <span class="landing__note-sparkle">✨</span>
              Lifetime Access • Industry Mentors • Practical Learning
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="landing__footer-new">
          <div class="landing__footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">A</div>
              <span class="footer-brand-name">Apni Vidya</span>
              <p class="footer-brand-desc">Empowering students with real-world skills through live interactive classes taught by IITians. Building the next generation of leaders.</p>
              <div class="footer-socials">
                <a href="https://www.facebook.com/share/1CW3KDxSqx/" target="_blank" class="social-icon" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://x.com/apnividya" target="_blank" class="social-icon" aria-label="X">
                  <span style="font-weight: bold; font-size: 18px;">𝕏</span>
                </a>
                <a href="https://www.instagram.com/apnividya?igsh=Y3pieGJjcGV5ZGJt" target="_blank" class="social-icon" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/apnividya/" target="_blank" class="social-icon" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
            <div class="footer-column">
              <h3 class="footer-heading">Quick Links</h3>
              <ul class="footer-links">
                <li><a href="#/">Home</a></li>
                <li><a href="#/courses">Courses</a></li>
                <li><a href="#/become-mentor">Become a Mentor</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h3 class="footer-heading">Legal</h3>
              <ul class="footer-links">
                <li><a href="#/legal#privacy">Privacy Policy</a></li>
                <li><a href="#/legal#terms">Terms of Service</a></li>
                <li><a href="#/legal#refund">Refund Policy</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h3 class="footer-heading">Contact Us</h3>
              <ul class="footer-contact-info">
                <li>
                  <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  <span>Agartala, India</span>
                </li>
                <li>
                  <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <span>+91 60093 96197</span>
                </li>
                <li>
                  <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <span>apnividya.in@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="landing__footer-bottom">
            <p>&copy; 2026 Apni Vidya. All rights reserved. Made with <span style="color: #ef4444;">❤</span> for Students.</p>
          </div>
        </footer>
      </div>
    </div>
  `;

  // Attach Listeners
  document.getElementById('hero-start-btn')?.addEventListener('click', handleStart);
  document.getElementById('bottom-start-btn')?.addEventListener('click', handleStart);
}

