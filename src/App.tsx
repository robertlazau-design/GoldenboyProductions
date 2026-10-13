import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight, ArrowLeft, Plus, Minus, Camera, X, Send, Mail, Play } from 'lucide-react';
import { biography, clientApproach, consultingServices, finishedProjects, currentProjects, favoriteMovies, behindTheScenes, faqs, recommendableMovies } from './data';
import robertBackground from '../assets/robert_background.jpg';
import { TAB_ROUTES, tabFromPath, canonicalUrl, type Tab } from './seo';

const isVideoFile = (url: string) => {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(url);
};

const isDriveVideo = (url: string) => {
  if (!url) return false;
  return url.includes('drive.google.com/file/d/') && url.endsWith('/preview');
};

const isAnyVideo = (url: string) => isVideoFile(url) || isDriveVideo(url);

const setMeta = (selector: string, attr: string, value: string) =>
  document.querySelector(selector)?.setAttribute(attr, value);

const applyTabMeta = (tab: Tab) => {
  const { title, description } = TAB_ROUTES[tab];
  const url = canonicalUrl(tab);
  document.title = title;
  setMeta('link[rel="canonical"]', 'href', url);
  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[property="og:url"]', 'content', url);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[name="twitter:url"]', 'content', url);
  setMeta('meta[name="twitter:title"]', 'content', title);
  setMeta('meta[name="twitter:description"]', 'content', description);
};

