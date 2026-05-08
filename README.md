HabitFlow – A Minimalist Habit Tracking System
HabitFlow is a modern, mobile-first Progressive Web App (PWA) designed to help users build and maintain long-term habits through data-driven insights and gamification. Built with a focus on minimalist design and high-performance backend synchronization.

🛠️ Technical Stack
Frontend: React.js with Tailwind CSS & Shadcn/UI.

Backend/Database: Supabase (PostgreSQL) with Row-Level Security (RLS).

Authentication: Supabase Auth (Email/Password & Social Providers).

Analytics: Custom-built Stats engine with D3-style consistency heatmaps.

API/State Management: Real-time synchronization with Optimistic UI updates.

✨ Key Features
GitHub-Style Heatmap: A 26-week consistency grid to visualize habit trends over time.

Trophy Room: Logic-gated achievement system (Starter, Consistent, and Master badges).

PWA Ready: Fully installable on mobile devices with offline resilience via Service Workers.

Engagement Engine: Dual-layer notifications (In-app Toasts & Web Push Notifications API).

Smart Streak Logic: Automated streak tracking that differentiates between active toggles and historical logs.

Native Gestures: Includes 'Pull-to-Refresh' and a 'Quick Add' FAB for a native mobile experience.

🏗️ Architectural Insights
As a Senior Software Engineer, the project was developed using an AI-assisted SDLC, evolving from a Figma prototype to a production-ready PWA. Key architectural decisions include:

Data Persistence: Migrated from localStorage to a structured PostgreSQL schema for multi-device sync.

Security: Implemented protected routes and session persistence to ensure data privacy.

UI Performance: Optimized perceived performance using Skeleton Shimmer loaders and canvas-confetti for user delight.
