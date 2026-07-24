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
    video: projVideo6
  },
  {
    id: 2,
    title: "Disaster Preparedness",
    type: "PSA / Commercial Ad",
    year: "2025",
    role: "Producer / Director",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    description: "A targeted public service announcement and commercial campaign produced in collaboration with the City of Fairview to promote civic safety and highlight their disaster preparedness course.",
    video: projVideo1
  },
  {
    id: 3,
    title: "Hive Recovery Website Visual",
    type: "Website Visual / Promo",
    year: "2025",
    role: "Visual Director",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    description: "A customized website visual and promotional loop created for the Hive Recovery Collective, a small business based in Gresham, to capture their workspace and digital identity.",
    video: projVideo4
  },
  {
    id: 4,
    title: "EMOPI Video",
    type: "Community Spotlight Video",
    year: "2025",
    role: "Co-Director / Video Producer",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    description: "A dedicated community profile film created to highlight the stories, achievements, and impact of the EMOPI program in Gresham.",
    video: projVideo2
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
    video: projVideo3
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
  // 1970s Classics
  { title: "One Flew Over the Cuckoo's Nest", director: "Miloš Forman", year: "1975" },
  { title: "Jaws", director: "Steven Spielberg", year: "1975" },
  { title: "Barry Lyndon", director: "Stanley Kubrick", year: "1975" },
  { title: "Taxi Driver", director: "Martin Scorsese", year: "1976" },
  { title: "Rocky", director: "John G. Avildsen", year: "1976" },
  { title: "Network", director: "Sidney Lumet", year: "1976" },
  { title: "Annie Hall", director: "Woody Allen", year: "1977" },
  { title: "Star Wars", director: "George Lucas", year: "1977" },
  { title: "Close Encounters of the Third Kind", director: "Steven Spielberg", year: "1977" },
  { title: "The Deer Hunter", director: "Michael Cimino", year: "1978" },
  { title: "Days of Heaven", director: "Terrence Malick", year: "1978" },
  { title: "Apocalypse Now", director: "Francis Ford Coppola", year: "1979" },
  { title: "Alien", director: "Ridley Scott", year: "1979" },
  { title: "Stalker", director: "Andrei Tarkovsky", year: "1979" },
  // 1980s
  { title: "The Shining", director: "Stanley Kubrick", year: "1980" },
  { title: "Raging Bull", director: "Martin Scorsese", year: "1980" },
  { title: "The Empire Strikes Back", director: "Irvin Kershner", year: "1980" },
  { title: "Raiders of the Lost Ark", director: "Steven Spielberg", year: "1981" },
  { title: "Das Boot", director: "Wolfgang Petersen", year: "1981" },
  { title: "Blade Runner", director: "Ridley Scott", year: "1982" },
  { title: "E.T. the Extra-Terrestrial", director: "Steven Spielberg", year: "1982" },
  { title: "Scarface", director: "Brian De Palma", year: "1983" },
  { title: "The Right Stuff", director: "Philip Kaufman", year: "1983" },
  { title: "Amadeus", director: "Miloš Forman", year: "1984" },
  { title: "Paris, Texas", director: "Wim Wenders", year: "1984" },
  { title: "The Terminator", director: "James Cameron", year: "1984" },
  { title: "Once Upon a Time in America", director: "Sergio Leone", year: "1984" },
  { title: "Back to the Future", director: "Robert Zemeckis", year: "1985" },
  { title: "Ran", director: "Akira Kurosawa", year: "1985" },
  { title: "Come and See", director: "Elem Klimov", year: "1985" },
  { title: "Blue Velvet", director: "David Lynch", year: "1986" },
  { title: "Platoon", director: "Oliver Stone", year: "1986" },
  { title: "Stand by Me", director: "Rob Reiner", year: "1986" },
  { title: "Full Metal Jacket", director: "Stanley Kubrick", year: "1987" },
  { title: "Wings of Desire", director: "Wim Wenders", year: "1987" },
  { title: "The Princess Bride", director: "Rob Reiner", year: "1987" },
  { title: "Rain Man", director: "Barry Levinson", year: "1988" },
  { title: "Cinema Paradiso", director: "Giuseppe Tornatore", year: "1988" },
  { title: "My Neighbor Totoro", director: "Hayao Miyazaki", year: "1988" },
  { title: "Do the Right Thing", director: "Spike Lee", year: "1989" },
  { title: "Dead Poets Society", director: "Peter Weir", year: "1989" },
  // 1990s
  { title: "Goodfellas", director: "Martin Scorsese", year: "1990" },
  { title: "Edward Scissorhands", director: "Tim Burton", year: "1990" },
  { title: "The Silence of the Lambs", director: "Jonathan Demme", year: "1991" },
  { title: "The Double Life of Véronique", director: "Krzysztof Kieślowski", year: "1991" },
  { title: "Boyz n the Hood", director: "John Singleton", year: "1991" },
  { title: "Terminator 2: Judgment Day", director: "James Cameron", year: "1991" },
  { title: "Reservoir Dogs", director: "Quentin Tarantino", year: "1992" },
  { title: "Unforgiven", director: "Clint Eastwood", year: "1992" },
  { title: "Schindler's List", director: "Steven Spielberg", year: "1993" },
  { title: "Jurassic Park", director: "Steven Spielberg", year: "1993" },
  { title: "Groundhog Day", director: "Harold Ramis", year: "1993" },
  { title: "Dazed and Confused", director: "Richard Linklater", year: "1993" },
  { title: "Pulp Fiction", director: "Quentin Tarantino", year: "1994" },
  { title: "The Shawshank Redemption", director: "Frank Darabont", year: "1994" },
  { title: "Forrest Gump", director: "Robert Zemeckis", year: "1994" },
  { title: "The Lion King", director: "Roger Allers & Rob Minkoff", year: "1994" },
  { title: "Léon: The Professional", director: "Luc Besson", year: "1994" },
  { title: "Trois Couleurs: Rouge", director: "Krzysztof Kieślowski", year: "1994" },
  { title: "La Haine", director: "Mathieu Kassovitz", year: "1995" },
  { title: "Se7en", director: "David Fincher", year: "1995" },
  { title: "Heat", director: "Michael Mann", year: "1995" },
  { title: "Toy Story", director: "John Lasseter", year: "1995" },
  { title: "Before Sunrise", director: "Richard Linklater", year: "1995" },
  { title: "Fargo", director: "Joel & Ethan Coen", year: "1996" },
  { title: "Trainspotting", director: "Danny Boyle", year: "1996" },
  { title: "Good Will Hunting", director: "Gus Van Sant", year: "1997" },
  { title: "L.A. Confidential", director: "Curtis Hanson", year: "1997" },
  { title: "Titanic", director: "James Cameron", year: "1997" },
  { title: "Princess Mononoke", director: "Hayao Miyazaki", year: "1997" },
  { title: "Saving Private Ryan", director: "Steven Spielberg", year: "1998" },
  { title: "The Thin Red Line", director: "Terrence Malick", year: "1998" },
  { title: "The Big Lebowski", director: "Joel & Ethan Coen", year: "1998" },
  { title: "The Truman Show", director: "Peter Weir", year: "1998" },
  { title: "Fight Club", director: "David Fincher", year: "1999" },
  { title: "The Matrix", director: "The Wachowskis", year: "1999" },
  { title: "American Beauty", director: "Sam Mendes", year: "1999" },
  { title: "Magnolia", director: "Paul Thomas Anderson", year: "1999" },
  { title: "Eyes Wide Shut", director: "Stanley Kubrick", year: "1999" },
  // 2000s
  { title: "In the Mood for Love", director: "Wong Kar-wai", year: "2000" },
  { title: "Gladiator", director: "Ridley Scott", year: "2000" },
  { title: "Requiem for a Dream", director: "Darren Aronofsky", year: "2000" },
  { title: "Memento", director: "Christopher Nolan", year: "2000" },
  { title: "Crouching Tiger, Hidden Dragon", director: "Ang Lee", year: "2000" },
  { title: "Amélie", director: "Jean-Pierre Jeunet", year: "2001" },
  { title: "Mulholland Drive", director: "David Lynch", year: "2001" },
  { title: "Spirited Away", director: "Hayao Miyazaki", year: "2001" },
  { title: "The Lord of the Rings: The Fellowship of the Ring", director: "Peter Jackson", year: "2001" },
  { title: "City of God", director: "Fernando Meirelles", year: "2002" },
  { title: "The Pianist", director: "Roman Polanski", year: "2002" },
  { title: "28 Days Later", director: "Danny Boyle", year: "2002" },
  { title: "Lost in Translation", director: "Sofia Coppola", year: "2003" },
  { title: "Kill Bill: Volume 1", director: "Quentin Tarantino", year: "2003" },
  { title: "Oldboy", director: "Park Chan-wook", year: "2003" },
  { title: "Eternal Sunshine of the Spotless Mind", director: "Michel Gondry", year: "2004" },
  { title: "The Motorcycle Diaries", director: "Walter Salles", year: "2004" },
  { title: "Crash", director: "Paul Haggis", year: "2004" },
  { title: "Million Dollar Baby", director: "Clint Eastwood", year: "2004" },
  { title: "Brokeback Mountain", director: "Ang Lee", year: "2005" },
  { title: "A History of Violence", director: "David Cronenberg", year: "2005" },
  { title: "Batman Begins", director: "Christopher Nolan", year: "2005" },
  { title: "Pan's Labyrinth", director: "Guillermo del Toro", year: "2006" },
  { title: "Children of Men", director: "Alfonso Cuarón", year: "2006" },
  { title: "The Departed", director: "Martin Scorsese", year: "2006" },
  { title: "Babel", director: "Alejandro González Iñárritu", year: "2006" },
  { title: "There Will Be Blood", director: "Paul Thomas Anderson", year: "2007" },
  { title: "No Country for Old Men", director: "Joel & Ethan Coen", year: "2007" },
  { title: "Into the Wild", director: "Sean Penn", year: "2007" },
  { title: "The Diving Bell and the Butterfly", director: "Julian Schnabel", year: "2007" },
  { title: "The Dark Knight", director: "Christopher Nolan", year: "2008" },
  { title: "WALL·E", director: "Andrew Stanton", year: "2008" },
  { title: "Slumdog Millionaire", director: "Danny Boyle", year: "2008" },
  { title: "The Wrestler", director: "Darren Aronofsky", year: "2008" },
  { title: "Inglourious Basterds", director: "Quentin Tarantino", year: "2009" },
  { title: "Up", director: "Pete Docter", year: "2009" },
  { title: "A Prophet", director: "Jacques Audiard", year: "2009" },
  { title: "District 9", director: "Neill Blomkamp", year: "2009" },
  // 2010s
  { title: "Inception", director: "Christopher Nolan", year: "2010" },
  { title: "The Social Network", director: "David Fincher", year: "2010" },
  { title: "Black Swan", director: "Darren Aronofsky", year: "2010" },
  { title: "Toy Story 3", director: "Lee Unkrich", year: "2010" },
  { title: "The Tree of Life", director: "Terrence Malick", year: "2011" },
  { title: "Drive", director: "Nicolas Winding Refn", year: "2011" },
  { title: "A Separation", director: "Asghar Farhadi", year: "2011" },
  { title: "The Artist", director: "Michel Hazanavicius", year: "2011" },
  { title: "Django Unchained", director: "Quentin Tarantino", year: "2012" },
  { title: "Moonrise Kingdom", director: "Wes Anderson", year: "2012" },
  { title: "Amour", director: "Michael Haneke", year: "2012" },
  { title: "Beasts of the Southern Wild", director: "Benh Zeitlin", year: "2012" },
  { title: "12 Years a Slave", director: "Steve McQueen", year: "2013" },
  { title: "Gravity", director: "Alfonso Cuarón", year: "2013" },
  { title: "Her", director: "Spike Jonze", year: "2013" },
  { title: "Blue Is the Warmest Colour", director: "Abdellatif Kechiche", year: "2013" },
  { title: "Boyhood", director: "Richard Linklater", year: "2014" },
  { title: "Whiplash", director: "Damien Chazelle", year: "2014" },
  { title: "Birdman", director: "Alejandro González Iñárritu", year: "2014" },
  { title: "The Grand Budapest Hotel", director: "Wes Anderson", year: "2014" },
  { title: "Interstellar", director: "Christopher Nolan", year: "2014" },
  { title: "Mad Max: Fury Road", director: "George Miller", year: "2015" },
  { title: "The Revenant", director: "Alejandro González Iñárritu", year: "2015" },
  { title: "Spotlight", director: "Tom McCarthy", year: "2015" },
  { title: "Carol", director: "Todd Haynes", year: "2015" },
  { title: "Room", director: "Lenny Abrahamson", year: "2015" },
  { title: "Moonlight", director: "Barry Jenkins", year: "2016" },
  { title: "La La Land", director: "Damien Chazelle", year: "2016" },
  { title: "Arrival", director: "Denis Villeneuve", year: "2016" },
  { title: "Manchester by the Sea", director: "Kenneth Lonergan", year: "2016" },
  { title: "The Handmaiden", director: "Park Chan-wook", year: "2016" },
  { title: "Get Out", director: "Jordan Peele", year: "2017" },
  { title: "Dunkirk", director: "Christopher Nolan", year: "2017" },
  { title: "Blade Runner 2049", director: "Denis Villeneuve", year: "2017" },
  { title: "Phantom Thread", director: "Paul Thomas Anderson", year: "2017" },
  { title: "Lady Bird", director: "Greta Gerwig", year: "2017" },
  { title: "Call Me by Your Name", director: "Luca Guadagnino", year: "2017" },
  { title: "Roma", director: "Alfonso Cuarón", year: "2018" },
  { title: "The Favourite", director: "Yorgos Lanthimos", year: "2018" },
  { title: "Burning", director: "Lee Chang-dong", year: "2018" },
  { title: "Shoplifters", director: "Hirokazu Kore-eda", year: "2018" },
  { title: "Spider-Man: Into the Spider-Verse", director: "Peter Ramsey", year: "2018" },
  { title: "Parasite", director: "Bong Joon-ho", year: "2019" },
  { title: "1917", director: "Sam Mendes", year: "2019" },
  { title: "Marriage Story", director: "Noah Baumbach", year: "2019" },
  { title: "Portrait of a Lady on Fire", director: "Céline Sciamma", year: "2019" },
  { title: "The Lighthouse", director: "Robert Eggers", year: "2019" },
  { title: "Uncut Gems", director: "Josh & Benny Safdie", year: "2019" },
  // 2020s
  { title: "Nomadland", director: "Chloé Zhao", year: "2020" },
  { title: "Minari", director: "Lee Isaac Chung", year: "2020" },
  { title: "Sound of Metal", director: "Darius Marder", year: "2020" },
  { title: "Another Round", director: "Thomas Vinterberg", year: "2020" },
  { title: "Promising Young Woman", director: "Emerald Fennell", year: "2020" },
  { title: "Dune", director: "Denis Villeneuve", year: "2021" },
  { title: "The Power of the Dog", director: "Jane Campion", year: "2021" },
  { title: "Drive My Car", director: "Ryûsuke Hamaguchi", year: "2021" },
  { title: "The Worst Person in the World", director: "Joachim Trier", year: "2021" },
  { title: "Licorice Pizza", director: "Paul Thomas Anderson", year: "2021" },
  { title: "Everything Everywhere All at Once", director: "Daniel Kwan & Daniel Scheinert", year: "2022" },
  { title: "The Banshees of Inisherin", director: "Martin McDonagh", year: "2022" },
  { title: "Tár", director: "Todd Field", year: "2022" },
  { title: "Aftersun", director: "Charlotte Wells", year: "2022" },
  { title: "Top Gun: Maverick", director: "Joseph Kosinski", year: "2022" },
  { title: "Decision to Leave", director: "Park Chan-wook", year: "2022" },
  { title: "Oppenheimer", director: "Christopher Nolan", year: "2023" },
  { title: "Killers of the Flower Moon", director: "Martin Scorsese", year: "2023" },
  { title: "Past Lives", director: "Celine Song", year: "2023" },
  { title: "The Zone of Interest", director: "Jonathan Glazer", year: "2023" },
  { title: "Anatomy of a Fall", director: "Justine Triet", year: "2023" },
  { title: "Poor Things", director: "Yorgos Lanthimos", year: "2023" },
  { title: "Dune: Part Two", director: "Denis Villeneuve", year: "2024" },
  { title: "Anora", director: "Sean Baker", year: "2024" },
  { title: "The Brutalist", director: "Brady Corbet", year: "2024" },
  { title: "Conclave", director: "Edward Berger", year: "2024" },
  { title: "The Substance", director: "Coralie Fargeat", year: "2024" },
  { title: "A Real Pain", director: "Jesse Eisenberg", year: "2024" },
  { title: "Emilia Pérez", director: "Jacques Audiard", year: "2024" },
  { title: "All We Imagine as Light", director: "Payal Kapadia", year: "2024" },
  { title: "Flow", director: "Gints Zilbalodis", year: "2024" },
];
