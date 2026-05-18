export type DeviceCategory = "Laptop" | "Tablet" | "Broadband" | "Mobile";
export type AvailabilityType = "Free to keep" | "3-month loan" | "Collect today" | "Notify me";

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  postcode: string;
  distance_miles: number | null;
  availability_type: AvailabilityType;
  specs: string;
  available_nationally: boolean;
  hub_name: string;
  lat: number;
  lng: number;
}

export const DEVICES: Device[] = [
  { id: "d1", name: "Lenovo ThinkPad E14", category: "Laptop", postcode: "B4", distance_miles: 0.2, availability_type: "Free to keep", specs: "i5 · 16GB · 256GB SSD", available_nationally: false, hub_name: "BCU Curzon Building", lat: 52.4830, lng: -1.8920 },
  { id: "d2", name: "iPad (8th gen)", category: "Tablet", postcode: "B5", distance_miles: 0.6, availability_type: "Free to keep", specs: "32GB · WiFi · with case", available_nationally: false, hub_name: "Digbeth Library", lat: 52.4750, lng: -1.8870 },
  { id: "d3", name: "Dell Latitude 5400", category: "Laptop", postcode: "B12", distance_miles: 1.4, availability_type: "3-month loan", specs: "i5 · 8GB · 256GB SSD", available_nationally: false, hub_name: "Balsall Heath Centre", lat: 52.4570, lng: -1.8870 },
  { id: "d4", name: "BT Home Broadband Kit", category: "Broadband", postcode: "all", distance_miles: null, availability_type: "Free to keep", specs: "12 months free · 36Mbps", available_nationally: true, hub_name: "Posted to you", lat: 52.4862, lng: -1.8904 },
  { id: "d5", name: "HP EliteBook 840 G6", category: "Laptop", postcode: "B1", distance_miles: 0.8, availability_type: "Collect today", specs: "i7 · 16GB · 512GB SSD", available_nationally: false, hub_name: "Library of Birmingham", lat: 52.4796, lng: -1.9123 },
  { id: "d6", name: "Samsung Galaxy A14", category: "Mobile", postcode: "B19", distance_miles: 1.9, availability_type: "Free to keep", specs: "64GB · 5G · unlocked", available_nationally: false, hub_name: "Newtown Community Hub", lat: 52.4985, lng: -1.9000 },
  { id: "d7", name: "Chromebook Lenovo 300e", category: "Laptop", postcode: "B13", distance_miles: 2.6, availability_type: "3-month loan", specs: "4GB · 64GB · touchscreen", available_nationally: false, hub_name: "Moseley Library", lat: 52.4470, lng: -1.8830 },
  { id: "d8", name: "MacBook Air 2019", category: "Laptop", postcode: "B18", distance_miles: 2.2, availability_type: "Free to keep", specs: "i5 · 8GB · 128GB SSD", available_nationally: false, hub_name: "Soho Road Hub", lat: 52.5040, lng: -1.9320 },
];

export interface Mentor {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  category: "Engineering" | "Design" | "Product" | "AI" | "Career advice";
  skill_tags: string[];
  availability: string;
  story: string;
  bio: string;
  color: string;
  testimonial: { quote: string; author: string };
}

