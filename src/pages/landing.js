// ===== Landing Page (Exact Find Your Spark - Final Sync) =====
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
      <!-- 11 Floating Background Icons (Exactly positioned relative to center) -->
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
            Every Child Has a<br/>
            <span class="landing__title-accent">Hidden Superpower</span>
          </h1>
          
          <p class="landing__subtitle">
            Our science-backed assessment uncovers your child's unique talents, learning style, and untapped potential — in just 5 fun minutes.
          </p>

          <div class="landing__cta-row">
            <button class="landing__cta-btn" id="hero-start-btn">
              Discover My Superpower
              <span class="landing__cta-icon-arrow">→</span>
            </button>
            <div class="landing__cta-note">
              <span class="landing__cta-star-yellow">⭐</span> Free • No signup required
            </div>
          </div>

          <!-- Hero Metrics Grid -->
          <div class="landing__stats-grid">
            <div class="landing__stat-card">
              <span class="landing__stat-emoji">🧠</span>
              <div class="landing__stat-info">
                <div class="landing__stat-title">6 Intelligence Areas</div>
                <div class="landing__stat-text">Holistic assessment</div>
              </div>
            </div>
            <div class="landing__stat-card">
              <span class="landing__stat-emoji">⏱️</span>
              <div class="landing__stat-info">
                <div class="landing__stat-title">5 Minutes</div>
                <div class="landing__stat-text">Quick & engaging</div>
              </div>
            </div>
            <div class="landing__stat-card">
              <span class="landing__stat-emoji">📊</span>
              <div class="landing__stat-info">
                <div class="landing__stat-title">Detailed Report</div>
                <div class="landing__stat-text">Actionable insights</div>
              </div>
            </div>
            <div class="landing__stat-card">
              <span class="landing__stat-emoji">🎯</span>
              <div class="landing__stat-info">
                <div class="landing__stat-title">Personalized</div>
                <div class="landing__stat-text">Unique to your child</div>
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
                <h3 class="landing__step-title">Take the Fun Quiz</h3>
                <p class="landing__step-text">Answer 12 engaging, age-appropriate questions designed by child psychologists. No pressure — it feels like a game!</p>
              </div>
            </div>
            
            <div class="landing__step-item">
              <div class="landing__step-icon-wrap icon-pink"><span class="landing__step-emoji">🧠</span></div>
              <div class="landing__step-card">
                <span class="landing__step-number">STEP 02</span>
                <h3 class="landing__step-title">AI Analyzes 6 Intelligences</h3>
                <p class="landing__step-text">Our algorithm maps responses across Logical, Creative, Social, Physical, Linguistic, and Nature intelligence dimensions.</p>
              </div>
            </div>
            
            <div class="landing__step-item">
              <div class="landing__step-icon-wrap icon-orange"><span class="landing__step-emoji">📊</span></div>
              <div class="landing__step-card">
                <span class="landing__step-number">STEP 03</span>
                <h3 class="landing__step-title">Get Your Detailed Report</h3>
                <p class="landing__step-text">Receive a comprehensive skill profile with strengths, growth areas, recommended activities, and career pathways.</p>
              </div>
            </div>

            <div class="landing__step-item">
              <div class="landing__step-icon-wrap icon-green"><span class="landing__step-emoji">🚀</span></div>
              <div class="landing__step-card">
                <span class="landing__step-number">STEP 04</span>
                <h3 class="landing__step-title">Start the Growth Journey</h3>
                <p class="landing__step-text">Use personalized recommendations to nurture your child's unique talents with curated activities and learning paths.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Intelligence Dimensions -->
        <section class="landing__intelligence">
          <h2 class="landing__section-title">6 Types of <span class="text-purple">Intelligence</span></h2>
          <p class="landing__section-desc">Every child is intelligent — just in different ways. We measure all six dimensions.</p>
          
          <div class="landing__intelligence-grid">
            <div class="landing__intel-card intel-purple">
              <span class="landing__intel-emoji">🧠</span>
              <h4 class="landing__intel-title">Logical-Mathematical</h4>
              <p class="landing__intel-text">Problem-solving, patterns, numbers & critical thinking.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">POTENTIAL CAREERS</span>
                <p class="landing__intel-careers">Engineer, Scientist, Data Analyst</p>
              </div>
            </div>
            <div class="landing__intel-card intel-pink">
              <span class="landing__intel-emoji">🎨</span>
              <h4 class="landing__intel-title">Creative-Artistic</h4>
              <p class="landing__intel-text">Imagination, design, music & visual expression.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">POTENTIAL CAREERS</span>
                <p class="landing__intel-careers">Designer, Artist, Architect</p>
              </div>
            </div>
            <div class="landing__intel-card intel-gold">
              <span class="landing__intel-emoji">🤝</span>
              <h4 class="landing__intel-title">Social-Interpersonal</h4>
              <p class="landing__intel-text">Leadership, empathy, communication & teamwork.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">POTENTIAL CAREERS</span>
                <p class="landing__intel-careers">Teacher, Counselor, Manager</p>
              </div>
            </div>
            <div class="landing__intel-card intel-coral">
              <span class="landing__intel-emoji">🏃</span>
              <h4 class="landing__intel-title">Physical-Kinesthetic</h4>
              <p class="landing__intel-text">Sports, coordination, hands-on learning & movement.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">POTENTIAL CAREERS</span>
                <p class="landing__intel-careers">Athlete, Surgeon, Pilot</p>
              </div>
            </div>
            <div class="landing__intel-card intel-blue">
              <span class="landing__intel-emoji">📚</span>
              <h4 class="landing__intel-title">Linguistic-Verbal</h4>
              <p class="landing__intel-text">Reading, writing, storytelling & debate.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">POTENTIAL CAREERS</span>
                <p class="landing__intel-careers">Writer, Lawyer, Journalist</p>
              </div>
            </div>
            <div class="landing__intel-card intel-green">
              <span class="landing__intel-emoji">🌱</span>
              <h4 class="landing__intel-title">Nature-Environmental</h4>
              <p class="landing__intel-text">Observation, ecology, animals & outdoor exploration.</p>
              <div class="landing__intel-footer">
                <span class="landing__intel-label">POTENTIAL CAREERS</span>
                <p class="landing__intel-careers">Biologist, Farmer, Environmentalist</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Testimonials -->
        <section class="landing__testimonials">
          <h2 class="landing__section-title">Parents Love the Results</h2>
          <div class="landing__testimonial-grid">
            <div class="landing__testimonial-card">
              <p class="landing__testimonial-text">"We discovered our son has incredible spatial intelligence. Now he's thriving in a robotics program we never would have considered!"</p>
              <span class="landing__testimonial-author">— Sarah M.</span>
            </div>
            <div class="landing__testimonial-card">
              <p class="landing__testimonial-text">"The report was eye-opening. My daughter's linguistic skills were off the charts — she now writes stories and dreams of becoming an author."</p>
              <span class="landing__testimonial-author">— David R.</span>
            </div>
            <div class="landing__testimonial-card">
              <p class="landing__testimonial-text">"As a teacher, I recommend this to every parent. It helps me understand each student's unique learning style better."</p>
              <span class="landing__testimonial-author">— Ms. Priya K.</span>
            </div>
          </div>
        </section>

        <!-- Bottom CTA -->
        <section class="landing__bottom-cta">
          <!-- Decorative Blobs for the Mesh Gradient effect -->
          <div class="landing__blob blob-1"></div>
          <div class="landing__blob blob-2"></div>
          
          <div class="landing__bottom-drawer">
            <div class="landing__bottom-star-wrap">
              <span class="landing__bottom-star">⭐</span>
            </div>
            
            <h2 class="landing__bottom-title">
              Ready to Discover Your Child's <span class="text-purple">True Potential?</span>
            </h2>
            
            <p class="landing__bottom-subtitle">
              Join thousands of parents who have unlocked their children's hidden talents. It only takes 5 minutes.
            </p>

            <button class="landing__cta-btn landing__cta-btn--large landing__cta-btn--glow" id="bottom-start-btn">
              <span class="landing__cta-icon-rocket">🚀</span>
              Start Free Assessment
              <span class="landing__cta-icon-arrow">→</span>
            </button>
            
            <div class="landing__bottom-note">
              <span class="landing__note-sparkle">✨</span>
              Free forever • No signup • Instant results
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="landing__footer">
          <div class="landing__footer-content">
            <p class="landing__footer-text">✨ FindYourSpark. Helping every child discover their unique superpower. Built with ❤️ for curious minds. © 2026 FindYourSpark</p>
          </div>
        </footer>
      </div>
    </div>
  `;

  // Attach Listeners
  document.getElementById('hero-start-btn')?.addEventListener('click', handleStart);
  document.getElementById('bottom-start-btn')?.addEventListener('click', handleStart);
}

