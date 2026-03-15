# 🚀 Sadasyata RU — Deployment Guide
Complete step-by-step guide for deploying ru.sadasyata.in

---

## STEP 1: Install Node.js on your computer

1. Go to https://nodejs.org
2. Download the **LTS** version (green button)
3. Install it (click Next → Next → Finish)
4. To verify: open Terminal (Mac) or Command Prompt (Windows) and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x`

---

## STEP 2: Get the project files

If Claude gave you a ZIP file, extract it to a folder on your desktop called `sadasyata-ru`.

Or if you're using a code editor, open the `sadasyata-ru` folder.

---

## STEP 3: Install dependencies

Open Terminal / Command Prompt, navigate to your project folder:

```bash
cd path/to/sadasyata-ru
npm install
```

Wait for it to finish (1-2 minutes).

---

## STEP 4: Add your API key

1. In the project folder, find the file `.env.example`
2. **Copy** it and rename the copy to `.env.local`
3. Open `.env.local` and fill in:

```
DIGISELLER_SELLER_ID=1371985
DIGISELLER_API_KEY=<your key from https://my.digiseller.com/inside/api_keys.asp>
NEXT_PUBLIC_SITE_URL=https://ru.sadasyata.in
```

**Where to find your Digiseller API key:**
- Log in to digiseller.com
- Go to: Profile → API Keys (https://my.digiseller.com/inside/api_keys.asp)
- Click "Create new key"
- Copy it into `.env.local`

---

## STEP 5: Test locally

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see your store! If products don't load yet, check your API key.

---

## STEP 6: Deploy to Vercel (free hosting)

### 6a. Create a GitHub account (if you don't have one)
Go to https://github.com and sign up for free.

### 6b. Upload your code to GitHub
1. Go to https://github.com/new
2. Create a new repository called `sadasyata-ru`
3. Set it to **Private**
4. Follow GitHub's instructions to push your code

Or use GitHub Desktop app (easier for non-coders):
- Download: https://desktop.github.com
- Sign in → File → Add Local Repository → select your `sadasyata-ru` folder
- Click "Publish Repository" → make it Private → Publish

### 6c. Deploy on Vercel
1. Go to https://vercel.com and sign up with your GitHub account
2. Click **"Add New Project"**
3. Import your `sadasyata-ru` repository
4. Vercel auto-detects Next.js ✓
5. **Before clicking Deploy**, click **"Environment Variables"** and add:
   ```
   DIGISELLER_SELLER_ID = 1371985
   DIGISELLER_API_KEY = your_actual_api_key
   NEXT_PUBLIC_SITE_URL = https://ru.sadasyata.in
   ```
6. Click **Deploy** and wait ~2 minutes
7. Vercel gives you a URL like `sadasyata-ru.vercel.app` — your store is live!

---

## STEP 7: Connect your subdomain ru.sadasyata.in

### In Vercel:
1. Go to your project → Settings → Domains
2. Click "Add Domain"
3. Type: `ru.sadasyata.in`
4. Vercel will show you DNS records to add

### In your domain registrar (where sadasyata.in is registered):
1. Log in to your domain registrar
2. Go to DNS settings for `sadasyata.in`
3. Add a **CNAME record**:
   - Name/Host: `ru`
   - Value/Target: `cname.vercel-dns.com`
4. Save. DNS takes 5-30 minutes to propagate.

After propagation, https://ru.sadasyata.in will serve your store with automatic SSL (HTTPS).

---

## STEP 8: Set up Google Analytics (optional but recommended)

1. Go to https://analytics.google.com
2. Create a new property → Web → enter `ru.sadasyata.in`
3. Copy your **Measurement ID** (looks like `G-XXXXXXXXXX`)
4. In Vercel → Settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
   ```
5. Redeploy (Vercel → Deployments → Redeploy)

---

## STEP 9: Set up Yandex Metrica (important for Russian traffic)

1. Go to https://metrika.yandex.ru
2. Create a new counter → enter `ru.sadasyata.in`
3. Copy your **Counter ID** (8-digit number)
4. In Vercel → Settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_YM_ID = 12345678
   ```
5. Redeploy

---

## STEP 10: Add to Google Search Console

1. Go to https://search.google.com/search-console
2. Add property → URL prefix → `https://ru.sadasyata.in`
3. Verify ownership (Vercel method or HTML tag)
4. Submit your sitemap: `https://ru.sadasyata.in/sitemap.xml`

---

## Updating products

You don't need to do anything! Products are pulled live from your Digiseller account.
Whenever you add/edit/remove a product on Digiseller, it automatically reflects on the store within 5 minutes (caching window).

---

## Making changes to the store

If you want to change text, colors, or layout:
1. Edit the relevant file in `src/`
2. Commit to GitHub (via GitHub Desktop: write a message → Commit → Push)
3. Vercel automatically redeploys within 1-2 minutes

---

## Troubleshooting

**Products not showing?**
→ Check your API key in Vercel environment variables
→ Make sure the API key has "read" permissions in Digiseller

**Domain not working?**
→ DNS can take up to 24 hours. Check propagation at https://dnschecker.org

**Build failing on Vercel?**
→ Check the error log in Vercel → Deployments
→ Most common cause: missing environment variable

---

## Support

For store issues: edit the code and redeploy
For payment/delivery issues: handle in your Digiseller dashboard
For domain issues: contact your domain registrar
