# Parallax Podcast

An Open-Source Platform to create AI-powered podcasts, audiobooks, and audio articles.

## What is Parallax?

Parallax is an open-source AI platform solution that gives users the power to **generate** their own podcasts, audiobooks, and audio articles from prompts, documents, images and web search.

## Why Parallax?

A lot of services today are either **closed-source**, **slow**, **have bad UX**, or **to complex to self-host**.
Parallax is different.

- ✅ **Open-Source** – No hidden agendas, fully transparent.
- 🦾 **AI Driven** - Enhance your podcasts with Agents & LLMs.
- 🔒 **Data Privacy First** – Your projects, your data. No tracking, no selling, no middlemen.
- ⚙️ **Self-Hosting Freedom** – Run your own app with ease.
- 🎨 **Customizable UI & Features** – Tailor your platform experience the way you want it.
- 🚀 **Developer-Friendly** – Built with extensibility and integrations in mind.

## Tech Stack

Parallax is built with modern and reliable technologies:

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Drizzle ORM, Redis, AI SDK
- **Database**: PostgreSQL
- **Authentication**: Better Auth, Google OAuth, Github OAuth
- **Payment**: Polar

## Getting Started

### Prerequisites

**Required Versions:**

- [Node.js](https://nodejs.org/en/download) (v18 or higher)
- [pnpm](https://pnpm.io) (v9 or higher)

Before running the application, you'll need to set up services and configure environment variables. For more details on environment variables, see the [Environment Variables](#environment-variables) section.

### Setup

#### Quick Start Guide

1. **Clone and Install**

   ```bash
   # Clone the repository
   git clone https://github.com/iboughtbed/ai-podcast.git
   cd ai-podcast

   # Install dependencies
   pnpm install
   ```

2. **Set Up Environment**

   - Copy `.env.example` to `.env` in both `apps/web` and `packages/db` folders
     ```bash
     cp apps/web/.env.example apps/web/.env && cp packages/db/.env.example packages/db/.env
     ```
   - Configure your environment variables (see below)
   - Initialize the database: `pnpm run db:push`

3. **Start the App**

   ```bash
   pnpm run dev
   ```

4. **Open in Browser**

   Visit [http://localhost:3000](http://localhost:3000)

### Environment Setup

1. **Better Auth Setup**

   - Open the `.env` file and change the BETTER_AUTH_SECRET to a random string. (Use `openssl rand -hex 32` to generate a 32 character string)

     ```env
     BETTER_AUTH_SECRET=your_secret_key
     ```

2. **Google OAuth Setup** (Required for Gmail integration)

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Add the following APIs in your Google Cloud Project: [People API](https://console.cloud.google.com/apis/library/people.googleapis.com), [Gmail API](https://console.cloud.google.com/apis/library/gmail.googleapis.com)
   - Enable the Google OAuth2 API
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized redirect URIs:
     - Development:
       - `http://localhost:3000/api/auth/callback/google`
       - `http://localhost:3000/api/auth/google/callback`
     - Production:
       - `https://your-production-url/api/auth/callback/google`
       - `https://your-production-url/api/auth/google/callback`
   - Add to `.env`:

     ```env
     GOOGLE_CLIENT_ID=your_client_id
     GOOGLE_CLIENT_SECRET=your_client_secret
     ```

   - Add yourself as a test user:

     - Go to [`Audience`](https://console.cloud.google.com/auth/audience)
     - Under 'Test users' click 'Add Users'
     - Add your email and click 'Save'

3. **GitHub OAuth Setup** (Optional)

   <details>
   <summary>Click to expand GitHub OAuth setup instructions</summary>

   - Go to [GitHub Developer Setting](https://github.com/settings/developers)
   - Create a new OAuth App
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/github`
     - Production: `https://your-production-url/api/auth/callback/github`
   - Add to `.env`:

     ```env
     GITHUB_CLIENT_ID=your_client_id
     GITHUB_CLIENT_SECRET=your_client_secret
     ```

     </details>

### Environment Variables

Copy `.env.example` located in the `apps/web` folder to `.env` in the same folder and configure the following variables:

```env
# Auth
BETTER_AUTH_SECRET=     # Required: Secret key for authentication

# Google OAuth (Required for Gmail integration)
GOOGLE_CLIENT_ID=       # Required for Gmail integration
GOOGLE_CLIENT_SECRET=   # Required for Gmail integration

# GitHub OAuth (Optional)
GITHUB_CLIENT_ID=       # Optional: For GitHub authentication
GITHUB_CLIENT_SECRET=   # Optional: For GitHub authentication

# Database
DATABASE_URL=           # Required: PostgreSQL connection string for backend connection

# Redis
REDIS_URL=              # Redis URL for caching (http://localhost:8079 for local dev)
REDIS_TOKEN=            # Redis token (upstash-local-token for local dev)
```

```env
DATABASE_URL=          # Required: PostgreSQL connection string for migrations
```

For local development a connection string example is provided in the `.env.example` file located in the same folder as the database.

### Database Setup

1. **Database Commands**

   - **Set up database tables**:

     ```bash
     pnpm run db:push
     ```

   - **Create migration files** (after schema changes):

     ```bash
     pnpm run db:generate
     ```

   - **Apply migrations**:

     ```bash
     pnpm run db:migrate
     ```

   - **View database content**:
     ```bash
     pnpm run db:studio
     ```

## Contribute

Please refer to the [contributing guide](.github/CONTRIBUTING.md).

If you'd like to help with translating Zero to other languages, check out our [translation guide](.github/TRANSLATION.md).

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=iboughtbed/ai-podcast&type=Timeline)](https://star-history.com/#iboughtbed/ai-podcast&Timeline)

## This project wouldn't be possible without these awesome companies

<div style="display: flex; justify-content: center;">
  <a href="https://vercel.com" style="text-decoration: none;">
    <img src="public/vercel.png" alt="Vercel" width="96"/>
  </a>
  <a href="https://better-auth.com" style="text-decoration: none;">
    <img src="public/better-auth.png" alt="Better Auth" width="96"/>
  </a>
  <a href="https://orm.drizzle.team" style="text-decoration: none;">
    <img src="public/drizzle-orm.png" alt="Drizzle ORM" width="96"/>
  </a>
  <a href="https://coderabbit.com" style="text-decoration: none;">
    <img src="public/coderabbit.png" alt="Coderabbit AI" width="96"/>
  </a>
</div>

## 🤍 The team

Hey, my name is Sanzhar. I am a young software engineer from Kazakhstan. I am an alumni of nFactorial Incubator - largest incubator in Central Asia. I have contributed to YCombinator startups, directly worked with alumnis of YCombinator 2024 Batches. I have been nominated for "Prodigy of The Year" on nFactorial Incubator, where I created Parallax.
