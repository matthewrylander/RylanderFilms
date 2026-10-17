import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const photos = {
  coast: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1100&q=80',
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=80',
  portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80',
}

const projects = [
  { name: 'A day that felt like you', client: 'Wedding film', type: 'Celebration', image: photos.wedding, position: 'center 58%' },
  { name: 'The moments between', client: 'Wedding film', type: 'Documentary', image: photos.coast, position: 'center 58%' },
]

const services = [
  ['01', 'Wedding films', 'A thoughtful, documentary-style record of the people and moments that make it yours.'],
  ['02', 'Full-day coverage', 'From getting ready through the ceremony, reception, and all the in-between.'],
  ['03', 'Ceremony & speeches', 'The full words, voices, and once-only moments, thoughtfully captured.'],
  ['04', 'Client films', 'Honest films for people and businesses with a story worth sharing.'],
]

const process = [
  ['01', 'Before the day', 'We talk through your timeline, the people and moments that matter most, and how to be present without making the day feel like a production.'],
  ['02', 'On the day', 'A calm, unobtrusive approach lets us capture the real moments as they happen—from getting ready to the dance floor.'],
  ['03', 'After the day', 'We shape the footage with careful editing, color, and sound, then deliver a film you can revisit and share.'],
]

const studioNotes = [
  {
    quote: 'The little glances, the happy tears, the people you love all in one room. A wedding film should bring you back to how it felt to be there.',
    name: 'THE HEART OF A WEDDING FILM',
    role: 'People, feeling, and all the moments in between',
  },
  {
    quote: 'Good client work starts with listening. We take the time to understand your people, your point of view, and what you want the film to do.',
    name: 'THE START OF EVERY CLIENT FILM',
    role: 'A collaborative process, shaped around your story',
  },
  {
    quote: 'The best films feel personal, never forced. We keep the crew considered, the process clear, and the attention on what matters.',
    name: 'HOW WE LIKE TO WORK',
    role: 'Thoughtful filmmaking, from first conversation to final cut',
  },
]

const packages = [
  {
    name: 'Essential Memories',
    description: 'A considered record of the day’s most meaningful moments.',
    includes: ['Up to 6 hours of wedding day coverage', 'Ceremony and key reception moments', 'Natural, documentary-style filming', '3–5 minute highlight video', 'Professional editing and color grading', 'Digital delivery'],
    featured: false,
  },
  {
    name: 'Full Story',
    description: 'More room for the story to unfold, from getting ready to the reception.',
    includes: ['Up to 8 hours of wedding day coverage', 'Getting ready, ceremony, and reception coverage', 'Drone footage of the venue and surrounding area, weather permitting', '5–7 minute highlight film', 'Professional editing, color grading, and audio mixing', 'Digital delivery'],
    featured: true,
  },
  {
    name: 'Complete Wedding Film',
    description: 'An extended record of the day, with the words and moments preserved in full.',
    includes: ['Up to 10 hours of wedding day coverage', 'Coverage from getting ready through the major reception events', 'Drone footage, weather permitting', '6–10 minute wedding film', 'Full ceremony edit', 'Full speeches/toasts edit', 'Professional editing, color grading, and audio mixing', 'Digital delivery'],
    featured: false,
  },
]

const ease = [0.22, 1, 0.36, 1]

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>
}

