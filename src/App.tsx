import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight, ArrowLeft, Plus, Minus, Camera, X, Send, Mail, Play } from 'lucide-react';
import { biography, clientApproach, consultingServices, finishedProjects, currentProjects, favoriteMovies, behindTheScenes, faqs, recommendableMovies } from './data';
import robertBackground from '../assets/robert_background.jpg';

const isVideoFile = (url: string) => {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(url);
};

const isDriveVideo = (url: string) => {
  if (!url) return false;
  return url.includes('drive.google.com/file/d/') && url.endsWith('/preview');
};

const isAnyVideo = (url: string) => isVideoFile(url) || isDriveVideo(url);

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'movies' | 'bts' | 'contact'>('home');
  const [activeBts, setActiveBts] = useState<typeof behindTheScenes[0] | null>(null);
  const [activeProjectVideo, setActiveProjectVideo] = useState<typeof finishedProjects[0] | null>(null);

  // Loading / Splash preloader state
  const [loading, setLoading] = useState(true);

  // Movie reviews state loaded from localStorage or initialized with default movies from data.ts
  const [reviews, setReviews] = useState<typeof favoriteMovies>(() => {
    const saved = localStorage.getItem('movie_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved reviews:", e);
      }
    }
    return favoriteMovies;
  });
  
  // Movie recommendations state loaded from localStorage
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    movieTitle: string;
    movieDirector: string;
    movieYear: string;
    name: string;
    comment: string;
    date: string;
  }>>(() => {
    const saved = localStorage.getItem('movie_recommendations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved recommendations:", e);
      }
    }
    return [];
  });

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

  // Review Publisher Form State
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDirector, setNewDirector] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newRating, setNewRating] = useState('8.0');
  const [newReview, setNewReview] = useState('');
  const [newImage, setNewImage] = useState('');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactType, setContactType] = useState('Feature Film');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('portfolio_admin') === 'true');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'robert2026') {
      setIsAdmin(true);
      localStorage.setItem('portfolio_admin', 'true');
      setShowAuthModal(false);
      setPasscode('');
      setAuthError('');
    } else {
      setAuthError('Access Denied: Invalid Key');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('portfolio_admin');
    setShowForm(false);
  };

  // Preloader timeout effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // One-time auto-wipe of movie reviews from local storage to start fresh
  useEffect(() => {
    const hasCleared = localStorage.getItem('movies_cleared_v1');
    if (!hasCleared) {
      localStorage.removeItem('movie_reviews');
      setReviews([]);
      localStorage.setItem('movies_cleared_v1', 'true');
    }
  }, []);

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

  // Handle local file uploads converting to Base64 dataURL
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit and save new movie review
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newReview.trim()) return;

    const newPost = {
      id: Date.now(),
      title: newTitle,
      director: newDirector.trim() || "Unknown",
      year: newYear.trim() || new Date().getFullYear().toString(),
      duration: newDuration.trim() || "N/A",
      rating: newRating,
      image: newImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
      description: newReview
    };

    const updatedReviews = [newPost, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('movie_reviews', JSON.stringify(updatedReviews));

    // Reset Form fields
    setNewTitle('');
    setNewDirector('');
    setNewYear('');
    setNewDuration('');
    setNewRating('8.0');
    setNewReview('');
    setNewImage('');
    setShowForm(false);
  };

  // Delete dynamic review
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this film review?")) {
      const updatedReviews = reviews.filter(movie => movie.id !== id);
      setReviews(updatedReviews);
      localStorage.setItem('movie_reviews', JSON.stringify(updatedReviews));
    }
  };

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

  // Submit visitor movie recommendation
  const handleRecSubmit = (e: React.FormEvent) => {
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

    const newRec = {
      id: Date.now().toString(),
      movieTitle: recMovieTitle.trim(),
      movieDirector: recMovieDirector.trim() || 'Unknown',
      movieYear: recMovieYear.trim() || '—',
      name: recName.trim() || 'Anonymous Cinephile',
      comment: recComment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    const updated = [newRec, ...recommendations];
    setRecommendations(updated);
    localStorage.setItem('movie_recommendations', JSON.stringify(updated));

    // Reset inputs
    setRecMovieTitle('');
    setRecMovieDirector('');
    setRecMovieYear('');
    setRecSearchQuery('');
    setRecName('');
    setRecComment('');
    setRecError('');
    setShowRecForm(false);
  };

  // Delete movie recommendation
  const handleDeleteRec = (id: string) => {
    if (!isAdmin) return;
    if (confirm("Are you sure you want to delete this suggestion?")) {
      const updated = recommendations.filter(rec => rec.id !== id);
      setRecommendations(updated);
      localStorage.setItem('movie_recommendations', JSON.stringify(updated));
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
      setContactType('Feature Film');
      setContactMessage('');
      alert('Your message has been sent successfully! Robert will review it shortly.');
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      const errMsg = error?.text || error?.message || JSON.stringify(error);
      alert(`EmailJS Error: ${errMsg}`);
    } finally {
      setContactSent(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060606] text-[#e5e5e5] font-sans selection:bg-[#fff] selection:text-[#060606]">
      {/* Animated Film Grain Overlay */}
      <div className="film-grain" />

      {/* Preloader Splash Presentation */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[10000] bg-[#060606] flex flex-col items-center justify-center text-center p-4 select-none"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={{ opacity: [0, 1, 1], letterSpacing: ["0.2em", "0.4em", "0.45em"] }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
                className="text-[9px] uppercase tracking-[0.45em] text-[#dfb86c] font-light"
              >
                A Golden Boy Productions Presentation
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 0, 1] }}
                transition={{ duration: 2.2, delay: 0.3, ease: "easeOut" }}
                className="font-serif italic text-3xl md:text-5xl text-white/90 font-light"
              >
                Robert Lazau
              </motion.div>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                className="h-[1px] bg-[#dfb86c]/20 mx-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 font-serif italic text-white/90 text-xl tracking-wider select-none cursor-pointer hover:text-[#dfb86c] transition-colors group"
          >
            <img 
              src="/logo-mark.png" 
              alt="Golden Boy Productions Logo" 
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" 
            />
            <span>Golden Boy Productions</span>
          </div>
          <ul className="flex items-center space-x-6 md:space-x-12 text-[10px] uppercase tracking-[0.25em] text-white/50">
            <li>
              <button 
                onClick={() => setActiveTab('home')} 
                className={`hover:text-white transition-all duration-300 cursor-pointer ${activeTab === 'home' ? 'text-[#dfb86c] font-semibold border-b border-[#dfb86c] pb-1' : ''}`}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('movies')} 
                className={`hover:text-white transition-all duration-300 cursor-pointer ${activeTab === 'movies' ? 'text-[#dfb86c] font-semibold border-b border-[#dfb86c] pb-1' : ''}`}
              >
                Favorite Movies
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('bts')} 
                className={`hover:text-white transition-all duration-300 cursor-pointer ${activeTab === 'bts' ? 'text-[#dfb86c] font-semibold border-b border-[#dfb86c] pb-1' : ''}`}
              >
                Behind The Scenes
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('contact')} 
                className={`hover:text-white transition-all duration-300 cursor-pointer ${activeTab === 'contact' ? 'text-[#dfb86c] font-semibold border-b border-[#dfb86c] pb-1' : ''}`}
              >
                Contact
              </button>
            </li>
          </ul>
        </nav>
        </header>

        <main className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          
          <AnimatePresence mode="wait">
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
                    initial={{ opacity: 0, scale: 0.8 }}
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="font-serif text-5xl md:text-8xl lg:text-9xl tracking-tight mb-4 text-[#f5f5f5]"
                  >
                    Robert Lazau
                  </motion.h1>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    className="text-[#dfb86c]/90 font-serif italic text-xl md:text-3xl mb-8 tracking-wide"
                  >
                    Director & Producer
                  </motion.div>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="max-w-2xl text-xs md:text-sm leading-relaxed text-white/40 tracking-wider font-light mb-16"
                  >
                    Robert Lazau — Cineaste, resident visionary at Golden Boy Productions. Crafting visceral cinematic 
                    experiences that balance formal precision with human vulnerability.
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
                          alt="Robert Lazau profile portrait"
                          loading="lazy" 
                          className="w-full h-full object-cover opacity-100 brightness-110 group-hover:brightness-125 group-hover:scale-105 transition-all duration-1000 ease-out"
                        />
                      </div>
                      <div className="absolute -bottom-6 left-4 md:left-0 text-[9px] text-white/30 uppercase tracking-[0.2em]">
                        <p>Photo taken in Manhattan</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start max-w-md mx-auto md:mx-0">
                      <span className="text-[10px] text-[#dfb86c] tracking-[0.3em] uppercase mb-3">{biography.year} / TIMELINE</span>
                      <h2 className="font-serif text-4xl md:text-6xl mb-6 text-[#f5f5f5] tracking-tight">Biography</h2>
                      <div className="space-y-6 text-sm text-white/60 font-light leading-relaxed">
                        <p>{biography.text}</p>
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
                  aria-label="Approach to Clientele"
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
                      Leveraging over a decade of production excellence to guide filmmakers, creative directors, and premium brands from concept to final cut.
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
                              alt={project.title}
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
                              alt={project.title}
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
                      <h2 className="font-serif italic text-4xl md:text-6xl text-[#f5f5f5] tracking-tight">Favorite Movies Blog</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to clear all reviews? This will reset your movie reviews blog to empty.")) {
                                setReviews([]);
                                localStorage.removeItem('movie_reviews');
                              }
                            }}
                            className="px-4 py-2 border border-white/10 text-white/50 hover:text-white text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all duration-300 font-medium cursor-pointer"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={handleAdminLogout}
                            className="px-4 py-2 border border-red-900/30 text-red-500/70 hover:text-red-400 text-[9px] uppercase tracking-widest hover:bg-red-500/5 transition-all duration-300 font-medium cursor-pointer"
                          >
                            Lock Session
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => {
                          setShowRecForm(!showRecForm);
                          setShowForm(false);
                        }}
                        className="px-5 py-2.5 rounded-full border border-white/20 text-white/80 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        {showRecForm ? 'Close Recommender' : 'Recommend a Movie'}
                      </button>
                      <button 
                        onClick={() => {
                          if (isAdmin) {
                            setShowForm(!showForm);
                            setShowRecForm(false);
                          } else {
                            setShowAuthModal(true);
                          }
                        }}
                        className="px-6 py-2.5 rounded-full border border-[#dfb86c]/30 text-[#dfb86c] text-[10px] uppercase tracking-widest hover:bg-[#dfb86c] hover:text-black hover:border-[#dfb86c] transition-all duration-300 flex items-center gap-2 font-medium"
                      >
                        {!isAdmin ? 'Admin Sign-in' : (showForm ? 'Close Editor' : '+ Publish Review')}
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

                            <div className="flex gap-4">
                              <button 
                                type="submit" 
                                className="px-6 py-2.5 rounded-sm bg-[#dfb86c] text-black text-[10px] uppercase tracking-widest hover:bg-white transition-all font-semibold cursor-pointer"
                              >
                                Submit Recommendation
                              </button>
                              <button 
                                type="button" 
                                onClick={() => { setShowRecForm(false); setRecError(''); }}
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

                  {/* Interactive Publisher Form */}
                  <AnimatePresence>
                    {showForm && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden mb-16"
                      >
                        <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-sm backdrop-blur-sm">
                          <h3 className="font-serif text-2xl mb-6 text-white/90">Draft Movie Review</h3>
                          <form onSubmit={handlePublish} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Movie Title *</label>
                                <input 
                                  type="text" 
                                  required
                                  value={newTitle}
                                  onChange={(e) => setNewTitle(e.target.value)}
                                  placeholder="e.g., Barry Lyndon"
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Director</label>
                                <input 
                                  type="text" 
                                  value={newDirector}
                                  onChange={(e) => setNewDirector(e.target.value)}
                                  placeholder="e.g., Stanley Kubrick"
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Release Year</label>
                                <input 
                                  type="text" 
                                  value={newYear}
                                  onChange={(e) => setNewYear(e.target.value)}
                                  placeholder="e.g., 1975"
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Duration</label>
                                <input 
                                  type="text" 
                                  value={newDuration}
                                  onChange={(e) => setNewDuration(e.target.value)}
                                  placeholder="e.g., 3h 5m"
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Rating (★ 1-10)</label>
                                <input 
                                  type="number" 
                                  step="0.1" 
                                  min="1" 
                                  max="10"
                                  value={newRating}
                                  onChange={(e) => setNewRating(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Upload Movie Still / Image</label>
                                <div className="relative border border-dashed border-white/20 bg-black/20 hover:bg-black/30 hover:border-white/40 transition-all p-6 text-center cursor-pointer flex flex-col items-center justify-center h-[90px]">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <Camera className="text-white/40 mb-1" size={20} strokeWidth={1} />
                                  <span className="text-[9px] text-white/50 tracking-wider">CHOOSE IMAGE FILE</span>
                                </div>
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Or Paste Image URL</label>
                                <input 
                                  type="text" 
                                  value={newImage}
                                  onChange={(e) => setNewImage(e.target.value)}
                                  placeholder="https://images.unsplash.com/..."
                                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                                />
                                {newImage && (
                                  <div className="mt-4 aspect-[16/9] w-24 border border-white/10 overflow-hidden">
                                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Your Review *</label>
                              <textarea 
                                required
                                rows={6}
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                placeholder="Write your detailed critique of the film..."
                                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors"
                              />
                            </div>

                            <div className="flex gap-4">
                              <button 
                                type="submit" 
                                className="px-6 py-2.5 rounded-sm bg-[#dfb86c] text-black text-[10px] uppercase tracking-widest hover:bg-white transition-all font-semibold cursor-pointer"
                              >
                                Publish Review
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setShowForm(false)}
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
                        <span className="text-[#dfb86c] text-[10px] uppercase tracking-widest font-semibold block mb-2">EMPTY DIARY</span>
                        <p className="text-sm text-white/40 font-light mb-6">No film reviews published yet.</p>
                        {!isAdmin && (
                          <button 
                            onClick={() => setShowAuthModal(true)} 
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white/70 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer font-medium"
                          >
                            Authenticate as Admin
                          </button>
                        )}
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
                              
                              {/* Delete review action */}
                              {isAdmin && (
                                <button 
                                  onClick={() => handleDelete(movie.id)}
                                  className="mt-8 text-[9px] uppercase tracking-[0.2em] text-red-500/50 hover:text-red-500 self-start transition-colors cursor-pointer animate-fade-in"
                                >
                                  Delete Review
                                </button>
                              )}
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

                  {/* Community Recommendations Section */}
                  <div className="mt-32 pt-20 border-t border-white/10">
                    <div className="mb-12">
                      <span className="text-[10px] text-[#dfb86c] tracking-[0.25em] font-semibold uppercase mb-2 block">
                        CINEPHILE SUGGESTIONS
                      </span>
                      <h3 className="font-serif italic text-3xl md:text-4xl text-[#f5f5f5] tracking-tight">
                        Community Recommendations
                      </h3>
                      <p className="text-xs text-white/40 font-light mt-2 max-w-xl">
                        Movies suggested by visitors from our curated masterpiece catalog. Recommend one above to see it added!
                      </p>
                    </div>

                    {recommendations.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-white/5 bg-white/[0.005] rounded-sm">
                        <p className="text-xs text-white/30 font-light">No movie recommendations submitted yet. Be the first!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((rec) => (
                          <div 
                            key={rec.id} 
                            className="border border-white/5 bg-white/[0.01] p-6 hover:border-white/10 transition-all duration-300 rounded-sm relative flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-serif text-lg text-white/90 leading-snug">{rec.movieTitle}</h4>
                                  <p className="text-[10px] text-white/40 font-light mt-0.5">
                                    Directed by {rec.movieDirector} ({rec.movieYear})
                                  </p>
                                </div>
                              </div>
                              {rec.comment && (
                                <p className="text-xs text-white/60 font-light italic leading-relaxed border-l border-white/10 pl-3 mb-6">
                                  "{rec.comment}"
                                </p>
                              )}
                            </div>

                            <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5">
                              <div>
                                <p className="text-[9px] uppercase tracking-wider text-[#dfb86c]">Suggested By</p>
                                <p className="text-[10px] text-white/70 font-semibold">{rec.name}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] text-white/30">{rec.date}</p>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleDeleteRec(rec.id)}
                                    className="text-[9px] uppercase text-red-500/60 hover:text-red-400 font-semibold tracking-wider mt-1.5 cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
                    <h2 className="font-serif italic text-[15vw] md:text-[22vw] leading-none text-white/[0.01] whitespace-nowrap tracking-tighter">
                      BTS GALLERY
                    </h2>
                  </div>

                  <div className="relative z-10">
                    <div className="text-center mb-16">
                      <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3 block">ON SET & PRODUCTION</span>
                      <h2 className="font-serif text-4xl md:text-6xl text-[#f5f5f5] tracking-tight">Behind the scenes</h2>
                    </div>

                    <div className="max-w-5xl mx-auto border border-white/10 bg-white/[0.01] p-6 md:p-8 rounded-sm relative">
                      <div className="relative aspect-[16/9] max-h-[520px] w-full overflow-hidden bg-white/5 border border-white/5 mb-8">
                        {/* Slideshow image/video fade-in transition */}
                        <AnimatePresence mode="wait">
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
                              alt={behindTheScenes[currentBtsIndex].title}
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
                          <AnimatePresence mode="wait">
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
                          <AnimatePresence mode="wait">
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
                    <h2 className="font-serif italic text-4xl md:text-6xl text-[#f5f5f5] tracking-tight">Contact Robert</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    
                    {/* Left: Contact Info */}
                    <div className="md:col-span-5 space-y-8">
                      <div className="border-t border-white/10 pt-6">
                        <h3 className="font-serif text-lg text-white/90 mb-2">General Inquiries</h3>
                        <p className="text-sm text-white/50 leading-relaxed font-light mb-4">
                          For features, commercials, and visual campaigns. Let's create something together.
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
                          className="h-16 md:h-20 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300 select-none filter drop-shadow-[0_0_15px_rgba(223,184,108,0.1)]" 
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
                            <option value="Feature Film" className="bg-[#060606]">Feature Film</option>
                            <option value="Commercial Campaign" className="bg-[#060606]">Commercial Campaign</option>
                            <option value="Media Consulting" className="bg-[#060606]">Media Consulting Service</option>
                            <option value="Music Video" className="bg-[#060606]">Music Video</option>
                            <option value="Representation / Press" className="bg-[#060606]">Representation / Press</option>
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

        {/* SEO Content Block — visually hidden, crawlable by search engines */}
        <article className="sr-only">
          <h2>About Robert Lazau — Director, Producer & Cinematographer</h2>
          <p>
            Robert Lazau is a director, producer, and cinematographer based in Portland, Oregon. 
            He is the founder of Golden Boy Productions, a cinematic production company specializing 
            in commercial video production, fashion visuals, community spotlight films, nonprofit 
            campaigns, and brand storytelling. Robert Lazau brings a distinctive visual style that 
            merges high-contrast cinematography with intimate, character-driven narratives.
          </p>
          <h3>Golden Boy Productions — Services</h3>
          <p>
            Golden Boy Productions, founded by Robert Lazau, offers professional video production 
            services including commercial advertising, fashion brand visuals, music video direction, 
            nonprofit campaign videos, website promotional content, and event coverage. Based in 
            Portland, Oregon, Golden Boy Productions serves clients throughout the Pacific Northwest 
            and beyond.
          </p>
          <h3>Featured Projects by Robert Lazau</h3>
          <ul>
            <li>Valentines Model Mash — A collaborative brand event visual campaign for high-end models and content creators</li>
            <li>Disaster Preparedness — A PSA commercial campaign produced with the City of Fairview</li>
            <li>Hive Recovery Website Visual — A promotional website visual for Hive Recovery Collective in Gresham</li>
            <li>EMOPI Video — A community spotlight film for the EMOPI program in Gresham</li>
            <li>Refined Kollective — A high-concept fashion visual for Refined Kollective fashion brand</li>
            <li>Hayes Hustle — A nonprofit spotlight video for a youth engagement organization</li>
          </ul>
          <h3>Contact Robert Lazau</h3>
          <p>
            Email: robertlazau@gmail.com | 
            Instagram: @robertrgb | IMDb: nm14415874 | 
            Website: robertlazau.com | Company: Golden Boy Productions
          </p>
        </article>
        
        {/* Footer */}
        <footer className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-16 border-t border-white/5" role="contentinfo">
          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 uppercase tracking-[0.25em]">
            <p>© {new Date().getFullYear()} Golden Boy Productions — Robert Lazau</p>
            <nav aria-label="Social media links" className="flex space-x-6 mt-4 md:mt-0 text-[9px] tracking-wider text-white/40">
              <a href="https://www.instagram.com/robertrgb/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-[#dfb86c] transition-colors">Instagram</a>
              <a href="https://www.imdb.com/name/nm14415874/" target="_blank" rel="noopener noreferrer" className="hover:text-[#dfb86c] transition-colors">IMDb</a>
              <a href="mailto:robertlazau@gmail.com" className="hover:text-[#dfb86c] transition-colors">Email</a>
            </nav>
            <p 
              onClick={() => setActiveTab('home')}
              className="mt-4 md:mt-0 font-serif italic text-[#dfb86c] cursor-pointer hover:text-white transition-colors"
            >
              Robert Lazau
            </p>
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
                    alt={activeBts.title} 
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

      {/* Admin Passcode Authentication Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#060606]/95 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-black border border-white/10 rounded-sm p-8 relative"
            >
              <button 
                onClick={() => {
                  setShowAuthModal(false);
                  setPasscode('');
                  setAuthError('');
                }}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              <div className="text-center mb-6">
                <span className="text-[10px] text-[#dfb86c] tracking-[0.3em] uppercase mb-2 block font-semibold">SECURITY CONTROL</span>
                <h3 className="font-serif text-2xl text-[#f5f5f5]">Admin Authentication</h3>
                <p className="text-xs text-white/40 mt-1 font-light">Only Robert Lazau is authorized to publish or modify film reviews.</p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2">Access Key passcode</label>
                  <input 
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode..."
                    className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#dfb86c] transition-colors text-center tracking-widest font-mono"
                    autoFocus
                  />
                </div>

                {authError && (
                  <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wider text-center">{authError}</p>
                )}

                <button 
                  type="submit" 
                  className="w-full py-3 rounded-sm bg-[#dfb86c] text-black text-[10px] uppercase tracking-widest hover:bg-white transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  Verify Authorization
                </button>
              </form>
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
        className="w-full py-8 flex justify-between items-center text-left hover:text-white group transition-colors duration-300"
      >
        <span className="font-serif text-lg md:text-2xl text-white/80 group-hover:text-[#dfb86c] transition-colors">{question}</span>
        <div className="w-10 h-10 rounded-full border border-[#e5e5e5]/10 flex items-center justify-center flex-shrink-0 ml-4 group-hover:border-[#e5e5e5]/30 group-hover:bg-[#e5e5e5]/5 transition-all">
          {isOpen ? <Minus size={16} strokeWidth={1} className="text-[#dfb86c]" /> : <Plus size={16} strokeWidth={1} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-sm md:text-base text-[#e5e5e5]/50 font-light leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
