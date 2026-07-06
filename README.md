# Job Tracker — Netlify deploy

A shared job-status board. Anyone with the link can view it; only whoever
sets the edit passcode can add, change, or delete jobs. Data is stored in
**Netlify Blobs** (Netlify's built-in key-value store), so it's shared
across everyone who opens the site — no external database needed.

## Deploy (recommended: GitHub + Netlify)

Netlify needs to run `npm install` and bundle the two functions in
`netlify/functions`, so drag-and-drop deploy (which only uploads static
files) won't include those. Use a Git repo instead:

1. Push this whole folder to a new GitHub repository.
2. In Netlify: **Add new site → Import an existing project → GitHub** →
   pick the repo.
3. Leave build settings as-is — `netlify.toml` already tells Netlify:
   - publish folder: `public`
   - functions folder: `netlify/functions`
4. Click **Deploy**. Netlify installs `@netlify/blobs` automatically and
   provisions the blob store — no extra setup, no API keys to add.

## Deploy via Netlify CLI (no GitHub needed)

```bash
npm install -g netlify-cli
cd job-tracker-netlify
npm install
netlify deploy --prod
```

Follow the prompts to create/link a site. This uploads both the static
site and the functions in one go.

## After it's live

- Open the site → click **Become editor** → set a passcode. That's the
  only thing that unlocks editing (adding jobs, changing fields, deleting).
- Share the plain URL with your team for view access. Share the passcode
  only with people who should be able to edit.
- Deleting a job asks for the passcode again as a safety check, even if
  you're already unlocked.

## Notes & limits

- Photos are stored as embedded images inside the job data (not separate
  files). Keep them modest in size — very large or many photos per job
  will slow things down. 4MB per photo is enforced client-side.
- The passcode is stored as a one-way hash, never in plain text — but this
  is a lightweight shared-passcode lock, not full user authentication.
- If you ever need to reset the passcode without knowing the old one,
  you'd need to clear the `passcode-hash` key in the Netlify Blobs store
  (Netlify dashboard → your site → Blobs).
