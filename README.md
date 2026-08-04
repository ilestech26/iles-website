# ILES — Integrity Lifting & Engineering Solutions | Website

A static, responsive marketing site for ILES: crane rental, rigging, structural steel
erection, load testing, preventive maintenance, inspection, NDT testing, training and
renewable energy services.

Built with plain **HTML5**, **Tailwind CSS** (CDN build, no compile step required), and
**vanilla JavaScript**. No framework, no build tool, no `node_modules` — it runs by
opening `index.html`, and deploys as-is to GitHub Pages at **zero recurring cost**.

## File structure

Everything sits at the top level in one folder, with **one exception**: a
`services/` folder containing just one file. That folder exists so the address
bar reads `ilesghana.com/services/` instead of `.../services.html` — GitHub Pages
automatically serves a folder's `index.html` when you visit the folder path, no
server configuration needed.

```
iles-website/
├── index.html                    # Landing page
├── services/
│   └── index.html                # Same "Services" page, moved here so the URL
│                                  #   reads /services/ instead of /services.html
├── custom.css                    # Brand tokens, gauge animation, section styling
├── main.js                       # Mobile nav, form validation + Web3Forms submit,
│                                  #   load calculator, testimonials slider, brochure
│                                  #   download, scroll reveal
├── iles-logo.png                 # Logo (header, footer, browser-tab icon)
├── warehouse-overhead-crane.jpg  # Brochure photography
├── worker-spraying.jpg
├── load-testing-dock.jpg
├── inspection-crane-structure.jpg
├── offshore-load-test.jpg
├── industrial-pipes.jpg
├── ndt-device.jpg
├── forklift-warehouse.jpg
├── telehandler-containers.jpg
├── overhead-crane-hoists.jpg
├── scissor-lift.jpg
├── ILES-Company-Brochure.pdf     # Downloadable brochure (linked in nav/footer)
├── CNAME                         # Your custom domain (already set to ilesghana.com)
└── README.md                     # You are here
```

**Why one folder is safe now, when nested folders caused trouble before:** the
earlier problem was *dragging local nested folders into GitHub's upload box*,
which doesn't reliably preserve structure. The fix here uses a different,
reliable method instead — see "Updating the Services page" below.

All internal links and asset paths (`/custom.css`, `/main.js`, `/iles-logo.png`,
etc.) now use a **leading slash**, which resolves correctly from both `/` and
`/services/` because the site lives at your domain's root (`ilesghana.com`).

### Updating the Services page

Because `services/index.html` is the one file that lives inside a folder, edit
it directly on GitHub rather than re-uploading it from your computer:
1. In your repository, click into the `services` folder, then `index.html`.
2. Click the pencil (✏️) icon to edit in the browser, make your change, commit.

If you ever need to recreate this folder from scratch (e.g. starting a fresh
repo), the safest way is **not** drag-and-drop — use **Add file → Create new
file**, and type `services/index.html` directly into the filename box. GitHub
creates the folder for you as part of typing that path, which sidesteps the
drag-and-drop folder problem entirely.

## Running it locally

No build step needed. Either double-click `index.html`, or serve it:
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

# Part 1 — Quote form backend (free, forever, no card)

**Status: already connected.** The quote form is live using your access key
(`info@ilesghana.com` via Web3Forms) — quote requests, including the customer's
own email address so you can reply directly, land in that inbox already. The
steps below are kept for reference in case you ever need to reconnect it (e.g.
a new key, a different destination email).

The "Request a Lift Plan / Quote" form is wired to **[Web3Forms](https://web3forms.com)**
in the code. Why Web3Forms for a startup:

| | Web3Forms Free | Formspree Free |
|---|---|---|
| Cost | $0, no time limit | $0, no time limit |
| Submissions/month | 250 | 50 |
| Credit card required | No | No |
| Account/login required | No — just an email | Yes |
| Forced upgrade prompts | None | Usage-cap emails at 50/75/90% |

Neither service will auto-charge you or lock the site if you stay under the limit —
there's no subscription to accidentally trigger. 250 submissions/month is generous
headroom for a new company site; if you ever outgrow it, it's a one-line change (see
below), not a rebuild.

### Getting a new free access key, if you ever need one

