# EduBuddy

**Learn anything. Understand everything.** EduBuddy is a responsive AI-powered learning companion for Classes 1–12. It includes onboarding, a student dashboard, Buddy chat, topic explanations and notes, interactive MCQ practice, a study planner, flashcards, progress tracking and profile settings.

## Stack

- React 18 + TypeScript + Vite
- Express API server (keeps AI credentials server-side)
- Local browser storage for the MVP student profile and learning activity
- OpenAI-compatible Chat Completions API (optional)

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open <http://localhost:5173>. The frontend proxies `/api` to the Express server on port 3001.

### Enable live AI

Add your provider key to `.env` on the server only:

```env
OPENAI_API_KEY=your_secret_key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
```

Restart the server. The app checks `/api/health` and displays whether live AI or demo mode is active. **Never put the API key in a `VITE_` variable or frontend source.** Without a key, the product remains usable with clearly labelled demo responses; demo outputs are not real AI generations.

## Production build and run

```bash
npm run build
NODE_ENV=production npm start
```

The Express server serves the compiled Vite app and `/api` endpoints on `PORT` (default 3001).

## Deploy on Render

1. Push this folder to a Git repository.
2. In Render, create a **Web Service** from the repository.
3. Runtime: Node. Build command: `npm install && npm run build`. Start command: `npm start`.
4. Add environment variables in Render's dashboard: `NODE_ENV=production`, `OPENAI_API_KEY`, and optionally `OPENAI_MODEL` / `OPENAI_BASE_URL`.
5. Deploy. Check `/api/health` on the deployed host; `ok: true` confirms the API server is responding. The `aiConfigured` field indicates whether a live provider key is configured.

A `render.yaml` is included for Blueprint-based deployment.

## Data and privacy notes

- Student profile, quiz results, study tasks, explored topics, flashcards and theme are stored in the browser's `localStorage` on the current device/browser.
- There is no user account, cloud sync, server-side student database or cross-device backup in this MVP. Clearing browser site data removes locally stored learning data.
- Chat history currently stays in the active Buddy page session and is not uploaded as a stored profile history. Messages are sent to the configured AI provider when live AI is enabled.
- Do not collect sensitive information from students. For a public launch serving minors, add appropriate parental/guardian consent, privacy disclosures, age-appropriate safeguards, abuse monitoring, rate limits, authentication and a compliant data-retention policy before production use.
- Curriculum examples and AI-generated learning material are not verified textbook coverage. Students should check important information against their teacher or official learning material.

## API

- `GET /api/health` — server and AI configuration status.
- `POST /api/ai` — server-side AI task endpoint. Supported tasks: `chat`, `explain`, `notes`, `quiz`, `plan`, `flashcards`.

## MVP limitations

- Local-only persistence; no login, database or multi-device sync.
- No file/PDF upload, image homework analysis, voice tutor or verified board-wise textbook database.
- AI provider access, usage costs, rate limits and availability depend on the credentials and account configured by the deployer.
# EduBuddy
