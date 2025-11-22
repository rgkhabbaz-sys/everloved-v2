# Deploying EverLoved

This application is built with Next.js and is ready to be deployed to Vercel.

## Prerequisites

1.  **GitHub Account**: Ensure your code is pushed to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **API Keys**: You will need your `OPENAI_API_KEY` and `ELEVENLABS_API_KEY`.

## Deployment Steps

1.  **Import Project**:
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Select your GitHub repository (`Antigravity Everloved`).

2.  **Configure Project**:
    - **Framework Preset**: Next.js (should be auto-detected).
    - **Root Directory**: `./` (default).

3.  **Environment Variables**:
    - Expand the **"Environment Variables"** section.
    - Add the following keys (copy values from your `.env.local` or secure storage):
        - `OPENAI_API_KEY`
        - `ELEVENLABS_API_KEY`
        - `ELEVENLABS_VOICE_ID` (Optional, defaults to 'Rachel')

4.  **Deploy**:
    - Click **"Deploy"**.
    - Wait for the build to complete.

## Post-Deployment

- Your app will be live at `https://your-project-name.vercel.app`.
- Test the **Voice Session** (requires microphone permission).
- Test the **Caregiver Profile** creation (uses local storage, so data is per-device).

## Troubleshooting

- **Voice not working?** Check browser permissions and ensure the API keys are correct in Vercel settings.
- **Microphone error?** Ensure the site is served over HTTPS (Vercel does this automatically).
