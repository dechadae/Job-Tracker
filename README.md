# Job Tracker — Netlify deployment

A shared job-status tracker with four tabs (Graphic, MarCom Mgr., Digital, Director).
Everyone who opens the site can view all tabs. Editing each tab requires that tab's passcode:

| Tab         | Passcode |
|-------------|----------|
| Graphic     | 1111     |
| MarCom Mgr. | 2222     |
| Digital     | 3333     |
| Director    | 4444     |

Data is stored server-side using **Netlify Blobs** (via a Netlify Function), so it's shared
across everyone who visits the site — not just saved in one person's browser.

## Important: this needs a build step

Because the server-side storage function depends on the `@netlify/blobs` package, Netlify
needs to install that dependency when it deploys. A plain drag-and-drop of just `index.html`
into the Netlify dashboard will NOT work for the server storage (the function will fail to
find `@netlify/blobs`). Use one of the two methods below instead — both are free and take a
few minutes.

### Option A — Netlify CLI (fastest, no GitHub needed)

1. Install the CLI if you don't have it: `npm install -g netlify-cli`
2. Unzip this folder, `cd` into it, then run: `npm install`
3. Run: `netlify deploy --prod`
4. Follow the prompts (log in, create/choose a site). When it asks for the publish directory, use `.`

### Option B — Connect a GitHub repo (recommended for ongoing edits)

1. Push this folder to a new GitHub repository.
2. In the Netlify dashboard: **Add new site → Import an existing project** → pick the repo.
3. Build settings: leave "Build command" blank, set "Publish directory" to `.` (Netlify will
   still install `netlify/functions` dependencies automatically because of `package.json`).
4. Deploy. No environment variables or extra setup needed — Netlify Blobs works automatically
   for any site once Functions are deployed.

## Files

- `index.html` — the app (tabs, table, passcode locks, photo upload)
- `netlify/functions/jobs.js` — serverless function that reads/writes each tab's data to Netlify Blobs
- `netlify.toml` — tells Netlify where the functions live
- `package.json` — declares the `@netlify/blobs` dependency so Netlify can bundle the function

## Notes on the passcode security

These are simple 4-digit codes checked in the browser and again used to confirm deletes —
convenient for a small team, but not strong security. Anyone who knows a tab's code can edit
that tab from any device. If you ever need stronger protection (real logins, per-person
accounts, audit trail), that would mean adding proper authentication — let me know if you'd
like that built out.

## Photo attachments

Uploaded photos are stored as embedded images inside each job's data (capped at 4MB per photo).
Large photo libraries will grow the stored data size — fine for normal use, but if the team
uploads many large images regularly, consider swapping to a dedicated file storage service
later.
