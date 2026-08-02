# ILES — Integrity Lifting & Engineering Solutions | Website

A static, responsive marketing site for ILES: crane rental, rigging, structural steel
erection, load testing, preventive maintenance, inspection, NDT testing, training and
renewable energy services.

Built with plain **HTML5**, **Tailwind CSS** (CDN build, no compile step required), and
**vanilla JavaScript**. No framework, no build tool, no `node_modules` — it runs by
opening `index.html`, and deploys as-is to GitHub Pages at **zero recurring cost**.

## File structure

```
iles-website/
├── index.html                # Landing page — hero, about, services overview,
│                              #   safety banner, fleet table, calculator + quote form
├── services.html              # Detailed service specs (all 8 service lines)
├── assets/
│   ├── css/custom.css         # Brand tokens, gauge animation, section styling
│   ├── js/main.js             # Mobile nav, form validation + Web3Forms submit,
│   │                          #   load calculator, brochure download, scroll reveal
│   ├── img/                   # Logo + brochure photography
│   └── brochure/
│       └── ILES-Company-Brochure.pdf   # Downloadable brochure (linked in nav/footer)
├── CNAME                      # Your custom domain goes here (see Part 2 below)
└── README.md                  # You are here
```

## Running it locally

No build step needed. Either double-click `index.html`, or serve it:
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

# Part 1 — Quote form backend (free, forever, no card)

The "Request a Lift Plan / Quote" form is already wired to **[Web3Forms](https://web3forms.com)**
in the code — you only need to drop in your own access key. Why Web3Forms for a
startup:

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

### Getting your free access key (2 minutes)

1. Go to **[web3forms.com](https://web3forms.com)**.
2. Enter the email address where you want quote requests delivered (e.g.
   `info@ilesghana.com` once your domain email is live — see Part 3) and click
   **Create Access Key**.
3. Web3Forms emails you a key that looks like `a1b2c3d4-...`. No password, no
   dashboard login needed for the free tier.
4. Open `index.html`, find this line near the top of the quote form:
   ```html
   <input type="hidden" name="access_key" value="YOUR-WEB3FORMS-ACCESS-KEY">
   ```
5. Replace `YOUR-WEB3FORMS-ACCESS-KEY` with the key from your email. Save, commit,
   push — the form is live.

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

You don't need to touch a terminal to do this. Pick whichever feels easiest:

**Option A — Drag and drop in the browser (simplest, no installs at all)**
1. On your new repository's page, click **uploading an existing file** (or
   **Add file → Upload files** from the top-right menu).
2. Open the `iles-website` folder on your computer in a separate window, select
   *everything inside it* (`index.html`, `services.html`, the `assets` folder,
   `CNAME`, `README.md`) and drag it all into the GitHub upload box.
   - Important: drag the **contents** of the folder, not the folder itself —
     `index.html` needs to sit at the top level of the repository, not inside an
     `iles-website/iles-website/` subfolder.
3. Scroll down, add a commit message like "Initial upload", and click
   **Commit changes**.
4. That's it — the files are live in your repository, ready for Step 4 below.

**Option B — GitHub Desktop (a bit more convenient for future edits)**
1. Install [desktop.github.com](https://desktop.github.com) and sign in.
2. **File → Add Local Repository**, point it at your `iles-website` folder.
   If it says the folder isn't a repository yet, click **create a repository**
   right there.
3. Type a summary (e.g. "Initial commit"), click **Commit to main**, then
   **Publish repository** (keep it public, since Pages requires that on a free
   account).

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
   links in `index.html`/`services.html` to use your new address once it's live.

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
