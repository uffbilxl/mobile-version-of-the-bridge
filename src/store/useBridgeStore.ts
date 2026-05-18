import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface QuizAnswers {
  q1?: "yes" | "a-bit" | "what";
  q2?: "job" | "make" | "curious";
  q3?: "thirty" | "few-hours" | "all-in";
}

interface BridgeState {
  postcode: string;
  setPostcode: (p: string) => void;

  deviceFilter: string;
  setDeviceFilter: (f: string) => void;

  mentorFilter: string;
  setMentorFilter: (f: string) => void;

  skillPill: string;
  setSkillPill: (s: string) => void;

  activeDeviceId: string | null;
  setActiveDeviceId: (id: string | null) => void;

  quiz: QuizAnswers;
  setQuiz: (q: QuizAnswers) => void;

  courseProgress: Record<string, number>;
  startCourse: (id: string) => void;

  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  chatMessages: ChatMessage[];
  addMessage: (m: ChatMessage) => void;
  updateLastAssistant: (text: string) => void;
  clearChat: () => void;
}

export const useBridgeStore = create<BridgeState>()(
  persist(
    (set) => ({
      postcode: "",
      setPostcode: (p) => set({ postcode: p }),

      deviceFilter: "All",
      setDeviceFilter: (f) => set({ deviceFilter: f }),

      mentorFilter: "All",
      setMentorFilter: (f) => set({ mentorFilter: f }),

      skillPill: "All",
      setSkillPill: (s) => set({ skillPill: s }),

      activeDeviceId: null,
      setActiveDeviceId: (id) => set({ activeDeviceId: id }),

      quiz: {},
      setQuiz: (q) => set({ quiz: q }),

      courseProgress: {},
      startCourse: (id) =>
        set((s) => ({ courseProgress: { ...s.courseProgress, [id]: Math.max(8, s.courseProgress[id] ?? 0) } })),

      chatOpen: false,
      setChatOpen: (v) => set({ chatOpen: v }),
      chatMessages: [],
      addMessage: (m) => set((s) => ({ chatMessages: [...s.chatMessages, m] })),
      updateLastAssistant: (text) =>
        set((s) => {
          const msgs = [...s.chatMessages];
          const lastIdx = msgs.length - 1;
          if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
            msgs[lastIdx] = { ...msgs[lastIdx], content: text };
          }
          return { chatMessages: msgs };
        }),
      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: "bridge-store",
      partialize: (s) => ({
        postcode: s.postcode,
        quiz: s.quiz,
        courseProgress: s.courseProgress,
        chatMessages: s.chatMessages,
      }),
    },
  ),
);