function ContactForm() {
  const [result, setResult] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    formData.append('access_key', '41f3069c-9cd4-45a0-b7fe-e2dd689287af')
    setIsSubmitting(true)
    setResult({ type: '', message: '' })

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Request failed with status ${response.status}`)
      }

      form.reset()
      setResult({ type: 'success', message: 'Thanks for reaching out! We’ll be in touch soon.' })
    } catch (error) {
      console.error('Unable to send contact form:', error)
      setResult({ type: 'error', message: 'Your message could not be sent. Please try again or email hello@rylanderfilms.com.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="contact-form" id="client-contact-form" onSubmit={onSubmit}>
      <p className="eyebrow"><span className="eyebrow-dot" /> TELL US A LITTLE ABOUT IT</p>
      <label htmlFor="contact-name">Your name</label>
      <input id="contact-name" name="name" type="text" autoComplete="name" required />
      <label htmlFor="contact-email">Email address</label>
      <input id="contact-email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="contact-message">A little about your day or project</label>
      <textarea id="contact-message" name="message" rows="4" required />
      <button className="button button-light" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Submit'} <Arrow diagonal />
      </button>
      {result.message && (
        <p className={`form-result form-result-${result.type}`} role={result.type === 'error' ? 'alert' : 'status'}>
          {result.message}
        </p>
      )}
    </form>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeQuote, setActiveQuote] = useState(0)
  const [isHeaderCompact, setIsHeaderCompact] = useState(false)

  useEffect(() => {
    const updateHeader = () => setIsHeaderCompact(window.scrollY > 32)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  return (
    <main className="overflow-x-hidden bg-ink text-paper">
      <header className={`site-header${isHeaderCompact ? ' is-compact' : ''}`}>
        <a className="wordmark" href="#top" aria-label="Rylander Films home" onClick={closeMenu}>
          <img className="wordmark-logo" src="/images/Rylander%20Film%20Co.%20Metallic%20Seal.png" alt="" />
          <span className="wordmark-copy">RYLANDER<br />FILMS</span>
        </a>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>Get in touch <Arrow diagonal /></a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-image" role="img" aria-label="Sunlight falling across a mountain valley at dawn" />
        <div className="hero-shade" />
        <div className="hero-content page-wrap">
          <Reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> INDEPENDENT FILMS · STORIES THAT MATTER</p>
            <h1 id="hero-title">Your story,<br /><em>beautifully told.</em></h1>
            <div className="hero-actions">
              <a className="button button-light" href="#contact">Let’s make something <Arrow diagonal /></a>
            </div>
          </Reveal>
        </div>
        <div className="hero-bottom page-wrap">
          <span>THOUGHTFUL FILMS · CHICAGO’S NORTHWEST SUBURBS & BEYOND</span>
          <a href="#work" aria-label="Scroll to portfolio">SCROLL TO EXPLORE <span className="scroll-line" /></a>
        </div>
      </section>

      <section className="services-section section-pad" id="services">
        <div className="page-wrap">
          <Reveal className="section-heading services-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" /> MADE FOR PEOPLE, NEVER JUST FOR THE CAMERA</p>
              <h2>What we <em>film.</em></h2>
            </div>
            <p className="heading-note">Wedding days and client stories,<br />captured with intention.</p>
          </Reveal>
          <div className="services-grid">
            {services.map(([number, title, description], index) => (
              <Reveal className="service-card" delay={index * 0.07} key={number}>
                <span className="service-number">{number} / 04</span>
                <span className="service-mark" aria-hidden="true">{['◉', '◌', '↗', '✳'][index]}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <a href="#contact" aria-label={`Discuss ${title}`}><Arrow diagonal /></a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="work-section section-pad" id="work">
        <div className="page-wrap">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" /> WEDDING FILMS & CLIENT WORK</p>
              <h2>Stories made <em>together.</em></h2>
            </div>
            <a className="text-link work-link" href="#contact">Want to see the full films? Reach out here <Arrow diagonal /></a>
          </Reveal>
          <div className="work-grid">
            {projects.map((project, index) => (
              <Reveal className={`project-card project-card-${index + 1}`} delay={(index % 2) * 0.1} key={project.name}>
                <a className="project-image-wrap" href="#contact" aria-label={`Discuss a project like ${project.name}`}>
                  <img
                    src={project.image}
                    alt={`${project.type} film still from ${project.name} — ${project.client}`}
                    loading="lazy"
                    style={{ objectPosition: project.position }}
                  />
                  <span className="project-open"><Arrow diagonal /></span>
                </a>
                <div className="project-meta">
                  <div><h3>{project.name}</h3><p>{project.client}</p></div>
                  <span>{project.type}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="work-foot">
            <span>EVERY FRAME IS PART OF A BIGGER STORY.</span>
            <a className="text-link" href="#contact">Make something together <Arrow diagonal /></a>
          </Reveal>
        </div>
      </section>

      <section className="process-section section-pad">
        <div className="page-wrap process-layout">
          <Reveal className="process-intro">
            <p className="eyebrow"><span className="eyebrow-dot" /> HERE FOR THE MOMENT, NEVER IN THE WAY</p>
            <h2>How your day<br />becomes a <em>film.</em></h2>
            <p>We keep the process clear and the camera presence calm, so you can stay close to the people and moments that matter.</p>
            <a className="text-link" href="#contact">Talk through your wedding plans <Arrow diagonal /></a>
          </Reveal>
          <div className="process-steps">
            {process.map(([number, title, description], index) => (
              <Reveal className="process-step" delay={index * 0.08} key={number}>
                <span className="process-number">{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <span className="step-mark" aria-hidden="true">↗</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="page-wrap about-layout">
          <Reveal className="about-photo-wrap">
            <img src={photos.portrait} alt="Portrait of the independent filmmaker behind Rylander Films" loading="lazy" />
            <div className="photo-stamp"><span>INDEPENDENT</span><i>·</i><span>FILMMAKER</span></div>
            <span className="about-photo-index">BEHIND THE LENS — 2025</span>
          </Reveal>
          <Reveal className="about-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> DIRECT COLLABORATION</p>
            <h2>Film made<br /><em>with purpose.</em></h2>
            <p className="about-lede">I’m Matt Rylander, an independent filmmaker based in Chicago’s Northwest suburbs. I work directly with each client from the first conversation through final delivery.</p>
            <p className="about-detail">For weddings, I take a documentary approach, capturing the day as it happens without staging every moment. I handle filming and editing myself. I also create films for businesses and organizations, helping shape a clear story and deliver a polished final piece.</p>
            <span className="signature">Matt Rylander <span>— FILMMAKER</span></span>
          </Reveal>
        </div>
      </section>

      <section className="testimonial-section section-pad">
        <div className="page-wrap testimonial-layout">
          <Reveal className="testimonial-aside">
            <p className="eyebrow"><span className="eyebrow-dot" /> WHAT WE WANT EVERY FILM TO HOLD</p>
            <h2>Made to <em>matter.</em></h2>
            <div className="quote-controls">
              <button type="button" aria-label="Previous studio note" onClick={() => setActiveQuote((activeQuote + studioNotes.length - 1) % studioNotes.length)}>←</button>
              <span>0{activeQuote + 1} <i>/</i> 0{studioNotes.length}</span>
              <button type="button" aria-label="Next studio note" onClick={() => setActiveQuote((activeQuote + 1) % studioNotes.length)}>→</button>
            </div>
          </Reveal>
          <div className="quote-container" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.blockquote
                className="quote-card"
                key={activeQuote}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35 }}
              >
                <span className="quote-mark">“</span>
                <p>{studioNotes[activeQuote].quote}</p>
                <footer><span className="quote-avatar" aria-hidden="true">RF</span><span><strong>{studioNotes[activeQuote].name}</strong><small>{studioNotes[activeQuote].role}</small></span></footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="investment-section section-pad">
        <div className="page-wrap">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" /> WEDDING FILM COVERAGE</p>
              <h2>Choose your <em>story.</em></h2>
            </div>
            <p className="heading-note">A few ways to remember the day.<br />We’ll help find the right fit.</p>
          </Reveal>
          <div className="package-grid">
            {packages.map((tier, index) => (
              <Reveal className={`package-card${tier.featured ? ' package-featured' : ''}`} delay={index * 0.08} key={tier.name}>
                {tier.featured && <span className="package-badge">A GOOD PLACE TO BEGIN</span>}
                <span className="package-index">0{index + 1} / WEDDING FILM</span>
                <h3>{tier.name}</h3>
                <p>{tier.description}</p>
                <ul>{tier.includes.map((item) => <li key={item}><span>+</span>{item}</li>)}</ul>
                <a href="#contact" className={tier.featured ? 'button button-light' : 'text-link'}>Let’s talk details <Arrow diagonal /></a>
              </Reveal>
            ))}
          </div>
          <p className="budget-note">Have questions or a different timeline in mind? <a href="#contact">Let’s talk about your day <Arrow diagonal /></a></p>
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <div className="page-wrap footer-top">
          <Reveal className="footer-callout">
            <p className="eyebrow"><span className="eyebrow-dot" /> GETTING MARRIED OR HAVE A STORY TO TELL?</p>
            <h2>Let’s make it<br /><em>memorable.</em></h2>
            <div className="footer-social">
              <span className="footer-label">FIND US</span>
              <div>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <Arrow diagonal /></a>
                <a href="https://vimeo.com/" target="_blank" rel="noreferrer">Vimeo <Arrow diagonal /></a>
                <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube <Arrow diagonal /></a>
              </div>
            </div>
          </Reveal>
          <div className="footer-contact">
            <ContactForm />
            <Reveal className="footer-details">
              <div><span className="footer-label">PREFER EMAIL?</span><a href="mailto:hello@rylanderfilms.com">hello@rylanderfilms.com</a></div>
            </Reveal>
          </div>
        </div>
        <div className="page-wrap footer-bottom">
          <a className="wordmark footer-wordmark" href="#top" aria-label="Rylander Films home"><img className="wordmark-logo" src="/images/Rylander%20Film%20Co.%20Metallic%20Seal.png" alt="" /><span className="wordmark-copy">RYLANDER<br />FILMS</span></a>
          <span>WEDDING FILMS & CLIENT STORIES · CHICAGO’S NORTHWEST SUBURBS & BEYOND</span>
          <span>© 2026 RYLANDER FILMS</span>
          <a className="back-top" href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </main>
  )
}

export default App
