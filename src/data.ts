import robertPortrait from '../assets/robert_portrait.jpg';

// Google Drive video embed URLs (using /preview for iframe embedding)
const projVideo1 = 'https://drive.google.com/file/d/1TaUrXIMbKXiIAWJynMxWxxQfIVW0_Hhy/preview';
const projVideo2 = 'https://drive.google.com/file/d/1GP8QnVWwXrq3Om58uaJLAAWCbU5szH1C/preview';
const projVideo3 = 'https://drive.google.com/file/d/1-36T8D9BXnkGCYyrHkzWmPURhkoxY3UZ/preview';
const projVideo4 = 'https://drive.google.com/file/d/1Jib_GgwhffI2Br_i6cfu_TffWWmo1m7D/preview';
const projVideo5 = 'https://drive.google.com/file/d/1qAgiLaHfsxvVoRHC15NyA79gspo4Z2Ln/preview';
const projVideo6 = 'https://drive.google.com/file/d/1Bub3hHrB8I1j1x7Ea8ff5wT10tbXQ5lT/preview';
const bts1 = 'https://drive.google.com/file/d/1QkL_-PAwx52tWigHB_egNYlH07Gleq3V/preview';
const bts2 = 'https://drive.google.com/file/d/1WHtfiZ_iMiWSyezXGbSKaR8Q66UsAdBM/preview';
const bts3 = 'https://drive.google.com/file/d/1k-UWdaZIqZYgh8ms6PC8ewpSQxiPaj1y/preview';
const bts4 = 'https://drive.google.com/file/d/1zmhlmCAPOpZUSbzWLctzZOA09onptxgc/preview';
const bts5 = '/videos/bts/IMG_9165.mov'; // Local fallback — no Drive link provided
import bts6 from '../assets/bts/IMG_0367.JPG';
import bts7 from '../assets/bts/FullSizeRender.jpg';
import bts8 from '../assets/bts/IMG_2556.jpg';
import bts9 from '../assets/bts/IMG_2058.jpg';
import bts10 from '../assets/bts/IMG_2077.jpg';
import bts11 from '../assets/bts/IMG_6656.jpg';
import bts12 from '../assets/bts/IMG_6744.jpg';
import bts13 from '../assets/bts/IMG_1208.jpg';
import bts14 from '../assets/bts/IMG_2494.jpg';
import bts15 from '../assets/bts/IMG_2553.jpg';
import bts16 from '../assets/bts/IMG_2165.jpg';
import bts17 from '../assets/bts/IMG_2540.jpg';
import bts18 from '../assets/bts/IMG_1383.jpg';

export const biography = {
  year: "1994",
  title: "Early Vision",
  subtitle: "The Beginning of Golden Boy Productions",
  text: "Robert Lazau's cinematic journey began with a simple passion: to capture the beauty in the ordinary. Drawing from the gritty realism of 70s American cinema and the meticulous composition of European classics, Robert established a unique visual vocabulary that merges high contrast B&W styling with intimate character-driven narratives.",
  quote: "Every frame is a canvas; every shadow tells a story.",
  image: robertPortrait
};

export const clientApproach = {
  title: "Approach to Clientele",
  subtitle: "Co-creating Visual Legacies",
  text: "For Robert Lazau, the relationship between director and client is a creative partnership. Whether crafting a cinematic commercial, an artistic music video, or a branding masterpiece, Robert approaches each brief not as a set of rules, but as an opportunity to build a distinct visual world. The focus is always on translating the client's core identity into high-contrast, cinematic storytelling that commands attention and endures.",
  points: [
    {
      title: "Intimate Discovery",
      desc: "We begin with collaborative brainstorming to uncover the emotional core of your brand or narrative."
    },
    {
      title: "Meticulous Pre-Production",
      desc: "Storyboard development, styling design, and precise location scouting to construct a bespoke visual aesthetic."
    },
    {
      title: "Uncompromising Execution",
      desc: "Using state-of-the-art cinema packages (Arri/RED) and premium B&W/color direction to deliver stunning results."
    }
  ]
};

