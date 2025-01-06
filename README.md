# AI Podcast

This is an automated AI podcast website build with everything new in Next.js 14. It is bootstrapped with `create-t3-app`.

[![AI Podcast](./public/og.ong)](https://prllx.vercel.app/)

> **Warning**
> The project was discontinued as of 2024.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **User Management:** [Clerk](https://clerk.com)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **File Uploads:** [uploadthing](https://uploadthing.com)

## Features to be implemented

- [x] Authentication with **Clerk**
- [x] ORM using **Drizzle ORM**
- [x] PostgreSQL Database on **Supabase**
- [x] Redis and QStash on **Upstash**
- [x] File uploads with **uploadthing**
- [x] Message queues handlers and verified access with **QStash**
- [x] Script and branch generation with **ChatGPT**
- [x] Text-to-speech with **ElevenLabs**
- [x] Merging segment audios into final audio
- [x] Analyzing content and creating podcasts based on it
- [ ] Add section for trending AI tools (for collaborations)

## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/iboughtbed/ai-podcast.git
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Copy the `.env.example` to `.env` and update the variables.

   ```bash
   cp .env.example .env
   ```

4. Start the development server

   ```bash
   pnpm run dev
   ```

5. Push the database schema

   ```bash
   pnpm run db:push
   ```

## License

Licensed under the MIT License. Check the [LICENSE](./LICENSE.md) file for details.
