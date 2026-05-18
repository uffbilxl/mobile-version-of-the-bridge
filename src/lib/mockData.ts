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
  { id: "d1", name: "Lenovo ThinkPad E14", category: "Laptop", postcode: "M1", distance_miles: 0.4, availability_type: "Free to keep", specs: "i5 · 16GB · 256GB SSD", available_nationally: false, hub_name: "Moss Side Digital Hub", lat: 53.4601, lng: -2.2357 },
  { id: "d2", name: "iPad (8th gen)", category: "Tablet", postcode: "M12", distance_miles: 0.7, availability_type: "Free to keep", specs: "32GB · WiFi · with case", available_nationally: false, hub_name: "Ardwick Library", lat: 53.4701, lng: -2.2108 },
  { id: "d3", name: "Dell Latitude 5400", category: "Laptop", postcode: "M11", distance_miles: 1.2, availability_type: "3-month loan", specs: "i5 · 8GB · 256GB SSD", available_nationally: false, hub_name: "Openshaw Centre", lat: 53.4752, lng: -2.1724 },
  { id: "d4", name: "BT Home Broadband Kit", category: "Broadband", postcode: "all", distance_miles: null, availability_type: "Free to keep", specs: "12 months free · 36Mbps", available_nationally: true, hub_name: "Posted to you", lat: 53.4808, lng: -2.2426 },
  { id: "d5", name: "HP EliteBook 840 G6", category: "Laptop", postcode: "M13", distance_miles: 1.8, availability_type: "Collect today", specs: "i7 · 16GB · 512GB SSD", available_nationally: false, hub_name: "Longsight Centre", lat: 53.4608, lng: -2.1938 },
  { id: "d6", name: "Samsung Galaxy A14", category: "Mobile", postcode: "M4", distance_miles: 2.1, availability_type: "Free to keep", specs: "64GB · 5G · unlocked", available_nationally: false, hub_name: "Ancoats Hub", lat: 53.4841, lng: -2.2189 },
  { id: "d7", name: "Chromebook Lenovo 300e", category: "Laptop", postcode: "M14", distance_miles: 2.4, availability_type: "3-month loan", specs: "4GB · 64GB · touchscreen", available_nationally: false, hub_name: "Whalley Range Library", lat: 53.4481, lng: -2.2565 },
  { id: "d8", name: "MacBook Air 2019", category: "Laptop", postcode: "M60", distance_miles: 3.0, availability_type: "Free to keep", specs: "i5 · 8GB · 128GB SSD", available_nationally: false, hub_name: "Eccles Centre", lat: 53.4875, lng: -2.3340 },
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
  { id: "m3", name: "Muhammad Asim Raza", initials: "MR", role: "Product Manager", company: "Monzo", category: "Product", skill_tags: ["Product thinking", "Interviews"], availability: "This week", story: "Came into product from a customer support role. No MBA. Just curiosity and lots of asking.", bio: "How product actually works, how to talk about your ideas, and how to interview without panicking.", color: "#378ADD", testimonial: { quote: "Asim made product management feel possible without a fancy degree. I now run a squad at a fintech.", author: "Priya, 24 · Manchester" } },
  { id: "m4", name: "Hamzah Abdur Rahman", initials: "HR", role: "Data Scientist", company: "NHS Digital", category: "AI", skill_tags: ["Python", "AI", "Data"], availability: "3 slots left", story: "I work on data that helps real patients. Came from a sociology degree, learnt Python on YouTube.", bio: "Getting into data and AI. We'll figure out what to learn, in what order, and where to practise.", color: "#AFA9EC", testimonial: { quote: "Hamzah gave me a learning path that didn't waste a single hour. I built my first ML model in a month.", author: "Daniel, 22 · Leeds" } },
  { id: "m5", name: "Adeel Ali", initials: "AA", role: "Frontend Dev", company: "Spotify", category: "Engineering", skill_tags: ["React", "CSS", "Web"], availability: "Available today", story: "First job was at a print shop. Now I build the Spotify web player. The internet is wild.", bio: "React, CSS, and what a real frontend role actually looks like day to day.", color: "#00E5A0", testimonial: { quote: "Adeel made React click for me in 30 minutes after months of YouTube tutorials going nowhere.", author: "Maya, 18 · Bristol" } },
  { id: "m6", name: "Hamza Wahbi", initials: "HW", role: "Community Mentor", company: "Centauri", category: "Career advice", skill_tags: ["Confidence", "Goals"], availability: "Walk-in available", story: "I've mentored 200+ young people. My job is to help you figure out what you actually want.", bio: "Not sure what direction to go in? Start here. No tech jargon, just a real conversation.", color: "#FFA657", testimonial: { quote: "I had no clue what I wanted to do. Hamza helped me figure it out without making me feel small.", author: "Tomi, 17 · Manchester" } },
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

// Postcode → device matching (Manchester-focused)
export function devicesForPostcode(raw: string): Device[] {
  const pc = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!pc) return [];
  // Always include BT Broadband
  const bt = DEVICES.find(d => d.id === "d4")!;

  const exactMatches: Record<string, string[]> = {
    M1: ["d1", "d2"],
    M11: ["d3"],
    M12: ["d2"],
    M13: ["d5"],
    M4: ["d6"],
    M14: ["d7"],
    M60: ["d8"],
  };

  // Try outward code (first 2-3 chars before any digit run)
  const outward = pc.match(/^([A-Z]{1,2}\d{1,2})/)?.[1];
  if (outward && exactMatches[outward]) {
    return [...exactMatches[outward].map(id => DEVICES.find(d => d.id === id)!), bt];
  }
  // Any Manchester area: nearest Manchester devices
  if (outward && /^M\d/.test(outward)) {
    return [DEVICES.find(d => d.id === "d1")!, DEVICES.find(d => d.id === "d3")!, bt];
  }
  // Unknown — broadband only
  return [bt];
}

export const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