export const consultingServices = [
  {
    title: "Script & Narrative Development",
    desc: "Refining screenplays, narrative pacing, and structural flow to ensure your story resonates before a single frame is shot."
  },
  {
    title: "Visual Direction & Art Styling",
    desc: "Developing cohesive color theory, set design guidelines, lighting references, and camera direction to establish a unique signature aesthetic."
  },
  {
    title: "Production Strategy & Logistics",
    desc: "Advising on optimal camera systems, lens selection, scheduling efficiency, and crew acquisition tailored to project scope."
  },
  {
    title: "Post-Production Supervision",
    desc: "Guiding the final stages of editing, soundscape design, visual effects integration, and high-end cinematic color grading."
  }
];

export const finishedProjects = [
  {
    id: 1,
    title: "Valentines Model Mash",
    type: "Commercial Event Visual",
    year: "2026",
    role: "Production House / Director",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    description: "A collaborative brand event visual campaign bringing together high-end models, professional videographers, and photographers to generate massive, high-impact content catalogs for brand clients.",
    video: projVideo1
  },
  {
    id: 2,
    title: "Disaster Preparedness",
    type: "PSA / Commercial Ad",
    year: "2025",
    role: "Producer / Director",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    description: "A targeted public service announcement and commercial campaign produced in collaboration with the City of Fairview to promote civic safety and highlight their disaster preparedness course.",
    video: projVideo2
  },
  {
    id: 3,
    title: "Hive Recovery Website Visual",
    type: "Website Visual / Promo",
    year: "2025",
    role: "Visual Director",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    description: "A customized website visual and promotional loop created for the Hive Recovery Collective, a small business based in Gresham, to capture their workspace and digital identity.",
    video: projVideo3
  },
  {
    id: 4,
    title: "EMOPI Video",
    type: "Community Spotlight Video",
    year: "2025",
    role: "Co-Director / Video Producer",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    description: "A dedicated community profile film created to highlight the stories, achievements, and impact of the EMOPI program in Gresham.",
    video: projVideo4
  },
  {
    id: 5,
    title: "Refined Kollective",
    type: "Fashion Visual",
    year: "2025",
    role: "Director / Cinematographer",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    description: "A high-concept, stylized fashion visual and commercial narrative produced for Refined Kollective to showcase their latest season collection.",
    video: projVideo5
  },
  {
    id: 6,
    title: "Hayes Hustle",
    type: "Nonprofit Spotlight Video",
    year: "2025",
    role: "Production House / Director",
    image: "https://images.unsplash.com/photo-1553882809-a4f57e59501d?q=80&w=800&auto=format&fit=crop",
    description: "A spotlight promotional video produced for Hayes Hustle, a nonprofit organization that helps kids connect with nature, horses, and wildlife, while teaching hands-on skills like podcasting and sewing.",
    video: projVideo6
  }
];

export const currentProjects = [
  {
    id: 1,
    title: "The Golden Hour",
    status: "In Production",
    type: "Feature Film",
    expectedRelease: "Late 2026",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    description: "An epic historical drama tracking the decline of an aristocratic estate, shot entirely with natural light and custom-designed anamorphic glass."
  },
  {
    id: 2,
    title: "Fractions of Time",
    status: "Pre-Production",
    type: "Short Film Series",
    expectedRelease: "Mid 2027",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
    description: "A structured anthology of three short stories exploring critical split-second decisions that define lives."
  }
];

export const favoriteMovies: Array<{
  id: number;
  title: string;
  director: string;
  year: string;
  duration: string;
  rating: string;
  image: string;
  description: string;
}> = [];

