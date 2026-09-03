# KWI Examination System — Frontend

Vanilla HTML/CSS/JS frontend for the KWI Examination System. No frameworks,
no build step — open it in a browser or serve it with any static server.

## 1. Where this goes on your machine

Unzip this folder anywhere you like, e.g.:

```
Desktop/kwi-examination-frontend/
```

Keep the folder structure exactly as it is — the HTML files reference the
CSS/JS with relative paths (`../../css/...`, `../../js/...`), so moving a
single page out of `pages/student/` or `pages/admin/` will break it.

## 2. Point it at your backend

Open `js/config.js` and set your API URL:

```js
const API_BASE_URL = "http://localhost:5000/api";
```

That's the ONLY place the base URL is hardcoded. When you deploy, change
this one line to your production URL.

## 3. Run it locally

Because this uses `fetch()` and ES6 modules-adjacent code, open it through a
local server rather than double-clicking the HTML file (double-clicking
uses `file://` which some browsers block for fetch/CORS reasons).

Easiest options:

**VS Code** — install the "Live Server" extension, right-click
`index.html` → "Open with Live Server".

**Node.js** (if installed):
```bash
npx serve .
```

**Python** (if installed):
```bash
python3 -m http.server 5500
```

Then visit `http://localhost:5500` (or whatever port it prints).

Make sure your backend (Node/Express) is also running, with CORS enabled
for whatever origin you're serving the frontend from.

## 4. What's fully working right now

These call the real backend and will work as soon as your API is running:

- Student registration — `pages/student/register.html`
- Registration success (reads the real reg. number from the API response)
- Student login — `pages/student/login.html`
- Student dashboard — `GET /api/students/me`
- Student "My Courses" — reads enrollments from `/students/me`
- Admin login — `pages/admin/login.html`
- Admin course management (list/create/edit/activate/deactivate/delete) —
  fully wired to `GET/POST/PATCH/DELETE /api/courses`

## 5. What's built but waiting on backend endpoints

Every screen the spec marked "pending" is fully built — HTML structure, CSS,
and JS — but shows a yellow **"Waiting on the backend"** notice and either
uses sample data or has its submit button disabled, instead of pretending
to work or inventing endpoints that don't exist:

- Student: exam list, exam instructions, exam-taking screen (timer/nav are
  real and working, only the data + save/submit calls are stubbed),
  exam result, transcript
- Admin: dashboard stats, students, student details, exams, exam form,
  questions, results, leaderboard, transcripts, reports, settings

Each of those JS files has the exact planned endpoint written in a comment
at the top, plus a commented-out fetch call ready to uncomment once the
backend developer ships it. `js/admin/courses.js` is the best reference for
the pattern to copy (fetch → render table → wire up action buttons).

## 6. Two small additions beyond the original file list

To avoid hand-copying the sidebar/navbar markup into all 24 pages, I added:

- `js/admin/_layout.js` — renders the admin sidebar + topbar into
  `<aside id="sidebar-root">` / `<header id="topbar-root">`
- `js/student/_layout.js` — renders the student navbar into
  `<header id="navbar-root">`

Every page already calls these — you don't need to do anything, just know
they're there if you go looking for the sidebar HTML and can't find it in
the page source.

## 7. Folder structure

```
kwi-examination-frontend/
├── index.html                  (student/admin chooser)
├── pages/student/               (10 pages)
├── pages/admin/                 (14 pages)
├── css/                         (8 files — tokens, components, forms, etc.)
├── js/                          (config, api, auth, utils, notifications
│                                  + js/student/, js/admin/)
└── assets/images|icons|logos/   (empty — drop your files in)
```