export const MENTORS: Mentor[] = [
  { id: "m1", name: "Prem Lodhia", initials: "PL", role: "Software Engineer", company: "Google", category: "Engineering", skill_tags: ["Python", "Computer Vision", "Career"], availability: "Available today", story: "Grew up in south London, taught myself Python at 19. Now I write ML pipelines at Google.", bio: "I help people break into engineering without a CS degree. We'll talk about projects, interviews, and what to actually study.", color: "#00E5A0", testimonial: { quote: "Prem broke down the FAANG interview into something I could actually prepare for. Got my first offer eight weeks later.", author: "Jade, 21 · London" } },
  { id: "m2", name: "Bilal Arshad", initials: "BA", role: "UX Designer", company: "BBC", category: "Design", skill_tags: ["Figma", "Portfolio"], availability: "Available today", story: "I went from making memes for fun to designing news products watched by millions.", bio: "Portfolio reviews, Figma tips, and how to land your first design job without going to art school.", color: "#FFA657", testimonial: { quote: "My portfolio went from messy to interview-ready in one session. Bilal is brutally honest in the best way.", author: "Kai, 19 · Birmingham" } },
  { id: "m3", name: "Muhammad Asim Raza", initials: "MR", role: "Product Manager", company: "Monzo", category: "Product", skill_tags: ["Product thinking", "Interviews"], availability: "This week", story: "Came into product from a customer support role. No MBA. Just curiosity and lots of asking.", bio: "How product actually works, how to talk about your ideas, and how to interview without panicking.", color: "#378ADD", testimonial: { quote: "Asim made product management feel possible without a fancy degree. I now run a squad at a fintech.", author: "Priya, 24 · Birmingham" } },
  { id: "m4", name: "Hamzah Abdur Rahman", initials: "HR", role: "Data Scientist", company: "NHS Digital", category: "AI", skill_tags: ["Python", "AI", "Data"], availability: "3 slots left", story: "I work on data that helps real patients. Came from a sociology degree, learnt Python on YouTube.", bio: "Getting into data and AI. We'll figure out what to learn, in what order, and where to practise.", color: "#AFA9EC", testimonial: { quote: "Hamzah gave me a learning path that didn't waste a single hour. I built my first ML model in a month.", author: "Daniel, 22 · Leeds" } },
  { id: "m5", name: "Adeel Ali", initials: "AA", role: "Frontend Dev", company: "Spotify", category: "Engineering", skill_tags: ["React", "CSS", "Web"], availability: "Available today", story: "First job was at a print shop. Now I build the Spotify web player. The internet is wild.", bio: "React, CSS, and what a real frontend role actually looks like day to day.", color: "#00E5A0", testimonial: { quote: "Adeel made React click for me in 30 minutes after months of YouTube tutorials going nowhere.", author: "Maya, 18 · Bristol" } },
  { id: "m6", name: "Hamza Wahbi", initials: "HW", role: "Community Mentor", company: "Centauri", category: "Career advice", skill_tags: ["Confidence", "Goals"], availability: "Walk-in available", story: "I've mentored 200+ young people. My job is to help you figure out what you actually want.", bio: "Not sure what direction to go in? Start here. No tech jargon, just a real conversation.", color: "#FFA657", testimonial: { quote: "I had no clue what I wanted to do. Hamza helped me figure it out without making me feel small.", author: "Tomi, 17 · Birmingham" } },
  { id: "m7", name: "Sarah C.", initials: "SC", role: "DevOps Engineer", company: "ASOS", category: "Engineering", skill_tags: ["Cloud", "Linux", "Career"], availability: "This week", story: "Apprenticeship route. No university. Now I run cloud infrastructure for ASOS.", bio: "Apprenticeships, cloud basics, and a different way into engineering.", color: "#378ADD", testimonial: { quote: "Sarah showed me apprenticeships are a real path, not a fallback. I start at a FTSE 100 next month.", author: "Reece, 18 · Liverpool" } },
  { id: "m8", name: "Marcus W.", initials: "MW", role: "Founder", company: "YC startup", category: "Career advice", skill_tags: ["Entrepreneurship", "Funding"], availability: "This week", story: "Built my first product on my mum's old laptop. Got into YC three years later.", bio: "Building something? Let's talk. Ideas, first users, and what to do when you have no money.", color: "#AFA9EC", testimonial: { quote: "Marcus cut through six months of indecision in one call. We launched our MVP two weeks after.", author: "Yusuf, 23 · London" } },
];

export type LevelLabel = "Starting from zero" | "Know a little" | "Level up";

export interface Course {
  id: string;
  title: string;
  category: string;
  duration_hours: number;
  lesson_count: number;
  level_label: LevelLabel;
  mentor_name: string;
  description: string;
  progress_percent: number;
}