// Internal page links are real <a href>s so crawlers can follow them;
// a plain left-click is handled in-app without a reload.
const isPlainClick = (e: React.MouseEvent) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export default function App({ initialPath }: { initialPath?: string }) {
  const [activeTab, setActiveTabState] = useState<Tab>(() => tabFromPath(initialPath ?? window.location.pathname));

  const setActiveTab = (tab: Tab) => {
    setActiveTabState(tab);
    if (window.location.pathname !== TAB_ROUTES[tab].path) {
      window.history.pushState({ tab }, '', TAB_ROUTES[tab].path);
    }
  };

  const tabLink = (tab: Tab) => ({
    href: TAB_ROUTES[tab].path,
    onClick: (e: React.MouseEvent) => {
      if (!isPlainClick(e)) return;
      e.preventDefault();
      setActiveTab(tab);
    },
  });

  // Keep tab, title and canonical in sync with the URL (including back/forward)
  useEffect(() => {
    applyTabMeta(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const onPopState = () => setActiveTabState(tabFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const [activeBts, setActiveBts] = useState<typeof behindTheScenes[0] | null>(null);
  const [activeProjectVideo, setActiveProjectVideo] = useState<typeof finishedProjects[0] | null>(null);

  // Movie reviews are published by adding entries to favoriteMovies in data.ts
  const reviews = favoriteMovies;

  // Recommendation send status
  const [recSending, setRecSending] = useState(false);
  const [recSent, setRecSent] = useState(false);

  // Recommendation Form State
  const [showRecForm, setShowRecForm] = useState(false);
  const [recSearchQuery, setRecSearchQuery] = useState('');
  const [recDropdownOpen, setRecDropdownOpen] = useState(false);
  const [recMovieTitle, setRecMovieTitle] = useState('');
  const [recMovieDirector, setRecMovieDirector] = useState('');
  const [recMovieYear, setRecMovieYear] = useState('');
  const [recName, setRecName] = useState('');
  const [recComment, setRecComment] = useState('');
  const [recError, setRecError] = useState('');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactType, setContactType] = useState('Commercial / Brand Campaign');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Behind the Scenes active slide index
  const [currentBtsIndex, setCurrentBtsIndex] = useState(0);

  // Auto-rotate effect for BTS slideshow
  useEffect(() => {
    if (activeTab !== 'bts') return;
    const interval = setInterval(() => {
      setCurrentBtsIndex((prevIndex) => (prevIndex + 1) % behindTheScenes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Custom Cursor Spring Follower Coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 220 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isCursorVisible) setIsCursorVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
      setIsHovered(!!isClickable);
    };

    const handleMouseLeave = () => setIsCursorVisible(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', checkIsDesktop);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isCursorVisible]);

  // Handle body cursor override class
  useEffect(() => {
    if (isDesktop && isCursorVisible) {
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
    }
    return () => document.body.classList.remove('custom-cursor-active');
  }, [isDesktop, isCursorVisible]);

  // Profanity / offensive content filter
  const containsOffensiveContent = (text: string): boolean => {
    const normalized = text.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ');
    // Comprehensive list of slurs, obscenities, and offensive terms
    const offensivePatterns = [
      // Racial / ethnic slurs
      'nigger', 'nigga', 'negro', 'coon', 'spic', 'spick', 'wetback', 'beaner',
      'chink', 'gook', 'slant', 'zipperhead', 'raghead', 'towelhead', 'camel jockey',
      'kike', 'hymie', 'sheeny', 'heeb', 'dago', 'wop', 'guinea', 'greaseball',
      'honky', 'cracker', 'redneck', 'white trash', 'paki', 'darkie', 'jigaboo',
      'pickaninny', 'sambo', 'uncle tom', 'redskin', 'injun', 'squaw',
      // Homophobic / transphobic slurs
      'faggot', 'fag', 'dyke', 'queer', 'tranny', 'shemale', 'homo',
      // Sexist slurs
      'bitch', 'whore', 'slut', 'cunt', 'twat', 'skank', 'hoe',
      // General obscenities
      'fuck', 'fucking', 'fucker', 'motherfucker', 'shit', 'shitty', 'bullshit',
      'ass', 'asshole', 'bastard', 'damn', 'dick', 'cock', 'pussy', 'piss',
      'tits', 'boobs', 'penis', 'vagina', 'anus', 'dildo', 'blowjob',
      'handjob', 'jerkoff', 'wanker', 'tosser', 'bellend', 'bollocks',
      // Hate speech patterns
      'kill yourself', 'kys', 'die', 'go die', 'neck yourself',
      'white power', 'white supremacy', 'heil hitler', 'nazi', 'sieg heil',
      'gas the', 'race war', 'ethnic cleansing', 'lynch',
      // Other offensive terms
      'retard', 'retarded', 'tard', 'autistic', 'spaz', 'spastic',
      'cripple', 'mongoloid', 'imbecile', 'moron',
    ];
    return offensivePatterns.some(word => {
      // Match as whole word boundaries using spaces
      const regex = new RegExp(`(^|\\s)${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(s|es|ed|ing|er)?(\\s|$)`, 'i');
      return regex.test(normalized);
    });
  };

  // Submit visitor movie recommendation — emailed to Robert via EmailJS
  const handleRecSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecError('');

    if (!recMovieTitle.trim()) {
      setRecError('Please enter a movie title.');
      return;
    }

    // Check all text fields for offensive content
    const fieldsToCheck = [
      { value: recComment, label: 'comment' },
      { value: recName, label: 'name' },
      { value: recMovieTitle, label: 'movie title' },
    ];
    for (const field of fieldsToCheck) {
      if (containsOffensiveContent(field.value)) {
        setRecError(`Your ${field.label} contains language that is not permitted. Please keep submissions respectful and appropriate.`);
        return;
      }
    }

    const director = recMovieDirector.trim() || 'Unknown director';
    const year = recMovieYear.trim() || 'year unknown';
    setRecSending(true);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_qiwj9ck',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_dxzql3r',
        {
          from_name: recName.trim() || 'Anonymous Cinephile',
          from_email: 'not provided',
          project_type: 'Movie Recommendation',
          message: `${recMovieTitle.trim()} (${director}, ${year})${recComment.trim() ? `\n\nWhy: ${recComment.trim()}` : ''}`,
          to_email: 'robertlazau@gmail.com',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'HCe1iw0Kc6rDNVge8'
      );

      // Reset inputs
      setRecMovieTitle('');
      setRecMovieDirector('');
      setRecMovieYear('');
      setRecSearchQuery('');
      setRecName('');
      setRecComment('');
      setRecSent(true);
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      setRecError("Sorry, your recommendation couldn't be sent. You can email it to Robert at robertlazau@gmail.com.");
    } finally {
      setRecSending(false);
    }
  };

  // Contact Form Submit Handler — sends email via EmailJS
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);

    const templateParams = {
      from_name: contactName,
      from_email: contactEmail,
      project_type: contactType,
      message: contactMessage,
      to_email: 'robertlazau@gmail.com',
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_qiwj9ck',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_dxzql3r',
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'HCe1iw0Kc6rDNVge8'
      );
      setContactName('');
      setContactEmail('');
      setContactType('Commercial / Brand Campaign');
      setContactMessage('');
      alert('Your message has been sent successfully! Robert will review it shortly.');
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      alert("Sorry, your message couldn't be sent. Please email Robert directly at robertlazau@gmail.com.");
    } finally {
      setContactSent(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060606] text-[#e5e5e5] font-sans selection:bg-[#fff] selection:text-[#060606]">
      {/* Animated Film Grain Overlay */}
      <div className="film-grain" />


      {/* Custom Mouse Cursor (Desktop Only) */}
      {isDesktop && isCursorVisible && (
        <>
          {/* Outer Ring */}
          <motion.div
            className="fixed top-0 left-0 w-8 h-8 border border-[#dfb86c]/70 rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
            }}
            animate={{
              scale: isHovered ? 1.6 : 1,
              borderColor: isHovered ? "#dfb86c" : "rgba(223, 184, 108, 0.7)",
              backgroundColor: isHovered ? "rgba(223, 184, 108, 0.15)" : "rgba(223, 184, 108, 0)",
            }}
            transition={{ type: "tween", ease: "backOut", duration: 0.25 }}
          />
          {/* Inner Dot */}
          <motion.div
            className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#dfb86c] rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
            style={{
              x: cursorX,
              y: cursorY,
            }}
          />
        </>
      )}

      {/* Static Background Silhouette (Home Tab Only) */}
      {activeTab === 'home' && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
          <img 
            src={robertBackground} 
            className="absolute right-0 top-0 h-full w-auto object-cover object-right opacity-[0.55] md:opacity-[0.7] brightness-[1.65] pointer-events-none" 
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-[#060606]" />
        </div>
      )}

      {/* Background Vertical Grid Lines */}
      <div className="pointer-events-none fixed inset-0 z-0 flex justify-center overflow-hidden opacity-10">
        <div className="w-full max-w-[1400px] flex h-full border-x border-white/10">
          <div className="flex-1 border-r border-white/10"></div>
          <div className="flex-1 border-r border-white/10"></div>
          <div className="flex-1"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Navigation Header */}
        <header>
        <nav className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-10 flex flex-col sm:flex-row justify-between items-center border-b border-white/5 gap-6" aria-label="Main navigation">
          <a 
            {...tabLink('home')}
            className="flex items-center gap-3 font-serif italic text-white/90 text-xl tracking-wider select-none cursor-pointer hover:text-[#dfb86c] transition-colors group"
          >
            <img 
              src="/logo-mark-small.png" 
              alt="Golden Boy Productions Logo" 
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" 
            />
            <span>Golden Boy Productions</span>
          </a>
          <ul className="flex items-center space-x-6 md:space-x-12 text-[10px] uppercase tracking-[0.25em] text-white/50">
            <li>
              <a 
                {...tabLink('home')}
                aria-current={activeTab === 'home' ? 'page' : undefined}
                className={`inline-block normal-case hover:text-white transition-all duration-300 cursor-pointer ${activeTab === 'home' ? 'text-[#dfb86c] font-semibold border-b border-[#dfb86c] pb-1' : ''}`}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                {...tabLink('movies')}
                aria-current={activeTab === 'movies' ? 'page' : undefined}
                className={`inline-block normal-case hover:text-white transition-all duration-300 cursor-pointer ${activeTab === 'movies' ? 'text-[#dfb86c] font-semibold border-b border-[#dfb86c] pb-1' : ''}`}
              >
                Favorite Movies
              </a>
            </li>
            <li>
              <a 
                {...tabLink('bts')}
                aria-current={activeTab === 'bts' ? 'page' : undefined}
                className={`inline-block normal-case hover:text-white transition-all duration-300 cursor-pointer ${activeTab === 'bts' ? 'text-[#dfb86c] font-semibold border-b border-[#dfb86c] pb-1' : ''}`}
              >
                Behind The Scenes
              </a>
            </li>
            <li>
              <a 
                {...tabLink('contact')}
                aria-current={activeTab === 'contact' ? 'page' : undefined}
                className={`inline-block normal-case hover:text-white transition-all duration-300 cursor-pointer ${activeTab === 'contact' ? 'text-[#dfb86c] font-semibold border-b border-[#dfb86c] pb-1' : ''}`}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
        </header>

        <main className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Hero Section */}
                 <section className="min-h-[70vh] flex flex-col justify-center items-center text-center pt-8 pb-16 relative z-10" aria-label="Hero">
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="mb-8 select-none"
                  >
                    <img 
                      src="/logo-mark.png" 
                      alt="Golden Boy Productions Logo" 
                      className="h-24 md:h-32 w-auto filter drop-shadow-[0_0_20px_rgba(223,184,108,0.15)]" 
                    />
                  </motion.div>
                  <motion.h1 
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="font-serif text-5xl md:text-8xl lg:text-9xl tracking-tight mb-4 text-[#f5f5f5]"
                  >
                    Robert Lazau
                  </motion.h1>
                  
                  <motion.div 
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    className="text-[#dfb86c]/90 font-serif italic text-xl md:text-3xl mb-8 tracking-wide"
                  >
                    Director & Producer
                  </motion.div>
                  
                  <motion.p 
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="max-w-2xl text-xs md:text-sm leading-relaxed text-white/40 tracking-wider font-light mb-16"
                  >
                    Portland-area director and producer, and founder of Golden Boy Productions. Robert makes films for
                    cities, nonprofits, local businesses, and fashion brands, with a cinematic eye and a real interest in their story.
                  </motion.p>
                </section>

                {/* Biography Section */}
                <motion.section 
                  id="biography" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="py-28 md:py-44 border-t border-white/5 scroll-mt-12"
                  aria-label="Biography"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                    
                    <div className="relative group">
                      <div className="aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 max-w-md mx-auto md:ml-0">
                        <img 
                          src={biography.image} 
                          alt="Portrait of director Robert Lazau"
                          loading="lazy" 
                          className="w-full h-full object-cover opacity-100 brightness-110 group-hover:brightness-125 group-hover:scale-105 transition-all duration-1000 ease-out"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start max-w-md mx-auto md:mx-0">
                      <span className="text-[10px] text-[#dfb86c] tracking-[0.3em] uppercase mb-3">{biography.year}</span>
                      <h2 className="font-serif text-4xl md:text-6xl mb-6 text-[#f5f5f5] tracking-tight">Biography</h2>
                      <div className="space-y-6 text-sm text-white/60 font-light leading-relaxed">
                        {biography.text.split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                        <p className="italic font-serif text-[#dfb86c]/70 text-lg border-l border-[#dfb86c]/30 pl-4 py-1">
                          "{biography.quote}"
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.section>

                {/* Approach to Clientele Section */}
                <motion.section 
                  id="approach-to-clientele" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="py-28 md:py-40 border-t border-white/5"
                  aria-label="How Robert Works"
                >
                  <div className="flex flex-col mb-16">
                    <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3">{clientApproach.subtitle}</span>
                    <h2 className="font-serif text-4xl md:text-6xl text-[#f5f5f5] tracking-tight">{clientApproach.title}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-5 text-sm md:text-base text-white/50 leading-relaxed font-light">
                      <p>{clientApproach.text}</p>
                    </div>
                    
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
                      {clientApproach.points.map((point, index) => (
                        <div key={index} className="border-t border-white/10 pt-6 flex flex-col">
                          <span className="text-[10px] text-[#dfb86c] tracking-widest font-semibold mb-3">0{index + 1}/</span>
                          <h3 className="font-serif text-lg text-white/90 mb-2">{point.title}</h3>
                          <p className="text-[11px] text-white/40 leading-relaxed font-light">{point.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* Media Consulting Services Section */}
                <motion.section 
                  id="media-consulting-services" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="py-28 md:py-40 border-t border-white/5"
                  aria-label="Media Consulting Services"
                >
                  <div className="flex flex-col mb-16 text-center md:text-left">
                    <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3">EXPERT GUIDANCE</span>
                    <h2 className="font-serif text-4xl md:text-6xl text-[#f5f5f5] tracking-tight">Media Consulting Services</h2>
                    <p className="max-w-2xl text-xs md:text-sm text-white/50 leading-relaxed font-light mt-4 mx-auto md:mx-0">
                      Have a project and want a second set of eyes? Robert offers one-on-one guidance for filmmakers, creators, and organizations at any stage, from first idea to final cut.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {consultingServices.map((service, index) => (
                      <div 
                        key={index} 
                        className="border border-white/5 bg-white/[0.01] p-6 md:p-8 hover:border-white/20 transition-all duration-300 flex flex-col group"
                      >
                        <span className="text-[10px] text-[#dfb86c] tracking-widest font-semibold mb-4 block">SERVICE 0{index + 1}/</span>
                        <h3 className="font-serif text-xl text-white/90 mb-4 group-hover:text-[#dfb86c] transition-colors">{service.title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed font-light mt-auto">{service.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* Finished Projects & Current Projects Sections */}
                <motion.section 
                  id="projects" 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="py-28 border-t border-white/5"
                  aria-label="Filmography and Works"
                >
                  <div className="mb-20">
                    <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3 block">PORTFOLIO INDEX</span>
                    <h2 className="font-serif italic text-4xl md:text-6xl text-[#f5f5f5] tracking-tight">Filmography & Works</h2>
                  </div>

                  {/* Finished Projects */}
                  <div className="mb-24">
                    <h3 className="text-xs uppercase tracking-[0.25em] text-[#dfb86c] border-b border-white/5 pb-4 mb-10 font-medium">
                      Finished Projects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {finishedProjects.map((project) => (
                        <div 
                          key={project.id} 
                          onClick={() => setActiveProjectVideo(project)}
                          className="group border border-white/5 bg-white/[0.01] p-4 hover:border-white/15 transition-all duration-300 cursor-pointer"
                        >
                          <div className="aspect-[16/10] overflow-hidden mb-6 bg-white/5 relative">
                            <img 
                              src={project.image} 
                              alt={`${project.title}, ${project.type.toLowerCase()} by Golden Boy Productions`}
                              loading="lazy" 
                              className="w-full h-full object-cover grayscale group-hover:scale-103 group-hover:grayscale-0 transition-all duration-700 ease-out"
                            />
                            {/* Hover Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-12 h-12 rounded-full border border-white/40 bg-black/50 flex items-center justify-center text-white/80 group-hover:scale-110 group-hover:border-[#dfb86c] group-hover:text-[#dfb86c] transition-all duration-300">
                                <Play size={18} className="ml-0.5 fill-[#dfb86c] text-[#dfb86c] group-hover:fill-transparent transition-all" />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-[9px] uppercase tracking-wider text-white/40">{project.type}</span>
                            <span className="text-[9px] text-[#dfb86c] font-semibold">{project.year}</span>
                          </div>
                          <h4 className="font-serif text-xl text-white/90 mb-3 group-hover:text-[#dfb86c] transition-colors">{project.title}</h4>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-semibold">Role: {project.role}</p>
                          <p className="text-[11px] text-white/50 leading-relaxed font-light">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Projects */}
                  {currentProjects.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] text-[#dfb86c] border-b border-white/5 pb-4 mb-10 font-medium">
                      Current Projects (In Development)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {currentProjects.map((project) => (
                        <div key={project.id} className="group border border-white/5 bg-white/[0.01] p-5 hover:border-white/15 transition-all duration-300 flex flex-col md:flex-row gap-6">
                          <div className="aspect-[16/10] md:w-[45%] overflow-hidden bg-white/5 flex-shrink-0">
                            <img 
                              src={project.image} 
                              alt={`${project.title}, ${project.type.toLowerCase()} by Golden Boy Productions`}
                              loading="lazy" 
                              className="w-full h-full object-cover grayscale group-hover:scale-103 group-hover:grayscale-0 transition-all duration-700 ease-out"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] uppercase tracking-wider text-white/40">{project.type}</span>
                              <span className="px-2 py-0.5 border border-[#dfb86c]/30 text-[#dfb86c] text-[8px] uppercase tracking-widest font-semibold bg-[#dfb86c]/5">
                                {project.status}
                              </span>
                            </div>
                            <h4 className="font-serif text-xl text-white/90 mb-2 group-hover:text-[#dfb86c] transition-colors">{project.title}</h4>
                            <p className="text-[10px] text-[#dfb86c] tracking-widest uppercase mb-3">EXPECTED: {project.expectedRelease}</p>
                            <p className="text-[11px] text-white/50 leading-relaxed font-light">{project.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}
                </motion.section>

                {/* FAQ Section */}
                <section id="faq" className="py-28 max-w-4xl mx-auto border-t border-white/5 scroll-mt-12" aria-label="Frequently Asked Questions">
                  <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3 block">QUESTIONS</span>
                  <h2 className="font-serif italic text-4xl md:text-6xl mb-16 text-[#f5f5f5]">FAQ</h2>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'movies' && (
              <motion.div
                key="movies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Favorite Movies / Blog Reviews Section */}
                <section id="favorite-movies" className="py-16 scroll-mt-12">
                  <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-6">
                    <div>
                      <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-2 block">FILM DIARY & REVIEWS</span>
                      <h1 className="font-serif italic text-4xl md:text-6xl text-[#f5f5f5] tracking-tight">Favorite Movies Blog</h1>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          setShowRecForm(!showRecForm);
                          setRecSent(false);
                        }}
                        className="px-5 py-2.5 rounded-full border border-white/20 text-white/80 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        {showRecForm ? 'Close Recommender' : 'Recommend a Movie'}
                      </button>
                    </div>
                  </div>

                  {/* Visitor Movie Recommendation Form */}
                  <AnimatePresence>
                    {showRecForm && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden mb-16"
                      >
                        <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-sm backdrop-blur-sm">
                          <h3 className="font-serif text-2xl mb-2 text-white/90">Recommend a Film Masterpiece</h3>
                          <p className="text-[10px] text-white/30 mb-6 uppercase tracking-wider">Search our curated list or type in any film</p>
                          <form onSubmit={handleRecSubmit} className="space-y-6">
                            {/* Movie Search with Autocomplete */}
                            <div>
                              <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Movie Title *</label>
                              <div className="relative">
                                <input 
                                  type="text"
                                  value={recSearchQuery}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setRecSearchQuery(val);
                                    setRecMovieTitle(val);
                                    setRecDropdownOpen(true);
                                  }}
                                  onFocus={() => setRecDropdownOpen(true)}
                                  placeholder="Type a movie title, director, or year..."
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                  autoComplete="off"
                                />
                                {recSearchQuery && (
                                  <button 
                                    type="button"
                                    onClick={() => { setRecSearchQuery(''); setRecMovieTitle(''); setRecMovieDirector(''); setRecMovieYear(''); setRecDropdownOpen(false); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                                {recDropdownOpen && recSearchQuery.trim().length > 0 && (() => {
                                  const query = recSearchQuery.toLowerCase();
                                  const filtered = recommendableMovies.filter(m => 
                                    m.title.toLowerCase().includes(query) || 
                                    m.director.toLowerCase().includes(query) || 
                                    m.year.includes(query)
                                  ).slice(0, 8);
                                  return filtered.length > 0 ? (
                                    <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-[#111] border border-white/10 max-h-[280px] overflow-y-auto shadow-2xl">
                                      {filtered.map((movie, idx) => (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() => {
                                            setRecMovieTitle(movie.title);
                                            setRecMovieDirector(movie.director);
                                            setRecMovieYear(movie.year);
                                            setRecSearchQuery(movie.title);
                                            setRecDropdownOpen(false);
                                          }}
                                          className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer group"
                                        >
                                          <span className="text-sm text-white/90 group-hover:text-[#dfb86c] transition-colors">{movie.title}</span>
                                          <span className="block text-[10px] text-white/40 mt-0.5">{movie.director} — {movie.year}</span>
                                        </button>
                                      ))}
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            </div>

                            {/* Director & Year (auto-filled from selection, or free-text) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="md:col-span-2">
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Director</label>
                                <input 
                                  type="text"
                                  value={recMovieDirector}
                                  onChange={(e) => setRecMovieDirector(e.target.value)}
                                  placeholder="e.g., Christopher Nolan"
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Year</label>
                                <input 
                                  type="text"
                                  value={recMovieYear}
                                  onChange={(e) => setRecMovieYear(e.target.value)}
                                  placeholder="e.g., 2023"
                                  maxLength={4}
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                              </div>
                            </div>

                            {/* Name & Comment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Your Name</label>
                                <input 
                                  type="text" 
                                  value={recName}
                                  onChange={(e) => setRecName(e.target.value)}
                                  placeholder="e.g., Jane Doe (Leave blank for Anonymous)"
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Why should Robert watch this film?</label>
                                <input 
                                  type="text"
                                  value={recComment}
                                  onChange={(e) => { setRecComment(e.target.value); setRecError(''); }}
                                  placeholder="A brief note on why you recommend this..."
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                              </div>
                            </div>

                            {/* Error message */}
                            {recError && (
                              <div className="border border-red-900/30 bg-red-500/5 px-4 py-3 rounded-sm">
                                <p className="text-[11px] text-red-400 font-medium">{recError}</p>
                              </div>
                            )}

                            {/* Success message */}
                            {recSent && (
                              <div className="border border-[#dfb86c]/30 bg-[#dfb86c]/5 px-4 py-3 rounded-sm">
                                <p className="text-[11px] text-[#dfb86c] font-medium">Thanks! Your recommendation was sent to Robert.</p>
                              </div>
                            )}

                            <div className="flex gap-4">
                              <button
                                type="submit"
                                disabled={recSending}
                                className="px-6 py-2.5 rounded-sm bg-[#dfb86c] text-black text-[10px] uppercase tracking-widest hover:bg-white transition-all font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                              >
                                {recSending ? 'Sending...' : 'Submit Recommendation'}
                              </button>
                              <button 
                                type="button" 
                                onClick={() => { setShowRecForm(false); setRecError(''); setRecSent(false); }}
                                className="px-6 py-2.5 rounded-sm border border-white/20 text-white/60 text-[10px] uppercase tracking-widest hover:text-white hover:border-white transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Blog Style Movie Review List */}
                  <div className="space-y-24">
                    {reviews.length === 0 ? (
                      <div className="text-center py-24 border border-dashed border-white/10 rounded-sm bg-white/[0.01]">
                        <span className="text-[#dfb86c] text-[10px] uppercase tracking-widest font-semibold block mb-2">COMING SOON</span>
                        <p className="text-sm text-white/40 font-light mb-6">Robert's first film reviews are on the way. In the meantime, tell him what to watch.</p>
                        <button 
                          onClick={() => setShowRecForm(true)} 
                          className="px-6 py-2.5 rounded-full border border-white/20 text-white/70 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer font-medium"
                        >
                          Recommend a Movie
                        </button>
                      </div>
                    ) : (
                      reviews.map((movie, index) => (
                        <article 
                          key={movie.id} 
                          className="border-t border-white/10 pt-16 flex flex-col gap-8 group"
                        >
                          {/* Article Meta Header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between text-[10px] text-white/40 uppercase tracking-[0.2em] border-b border-white/5 pb-4">
                            <div className="flex items-center gap-4 mb-2 md:mb-0">
                              <span className="text-[#dfb86c] font-semibold">0{index + 1}/ MOVIE REVIEW</span>
                              <span>•</span>
                              <span>Directed by {movie.director}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span>{movie.year} · {movie.duration}</span>
                              <span>•</span>
                              <span className="text-[#dfb86c]">★ {movie.rating}/10</span>
                            </div>
                          </div>

                          {/* Article Content Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Column: Title & Action */}
                            <div className="lg:col-span-4 flex flex-col justify-between md:h-full min-h-[140px]">
                              <div>
                                <h3 className="font-serif text-3xl md:text-5xl text-[#f5f5f5] tracking-tight leading-tight mb-4 group-hover:text-[#dfb86c] transition-colors">
                                  {movie.title}
                                </h3>
                                <p className="text-[9px] text-white/30 tracking-widest uppercase">
                                  CRITIQUE BY ROBERT LAZAU
                                </p>
                              </div>
                              
                            </div>

                            {/* Right Column: Image Still and Full Review Text */}
                            <div className="lg:col-span-8 space-y-6">
                              <div className="aspect-[2.35/1] w-full overflow-hidden bg-white/5 border border-white/10">
                                <img 
                                  src={movie.image} 
                                  alt={movie.title} 
                                  loading="lazy"
                                  className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-101 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-700 ease-out"
                                />
                              </div>
                              <div className="text-sm md:text-base text-white/60 font-light leading-relaxed space-y-4 max-w-2xl">
                                {movie.description.split('\n\n').map((paragraph, pIdx) => (
                                  <p key={pIdx} className="font-sans font-light">{paragraph}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'bts' && (
              <motion.div
                key="bts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Behind the Scenes (BTS) Section */}
                <section id="bts" className="py-16 relative overflow-hidden" aria-label="Behind the Scenes Gallery">
                  {/* Massive background text */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
                    <div aria-hidden="true" className="font-serif italic text-[15vw] md:text-[22vw] leading-none text-white/[0.01] whitespace-nowrap tracking-tighter">
                      BTS GALLERY
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="text-center mb-16">
                      <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3 block">ON SET & PRODUCTION</span>
                      <h1 className="font-serif text-4xl md:text-6xl text-[#f5f5f5] tracking-tight">Behind the scenes</h1>
                    </div>

                    <div className="max-w-5xl mx-auto border border-white/10 bg-white/[0.01] p-6 md:p-8 rounded-sm relative">
                      <div className="relative aspect-[16/9] max-h-[520px] w-full overflow-hidden bg-white/5 border border-white/5 mb-8">
                        {/* Slideshow image/video fade-in transition */}
                        <AnimatePresence mode="wait" initial={false}>
                          {isAnyVideo(behindTheScenes[currentBtsIndex].image) ? (
                            isDriveVideo(behindTheScenes[currentBtsIndex].image) ? (
                              <motion.div
                                key={currentBtsIndex}
                                initial={{ opacity: 0, scale: 1.03 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                className="w-full h-full"
                              >
                                <iframe
                                  src={behindTheScenes[currentBtsIndex].image}
                                  allow="autoplay"
                                  allowFullScreen
                                  className="w-full h-full border-0"
                                  title={behindTheScenes[currentBtsIndex].title}
                                />
                              </motion.div>
                            ) : (
                              <motion.video
                                key={currentBtsIndex}
                                src={behindTheScenes[currentBtsIndex].image}
                                muted
                                playsInline
                                loop
                                autoPlay
                                initial={{ opacity: 0, scale: 1.03 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                className="w-full h-full object-cover object-center grayscale brightness-90 hover:brightness-100 hover:grayscale-0 transition-all duration-500"
                              />
                            )
                          ) : (
                            <motion.img
                              key={currentBtsIndex}
                              src={behindTheScenes[currentBtsIndex].image}
                              alt={behindTheScenes[currentBtsIndex].alt ?? behindTheScenes[currentBtsIndex].title}
                              initial={{ opacity: 0, scale: 1.03 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.7, ease: "easeInOut" }}
                              className="w-full h-full object-cover object-center grayscale brightness-90 hover:brightness-100 hover:grayscale-0 transition-all duration-500"
                            />
                          )}
                        </AnimatePresence>

                        {/* Slide Navigation Overlay Arrows */}
                        <button 
                          onClick={() => setCurrentBtsIndex((prev) => (prev - 1 + behindTheScenes.length) % behindTheScenes.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-[#dfb86c] hover:text-black hover:border-[#dfb86c] transition-all duration-300 cursor-pointer text-white/80"
                          aria-label="Previous Slide"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <button 
                          onClick={() => setCurrentBtsIndex((prev) => (prev + 1) % behindTheScenes.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-[#dfb86c] hover:text-black hover:border-[#dfb86c] transition-all duration-300 cursor-pointer text-white/80"
                          aria-label="Next Slide"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-8 space-y-3">
                          <span className="text-[10px] text-[#dfb86c] tracking-[0.25em] font-semibold uppercase">
                            0{currentBtsIndex + 1}/ BTS DIARY
                          </span>
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                              key={currentBtsIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <h3 className="font-serif text-2xl md:text-3xl text-white/95 mb-2">
                                {behindTheScenes[currentBtsIndex].title}
                              </h3>
                              <p className="text-xs text-white/50 leading-relaxed font-light">
                                {behindTheScenes[currentBtsIndex].description}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        <div className="md:col-span-4 flex flex-col items-end gap-4 text-right">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                              key={currentBtsIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-[10px] text-white/40 uppercase tracking-[0.2em]"
                            >
                              <p className="font-semibold text-white/70">{behindTheScenes[currentBtsIndex].location}</p>
                              <p className="text-[#dfb86c]/70">{behindTheScenes[currentBtsIndex].date}</p>
                            </motion.div>
                          </AnimatePresence>

                          {/* Navigation Indicators */}
                          <div className="flex items-center gap-6 mt-2">
                            <div className="flex gap-1.5">
                              <button 
                                onClick={() => setCurrentBtsIndex((prev) => (prev - 1 + behindTheScenes.length) % behindTheScenes.length)}
                                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#dfb86c] hover:text-black hover:border-[#dfb86c] transition-all cursor-pointer text-white/60"
                                aria-label="Previous image"
                              >
                                <ArrowLeft size={10} />
                              </button>
                              <button 
                                onClick={() => setCurrentBtsIndex((prev) => (prev + 1) % behindTheScenes.length)}
                                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#dfb86c] hover:text-black hover:border-[#dfb86c] transition-all cursor-pointer text-white/60"
                                aria-label="Next image"
                              >
                                <ArrowRight size={10} />
                              </button>
                            </div>

                            <div className="text-[11px] font-mono tracking-widest text-[#dfb86c] font-semibold select-none">
                              {String(currentBtsIndex + 1).padStart(2, '0')} <span className="text-white/20 mx-1">/</span> {String(behindTheScenes.length).padStart(2, '0')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Contact Page */}
                <section id="contact-page" className="py-16 max-w-4xl mx-auto" aria-label="Contact Robert Lazau">
                  <div className="text-center mb-16">
                    <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3 block">COLLABORATION & COMMISSION</span>
                    <h1 className="font-serif italic text-4xl md:text-6xl text-[#f5f5f5] tracking-tight">Contact Robert</h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    
                    {/* Left: Contact Info */}
                    <div className="md:col-span-5 space-y-8">
                      <div className="border-t border-white/10 pt-6">
                        <h3 className="font-serif text-lg text-white/90 mb-2">General Inquiries</h3>
                        <p className="text-sm text-white/50 leading-relaxed font-light mb-4">
                          For brand campaigns, community and nonprofit films, events, and creative collaborations. Tell Robert about your project and he'll get back to you.
                        </p>
                        <a 
                          href="mailto:robertlazau@gmail.com" 
                          className="text-xs uppercase tracking-widest text-[#dfb86c] hover:text-white transition-colors flex items-center gap-2"
                        >
                          <Mail size={14} /> robertlazau@gmail.com
                        </a>
                      </div>

                      <div className="border-t border-white/10 pt-6">
                        <h3 className="font-serif text-lg text-white/90 mb-2">Professional Socials</h3>
                        <div className="grid grid-cols-2 gap-4 text-center mt-4">
                          <a 
                            href="https://www.instagram.com/robertrgb/?hl=en" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] py-4 text-[9px] uppercase tracking-widest text-white/60 hover:text-[#dfb86c] transition-all"
                          >
                            Instagram
                          </a>
                          <a 
                            href="https://www.imdb.com/name/nm14415874/" 
                            target="_blank" 
                            rel="noreferrer"
                            className="border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] py-4 text-[9px] uppercase tracking-widest text-white/60 hover:text-[#dfb86c] transition-all"
                          >
                            IMDb
                          </a>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-8 flex justify-center md:justify-start">
                        <img 
                          src="/logo-full.png" 
                          alt="Golden Boy Productions Logo" 
                          className="h-28 md:h-36 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300 select-none filter drop-shadow-[0_0_15px_rgba(223,184,108,0.1)]" 
                        />
                      </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="md:col-span-7 bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-sm">
                      <h3 className="font-serif text-xl text-white/90 mb-6">Send a Message</h3>
                      <form onSubmit={handleContactSubmit} className="space-y-6">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Your Name *</label>
                          <input 
                            type="text" 
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Project / Inquiry Type</label>
                          <select 
                            value={contactType}
                            onChange={(e) => setContactType(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors appearance-none"
                          >
                            <option value="Commercial / Brand Campaign" className="bg-[#060606]">Commercial / Brand Campaign</option>
                            <option value="Community or Nonprofit Film" className="bg-[#060606]">Community or Nonprofit Film</option>
                            <option value="PSA / Public Sector" className="bg-[#060606]">PSA / Public Sector</option>
                            <option value="Fashion Visual" className="bg-[#060606]">Fashion Visual</option>
                            <option value="Event Coverage" className="bg-[#060606]">Event Coverage</option>
                            <option value="Website Visual / Promo" className="bg-[#060606]">Website Visual / Promo</option>
                            <option value="Music Video" className="bg-[#060606]">Music Video</option>
                            <option value="Short or Feature Film" className="bg-[#060606]">Short or Feature Film</option>
                            <option value="Media Consulting" className="bg-[#060606]">Media Consulting</option>
                            <option value="Press / Other" className="bg-[#060606]">Press / Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Your Message *</label>
                          <textarea 
                            required
                            rows={5}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Detail your production concept, timeline, and shoot requirements..."
                            className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                          />
                        </div>

                        <button 
                          type="submit" 
                          disabled={contactSent}
                          className="w-full py-3 rounded-sm bg-[#dfb86c] text-black text-[10px] uppercase tracking-widest hover:bg-white transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send size={12} /> {contactSent ? 'Sending...' : 'Send Message'}
                        </button>
                      </form>
                    </div>

                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        
        {/* Footer */}
        <footer className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-16 border-t border-white/5" role="contentinfo">
          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 uppercase tracking-[0.25em]">
            <p>© {new Date().getFullYear()} Golden Boy Productions — Robert Lazau</p>
            <nav aria-label="Social media links" className="flex space-x-6 mt-4 md:mt-0 text-[9px] tracking-wider text-white/40">
              <a href="https://www.instagram.com/robertrgb/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-[#dfb86c] transition-colors">Instagram</a>
              <a href="https://www.imdb.com/name/nm14415874/" target="_blank" rel="noopener noreferrer" className="hover:text-[#dfb86c] transition-colors">IMDb</a>
              <a href="mailto:robertlazau@gmail.com" className="hover:text-[#dfb86c] transition-colors">Email</a>
            </nav>
            <a 
              {...tabLink('home')}
              className="mt-4 md:mt-0 font-serif italic text-[#dfb86c] cursor-pointer hover:text-white transition-colors"
            >
              Robert Lazau
            </a>
          </div>
        </footer>
      </div>

      {/* BTS Lightbox Modal */}
      <AnimatePresence>
        {activeBts && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveBts(null)}
            className="fixed inset-0 z-50 bg-[#060606]/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-black border border-white/10 rounded-sm p-4 md:p-6 overflow-hidden cursor-default relative"
            >
              <button 
                onClick={() => setActiveBts(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close lightbox"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className="aspect-[16/9] w-full overflow-hidden bg-white/5 border border-white/5 mb-6">
                {isAnyVideo(activeBts.image) ? (
                  isDriveVideo(activeBts.image) ? (
                    <iframe
                      src={activeBts.image}
                      allow="autoplay"
                      allowFullScreen
                      className="w-full h-full border-0"
                      title={activeBts.title}
                    />
                  ) : (
                    <video 
                      src={activeBts.image} 
                      muted
                      playsInline
                      loop
                      autoPlay
                      controls
                      className="w-full h-full object-cover object-center"
                    />
                  )
                ) : (
                  <img 
                    src={activeBts.image} 
                    alt={activeBts.alt ?? activeBts.title} 
                    className="w-full h-full object-cover object-center"
                  />
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#f5f5f5] mb-2">{activeBts.title}</h3>
                  <p className="text-sm text-white/60 font-light leading-relaxed max-w-xl">
                    {activeBts.description}
                  </p>
                </div>
                <div className="text-right text-[10px] text-[#dfb86c] uppercase tracking-[0.2em] font-semibold flex-shrink-0 self-end md:self-auto border-t md:border-t-0 pt-2 md:pt-0">
                  <p>{activeBts.location}</p>
                  <p className="text-white/40">{activeBts.date}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Video Reel Lightbox Modal */}
      <AnimatePresence>
        {activeProjectVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProjectVideo(null)}
            className="fixed inset-0 z-50 bg-[#060606]/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-black border border-white/10 rounded-sm p-4 md:p-6 overflow-hidden cursor-default relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveProjectVideo(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer z-10"
                aria-label="Close video player"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              {/* Video Frame */}
              <div className="aspect-[16/9] w-full overflow-hidden bg-white/5 border border-white/5 mb-6 relative">
                {activeProjectVideo.video ? (
                  isDriveVideo(activeProjectVideo.video) ? (
                    <iframe
                      src={activeProjectVideo.video}
                      allow="autoplay"
                      allowFullScreen
                      className="w-full h-full border-0"
                      title={activeProjectVideo.title}
                    />
                  ) : (
                    <video 
                      src={activeProjectVideo.video} 
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover object-center"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                    <Play size={40} className="mb-2" />
                    <p className="text-xs uppercase tracking-widest">Video Reel Unavailable</p>
                  </div>
                )}
              </div>

              {/* Project Info details */}
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] text-[#dfb86c] tracking-widest uppercase font-semibold">
                      {activeProjectVideo.type}
                    </span>
                    <span className="text-white/20 text-xs">•</span>
                    <span className="text-[10px] text-white/40 tracking-wider font-semibold">
                      {activeProjectVideo.year}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#f5f5f5] mb-2">{activeProjectVideo.title}</h3>
                  <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-semibold mb-3">
                    Role: {activeProjectVideo.role}
                  </p>
                  <p className="text-sm text-white/60 font-light leading-relaxed max-w-2xl">
                    {activeProjectVideo.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string; key?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full py-8 flex justify-between items-center text-left hover:text-white group transition-colors duration-300"
      >
        <span className="font-serif text-lg md:text-2xl text-white/80 group-hover:text-[#dfb86c] transition-colors">{question}</span>
        <div className="w-10 h-10 rounded-full border border-[#e5e5e5]/10 flex items-center justify-center flex-shrink-0 ml-4 group-hover:border-[#e5e5e5]/30 group-hover:bg-[#e5e5e5]/5 transition-all">
          {isOpen ? <Minus size={16} strokeWidth={1} className="text-[#dfb86c]" /> : <Plus size={16} strokeWidth={1} />}
        </div>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <p className="pb-8 text-sm md:text-base text-[#e5e5e5]/50 font-light leading-relaxed max-w-2xl">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