export const behindTheScenes = [
  {
    id: 1,
    title: "Steadicam Tracking",
    location: "Production Stage",
    date: "May 2025",
    image: bts1,
    description: "On-set active camera tracking."
  },
  {
    id: 2,
    title: "Monitor Playback",
    location: "Production Stage",
    date: "May 2025",
    image: bts2,
    description: "Reviewing active production feed."
  },
  {
    id: 3,
    title: "Lighting Setup",
    location: "Warehouse Stage",
    date: "June 2025",
    image: bts3,
    description: "Configuring dynamic shadow depth."
  },
  {
    id: 4,
    title: "Behind the Lens",
    location: "Brooklyn Studio",
    date: "April 2025",
    image: bts4,
    description: "Calibrating macro focal length."
  },
  {
    id: 5,
    title: "Active Set B-Roll",
    location: "Production Stage",
    date: "May 2025",
    image: bts5,
    description: "Capturing stage atmospheric details."
  },
  {
    id: 6,
    title: "Camera Calibration",
    location: "Astoria Studio",
    date: "July 2025",
    image: bts6,
    description: "Balancing primary gear rigs."
  },
  {
    id: 7,
    title: "Shadow Staging",
    location: "Street Location Set",
    date: "October 2025",
    image: bts7,
    description: "Drafting dramatic scene silhouettes."
  },
  {
    id: 8,
    title: "Spotlight Control",
    location: "Studio A",
    date: "August 2025",
    image: bts8,
    description: "Testing dynamic key light ray paths."
  },
  {
    id: 9,
    title: "Lens Staging",
    location: "Astoria Studio",
    date: "July 2025",
    image: bts9,
    description: "Mounting customized vintage glass."
  },
  {
    id: 10,
    title: "Light Refraction",
    location: "Warehouse Stage",
    date: "June 2025",
    image: bts10,
    description: "Splitting lighting into graphic shapes."
  },
  {
    id: 11,
    title: "On-Set Coordination",
    location: "Brooklyn Studio",
    date: "April 2025",
    image: bts11,
    description: "Reviewing cast positioning."
  },
  {
    id: 12,
    title: "Focus Adjustments",
    location: "Studio A",
    date: "August 2025",
    image: bts12,
    description: "Calibrating lens focus markings."
  },
  {
    id: 13,
    title: "Rig Profile",
    location: "Manhattan Loft Set",
    date: "March 2025",
    image: bts13,
    description: "Verifying high contrast framing."
  },
  {
    id: 14,
    title: "Light Modifiers",
    location: "Manhattan Loft Set",
    date: "March 2025",
    image: bts14,
    description: "Setting up bounce boards."
  },
  {
    id: 15,
    title: "Close-up Blocking",
    location: "Astoria Studio",
    date: "July 2025",
    image: bts15,
    description: "Securing focus margins."
  },
  {
    id: 16,
    title: "Staging Setup",
    location: "Studio A",
    date: "August 2025",
    image: bts16,
    description: "Checking camera elevation level."
  },
  {
    id: 17,
    title: "Color Grading Check",
    location: "Editing Suite C",
    date: "December 2025",
    image: bts17,
    description: "Locking in target color spaces."
  },
  {
    id: 18,
    title: "Atmosphere Control",
    location: "Warehouse Stage",
    date: "June 2025",
    image: bts18,
    description: "Calibrating stage fog thickness."
  }
];

export const faqs = [
  {
    question: "What cameras and lenses do you prefer for shooting?",
    answer: "We primarily shoot on the Arri Alexa 35 and RED V-Raptor, paired with vintage anamorphic lenses or custom Cooke Speed Panchros to achieve our signature textured, organic look."
  },
  {
    question: "How do you approach collaboration with screenwriters?",
    answer: "For us, story is everything. We work in close dialogue with writers from the earliest outlines, ensuring that the visual syntax of the film is baked into the subtext of the script itself."
  },
  {
    question: "Do you offer internship opportunities at Golden Boy Productions?",
    answer: "Yes, we offer seasonal mentorship programs in editing, cinematography, and assistant directing during active productions. Inquiries should be sent with a resume and portfolio reel."
  }
];

export const recommendableMovies = [
  { title: "Stalker", director: "Andrei Tarkovsky", year: "1979" },
  { title: "Persona", director: "Ingmar Bergman", year: "1966" },
  { title: "Taxi Driver", director: "Martin Scorsese", year: "1976" },
  { title: "In the Mood for Love", director: "Wong Kar-wai", year: "2000" },
  { title: "Seven Samurai", director: "Akira Kurosawa", year: "1954" },
  { title: "Citizen Kane", director: "Orson Welles", year: "1941" },
  { title: "The 400 Blows", director: "François Truffaut", year: "1959" },
  { title: "8½", director: "Federico Fellini", year: "1963" },
  { title: "Bicycle Thieves", director: "Vittorio De Sica", year: "1948" },
  { title: "Breathless", director: "Jean-Luc Godard", year: "1960" },
  { title: "Tokyo Story", director: "Yasujirō Ozu", year: "1953" },
  { title: "La Haine", director: "Mathieu Kassovitz", year: "1995" },
  { title: "Rashomon", director: "Akira Kurosawa", year: "1950" },
  { title: "Paris, Texas", director: "Wim Wenders", year: "1984" },
  { title: "The Double Life of Véronique", director: "Krzysztof Kieślowski", year: "1991" }
];
