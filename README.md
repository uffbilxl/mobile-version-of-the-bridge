# Bridge Local Guide — Mobile

The mobile-first version of the Bridge Local Guide. Optimised for touch interfaces and smaller screens, it delivers the same interactive map, 3D visuals, and Supabase-backed experience as the desktop app — built for users on the go.

---

## Features

- **Mobile-Optimised UI** — Touch-friendly layouts and navigation designed for small screens
- **Interactive Map** — Google Maps integration for browsing local points of interest
- **3D Visualisations** — Three.js / React Three Fiber powered scenes for immersive content
- **Authentication & Data** — Supabase-backed user accounts, real-time data, and persistent storage
- **Animated UI** — Smooth transitions and interactions powered by Framer Motion
- **Data Charts** — Stats and insights rendered with Recharts
- **Fully Type-Safe** — End-to-end TypeScript with Zod schema validation and React Hook Form
- **Edge Deployment** — Runs on Cloudflare Workers for low-latency global availability

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR / full-stack) |
| Routing | [TanStack Router](https://tanstack.com/router) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Animations | [Framer Motion](https://www.framer-motion.com) |
| 3D | [React Three Fiber](https://r3f.docs.pmnd.rs) + [Drei](https://github.com/pmndrs/drei) |
| Maps | [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/) |
| Backend / Auth | [Supabase](https://supabase.com) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Charts | [Recharts](https://recharts.org) |
| Runtime / Build | [Bun](https://bun.sh) + [Vite](https://vite.dev) |
| Deployment | [Cloudflare Workers](https://workers.cloudflare.com) |
| Language | TypeScript |

---

## Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the development server |
| `bun run build` | Production build |
| `bun run build:dev` | Development build (unminified) |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |

---

## Project Structure

```
mobile-version-of-the-bridge/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   │   └── ui/       # shadcn/ui primitives
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities and helpers
│   ├── routes/       # TanStack Router file-based routes
│   └── server.ts     # SSR / Cloudflare Workers entry point
├── supabase/         # Supabase config and migrations
├── .env              # Environment variables (do not commit secrets)
├── components.json   # shadcn/ui config
├── vite.config.ts    # Vite + TanStack Start config
└── wrangler.jsonc    # Cloudflare Workers config
```

---

## Related

- [bridge-local-guide](https://github.com/uffbilxl/bridge-local-guide) — The desktop version of this app

---

## License

This project does not currently specify a license. Please contact the repository owner before using this code in your own projects.