1. Go to **[web3forms.com](https://web3forms.com)**.
2. Enter the email address where you want quote requests delivered and click
   **Create Access Key**.
3. Web3Forms emails you a key that looks like `a1b2c3d4-...`. No password, no
   dashboard login needed for the free tier.
4. Open `index.html`, find this line near the top of the quote form:
   ```html
   <input type="hidden" name="access_key" value="5a131210-293c-429b-ac6b-2591496f0689">
   ```
5. Replace the value with your new key. Save, commit, push — the form is live.

That's the entire setup. `main.js` already does the rest: it validates the fields,
`POST`s them to Web3Forms as JSON, shows the "Request queued" success state, and
falls back to a clear error toast if the network call fails.

### If you outgrow the free tier later

Swap the `access_key` value and the `fetch()` URL in `main.js` for whichever backend
you move to — Web3Forms' paid tiers, Formspree, or a self-hosted endpoint all accept
the same basic `name`/`email`/`fields` POST shape, so the HTML doesn't need to change.

---

# Part 2 — Hosting on GitHub Pages (step by step)

This replaces Vercel entirely: GitHub Pages has no free-tier expiry, no credit card
on file, and no usage-based billing surprise for a low-traffic marketing site.

### Step 1 — Install Git and create a GitHub account
- Install Git: [git-scm.com/downloads](https://git-scm.com/downloads)
- Create a free account at [github.com/join](https://github.com/join) if you don't
  have one.

### Step 2 — Create the repository
1. Go to [github.com/new](https://github.com/new).
2. Repository name: `iles-website` (or whatever you prefer).
3. Set it to **Public** (required for GitHub Pages on a free personal account).
4. Leave "Initialize with a README" **unchecked** — you already have one.
5. Click **Create repository**.

### Step 3 — Get your site onto GitHub

*(Your site is already live, so you likely won't repeat this step — it's kept
here as reference in case you ever rebuild the repository from scratch.)*

**Option A — Drag and drop in the browser (simplest, no installs at all)**
1. On your new repository's page, click **uploading an existing file** (or
   **Add file → Upload files** from the top-right menu).
2. Select every top-level file (every `.html` at the root, `.css`, `.js`,
   `.jpg`, `.png`, `.pdf`, plus `CNAME` and `README.md`) and drag them all into
   the GitHub upload box in one go, then commit.
3. **Separately**, create the one subfolder this project has: use **Add file →
   Create new file**, type `services/index.html` into the filename box (typing
   the slash makes GitHub create the `services` folder for you — no
   drag-and-drop involved), paste in the Services page content, and commit.
   This sidesteps the folder-flattening problem entirely, since nothing is
   dragged from a local nested folder.
4. That's it — the files are live in your repository, ready for Step 4 below.

**Option B — GitHub Desktop (a bit more convenient for future edits)**
1. Install [desktop.github.com](https://desktop.github.com) and sign in.
2. **File → Add Local Repository**, point it at your `iles-website` folder.
   If it says the folder isn't a repository yet, click **create a repository**
   right there.
3. Type a summary (e.g. "Initial commit"), click **Commit to main**, then
   **Publish repository** (keep it public, since Pages requires that on a free
   account). GitHub Desktop preserves the `services/` subfolder correctly,
   since it works from the actual folder on disk rather than a browser drag.

**Option C — Git command line (for anyone already comfortable with a terminal)**
```bash
cd iles-website
git init
git add .
git commit -m "Initial commit: ILES website"
git branch -M main
git remote add origin https://github.com/<your-username>/iles-website.git
git push -u origin main
```

**If something's still missing after uploading:** open your repository on
GitHub.com and check for both the top-level files and the `services` folder
containing `index.html`. If either is incomplete, repeat the relevant part of
Step 3 above — GitHub adds to what's already there, it doesn't require
starting over.

### Step 4 — Turn on GitHub Pages
1. On your repository page, go to **Settings → Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Under **Branch**, select `main` and `/ (root)`, then **Save**.
4. Wait 1–2 minutes. GitHub Pages will publish the site at:
   ```
   https://<your-username>.github.io/iles-website/
   ```
5. Open that link to confirm everything — nav, images, the quote form, the
   brochure download — is working.

### Step 5 — Every future update
Whichever option you used in Step 3, updating later is just as simple:

- **If you used Option A (drag and drop)**: go to the file you want to change in
  your repository, click the pencil (✏️) icon to edit it in the browser, or use
  **Add file → Upload files** again to overwrite it with a new version. Commit the
  change.
- **If you used Option B (GitHub Desktop)**: edit the files locally, then in
  GitHub Desktop you'll see the changes listed — type a summary and click
  **Commit to main**, then **Push origin**.
- **If you used Option C (git CLI)**:
  ```bash
  git add .
  git commit -m "Describe what changed"
  git push
  ```

Either way, GitHub Pages redeploys automatically within a minute or two of any
change. No extra dashboard, no build step, no separate deploy command.

---

# Part 3 — Custom domain (ilesghana.com) + business email, step by step

### Step 1 — Buy the domain
Skip registrars with cheap first-year teaser prices that jump on renewal (GoDaddy is
the worst offender here). For a startup, pick one with **flat, honest pricing**:

- **[Porkbun](https://porkbun.com)** — around $10–11/year flat, same price to
  register, renew, or transfer. Free WHOIS privacy included.
- **[Namecheap](https://namecheap.com)** — similar first-year price, but renewals
  run higher (~$15–19/yr) unless you keep applying coupon codes.

Steps (Porkbun as the example):
1. Go to Porkbun, search `ilesghana.com`.
2. Add it to cart. **Decline** any upsells (email, SSL, "premium DNS" — you won't
   need paid add-ons for what follows).
3. Confirm **WHOIS privacy is included free** before checkout (it is, at Porkbun).
4. Create an account, pay (card or PayPal), and the domain is yours immediately.

### Step 2 — Point the domain at GitHub Pages
1. In your repository, open the `CNAME` file. Easiest way: on GitHub's website,
   click the file, then the pencil (✏️) icon to edit it directly in the browser.
2. Replace its placeholder content with just:
   ```
   ilesghana.com
   ```
3. Click **Commit changes** (browser) — or if you're using GitHub Desktop / git
   CLI, commit and push the change the same way you did in Step 3 of Part 2.
4. At Porkbun, go to your domain → **DNS Records** and add:

   | Type | Host | Answer |
   |------|------|--------|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | `<your-username>.github.io` |

   (These four A-record IPs are GitHub Pages' fixed addresses — they don't change
   per project.)
4. Back on GitHub: **Settings → Pages → Custom domain**, enter `ilesghana.com`,
   save. Wait for the DNS check to pass (can take a few minutes to a few hours),
   then tick **Enforce HTTPS** once it's available — GitHub issues a free SSL
   certificate automatically, no extra cost.

### Step 3 — Free business email on the same domain (Zoho Mail)
Google Workspace starts at real monthly cost per user; for a startup, **Zoho Mail's
Forever Free plan** gives you up to 5 addresses (e.g. `info@ilesghana.com`,
`quotes@ilesghana.com`) at $0, with no card required:

1. Go to [zoho.com/mail](https://www.zoho.com/mail) and sign up for the **Free
   Plan**, using `ilesghana.com` as your domain.
2. Zoho will ask you to **verify domain ownership** — it gives you a TXT record to
   add. Go back to Porkbun's DNS Records page and add it exactly as shown.
3. Once verified, Zoho gives you **MX records** to add — replace the domain's
   default MX records at Porkbun with Zoho's (this is what actually routes
   `@ilesghana.com` mail to Zoho's inbox instead of nowhere).
4. Create your mailboxes (e.g. `info@ilesghana.com`) in the Zoho admin console.
5. Update the access-key delivery email in Web3Forms (Part 1) and the contact
   links in `index.html`/`services/index.html` to use your new address once it's live.

**Worth knowing about Zoho's free plan:** webmail (browser-based inbox) works
immediately at no cost; it doesn't include IMAP/POP for hooking the inbox up to the
Outlook or Apple Mail apps on the free tier — that's a $1/user/month upgrade if you
want it later. For a new site fielding occasional quote requests, the free webmail
inbox is enough to start. Also note Zoho's free tier isn't offered in every region
(EU/US/AU data centres require a paid or trial plan) — it's available for Ghana at
the time of writing, but confirm at signup.

### Total recurring cost with this setup
- **Hosting**: $0 (GitHub Pages)
- **SSL certificate**: $0 (GitHub-issued, auto-renewing)
- **Quote form backend**: $0 (Web3Forms free tier, 250 submissions/month)
- **Business email**: $0 (Zoho Mail Forever Free, up to 5 addresses)
- **Only recurring cost**: the domain itself, ~$10–11/year at Porkbun

## Design notes

- **Color system**: deep navy (`#0F2044`) and safety orange (`#F4801F`) carried over
  directly from the ILES brochure, with a signal red (`#C8202F`) reserved for
  compliance/testing accents.
- **Type system**: Oswald (condensed display headlines), Inter (body copy), and
  IBM Plex Mono (specs, load figures, and other data points) — loaded via Google Fonts.
- **Signature element**: the animated "Safe Working Load" gauge in the hero section,
  referencing the load-chart language lifting engineers use day to day.
- All interactive controls have visible keyboard focus states, and animations respect
  `prefers-reduced-motion`.
- **Floating WhatsApp button**: bottom-left on every page, opens a chat to
  +233 55 846 4980 with a pre-filled greeting. To change the number, search
  `main.js` and both HTML files for `233558464980` and replace it everywhere it
  appears.
- **Testimonials slideshow**: the four quotes on the homepage are placeholders
  (clearly marked in `index.html` with an HTML comment) — swap in real client
  feedback as it comes in. Each quote is a `<blockquote class="testimonial-slide">`;
  add or remove blocks and the dots/autoplay adjust automatically.