export const COURSES: Course[] = [
  { id: "c1", title: "Build your first website", category: "Web Dev", duration_hours: 6, lesson_count: 12, level_label: "Starting from zero", mentor_name: "Adeel Ali", description: "HTML, CSS, and a real website you can show people by the end of the weekend.", progress_percent: 0 },
  { id: "c2", title: "AI tools for everyday work", category: "AI", duration_hours: 4, lesson_count: 8, level_label: "Starting from zero", mentor_name: "Hamzah Abdur Rahman", description: "ChatGPT, Claude, and how to actually use AI for school, work, and side projects.", progress_percent: 0 },
  { id: "c3", title: "UI design with Figma", category: "Design", duration_hours: 8, lesson_count: 15, level_label: "Starting from zero", mentor_name: "Bilal Arshad", description: "From a blank canvas to a real app screen. No art degree required.", progress_percent: 0 },
  { id: "c4", title: "Video editing for social", category: "Video", duration_hours: 5, lesson_count: 10, level_label: "Starting from zero", mentor_name: "Muhammad Asim Raza", description: "Edit videos that actually look good. CapCut, transitions, and the rules nobody tells you.", progress_percent: 0 },
  { id: "c5", title: "Python for beginners", category: "Coding", duration_hours: 10, lesson_count: 20, level_label: "Know a little", mentor_name: "Prem Lodhia", description: "The language behind AI and most of the internet. Real projects, no fluff.", progress_percent: 0 },
  { id: "c6", title: "React in a weekend", category: "Web Dev", duration_hours: 12, lesson_count: 24, level_label: "Level up", mentor_name: "Adeel Ali", description: "Build a real app with React. Components, state, and shipping something live.", progress_percent: 0 },
];

export const SKILL_PILLS = ["Coding", "Design", "AI", "Video", "Marketing", "Web Dev"];

// Course modules (overview content for the course detail drawer)
export const COURSE_MODULES: Record<string, string[]> = {
  c1: [
    "How the web actually works (5 min)",
    "Your first HTML page",
    "Styling with CSS — colour, layout, spacing",
    "Responsive design for phones",
    "Forms, links, and buttons that feel real",
    "Putting your site online for free",
  ],
  c2: [
    "What AI is (and isn't)",
    "Prompting ChatGPT and Claude like a pro",
    "Using AI for school and study notes",
    "AI for writing, emails, and CVs",
    "Image and video AI tools",
    "Staying safe and avoiding AI mistakes",
  ],
  c3: [
    "Figma basics — frames, layers, components",
    "Type, colour, and spacing fundamentals",
    "Designing a mobile app screen",
    "Auto-layout and reusable components",
    "Prototyping clickable flows",
    "Building your first portfolio piece",
  ],
  c4: [
    "Setting up CapCut on phone or laptop",
    "Cuts, transitions, and pacing",
    "Adding music and sound design",
    "Captions and on-screen text",
    "Colour and filters that don't look cheap",
    "Exporting for TikTok, Reels and Shorts",
  ],
  c5: [
    "Installing Python and your first script",
    "Variables, loops, and conditionals",
    "Working with lists and dictionaries",
    "Functions and clean code",
    "Reading and writing files",
    "Mini-project: build a small data tool",
  ],
  c6: [
    "React mental model — components and props",
    "useState, useEffect, and event handlers",
    "Styling with Tailwind",
    "Fetching data from an API",
    "Routing with multiple pages",
    "Deploying your app to the internet",
  ],
};

// Postcode → device matching (Birmingham — BCU focused)
export function devicesForPostcode(raw: string): Device[] {
  const pc = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!pc) return [];
  // Always include BT Broadband
  const bt = DEVICES.find(d => d.id === "d4")!;

  const exactMatches: Record<string, string[]> = {
    B4: ["d1", "d5"],
    B5: ["d2"],
    B12: ["d3"],
    B1: ["d5", "d1"],
    B19: ["d6"],
    B13: ["d7"],
    B18: ["d8"],
    B21: ["d8"],
  };

  // Try outward code (first 2-3 chars before any digit run)
  const outward = pc.match(/^([A-Z]{1,2}\d{1,2})/)?.[1];
  if (outward && exactMatches[outward]) {
    return [...exactMatches[outward].map(id => DEVICES.find(d => d.id === id)!), bt];
  }
  // Any Birmingham area: nearest Birmingham devices
  if (outward && /^B\d/.test(outward)) {
    return [DEVICES.find(d => d.id === "d1")!, DEVICES.find(d => d.id === "d3")!, bt];
  }
  // Unknown — broadband only
  return [bt];
}

export const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
