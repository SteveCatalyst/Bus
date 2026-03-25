# 🚌 York Bus Times

Live bus departure times for Woodthorpe, York. Built with the UK [Bus Open Data Service (BODS)](https://data.bus-data.dft.gov.uk/) and hosted on Netlify.

## Project structure

```
/
├── index.html                   # Frontend
├── netlify/functions/
│   └── departures.js            # Serverless proxy — keeps API key secret
├── netlify.toml                 # Netlify build config
└── .gitignore
```

## Deploy to Netlify

### 1. Connect your repo

1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Click **Add new site → Import an existing project**
3. Choose **GitHub** and select the `Bus` repo
4. Leave all build settings as default and click **Deploy site**

Your site will be live in about 30 seconds.

### 2. Get a free BODS API key

1. Register at [data.bus-data.dft.gov.uk](https://data.bus-data.dft.gov.uk/)
2. Go to your account → API keys and copy your key

### 3. Add the API key to Netlify

1. In your Netlify site dashboard go to **Site configuration → Environment variables**
2. Click **Add a variable**
3. Key: `BODS_API_KEY`
4. Value: your API key from step 2
5. Click **Save** — Netlify will redeploy automatically

The app will now show real live departure times instead of demo data.

## Local development

You'll need the [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```bash
npm install -g netlify-cli
netlify dev
```

Create a `.env` file (never commit this):

```
BODS_API_KEY=your_key_here
```

Then open [http://localhost:8888](http://localhost:8888).
