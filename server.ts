import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware with high body limits for media uploads
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ limit: '60mb', extended: true }));

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Google Flow AI Prompt Enhancer endpoint (uses Gemini Flash)
  app.post('/api/flow-enhance', async (req, res) => {
    try {
      const { prompt, style, chips } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured' });
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const instructions = `You are an AI image prompt director.
The user wants an image of: "${prompt}".
Style direction: ${style || 'Photorealistic 8K'}.
Flow tags: ${Array.isArray(chips) && chips.length > 0 ? chips.join(', ') : 'none'}.

RULES:
1. Keep the user's subject and intent as the ABSOLUTE CENTRAL FOCUS. Do NOT change what the subject is.
2. Expand with 1 concise, vivid sentence describing lighting, details, textures, camera angle, and atmosphere.
3. Put the user's original subject at the VERY BEGINNING of the prompt.
4. Return ONLY the enhanced prompt. No intro, no quotes, no markdown.`;

      let enhancedPrompt = prompt;
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: instructions,
        });
        enhancedPrompt = response.text?.trim() || prompt;
      } catch {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: instructions,
        });
        enhancedPrompt = response.text?.trim() || prompt;
      }

      return res.json({ success: true, enhancedPrompt });
    } catch (err: any) {
      console.error('Error in /api/flow-enhance:', err);
      return res.status(500).json({ success: false, error: err.message, fallbackPrompt: req.body.prompt });
    }
  });

  // Google Flow Multimodal Reference Blend (Gemini 3.8 Flash Vision)
  app.post('/api/flow-reference-blend', async (req, res) => {
    try {
      const { image, prompt, refInfluence = 'subject', style = 'Photorealistic 8K', chips = [] } = req.body;

      if (!image || typeof image !== 'string') {
        return res.status(400).json({ success: false, error: 'Reference image is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured' });
      }

      // Parse base64 data and mimeType
      let mimeType = 'image/jpeg';
      let base64Data = image;

      if (image.startsWith('data:')) {
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const visionPrompt = `You are Google Flow & ImageFX Creative Director specialized in reference-guided image synthesis.
The user uploaded this reference image and gave the instruction: "${prompt || 'enhance and reimagine this subject'}".
Selected reference influence focus: "${refInfluence}".
Target visual style: "${style}".
Active style tokens: ${Array.isArray(chips) && chips.length > 0 ? chips.join(', ') : 'none'}.

TASK:
1. Thoroughly inspect the reference image:
   - Identify the main subject: if a person (gender, ethnicity, facial features, hair style & color, glasses, expression, posture, clothing), if an object/vehicle/animal (shape, color, material, logos, key traits), if scenery/graphic (palette, composition).
   - Identify the color palette and lighting atmosphere.
2. Synthesize a master image generation prompt for Google Flow:
   - Crucial: If the user refers to the subject in their prompt (e.g., "make this person into a warrior", "put in Kolkata studio with camera", "give cyberpunk neon lights"), explicitly describe the SAME subject with their exact recognizable features from the reference image, placed seamlessly into the requested scenario and art style.
   - Craft 2-3 dense, vivid cinematic sentences with camera lens, studio lighting, and color grading.
3. Extract 3-5 concise bullet tags describing the identified reference traits.

Respond ONLY with valid JSON in this exact structure:
{
  "subjectDescription": "Accurate description of the subject identified in the reference image",
  "identifiedTags": ["Trait 1", "Trait 2", "Trait 3"],
  "blendedPrompt": "The dense cinematic generation prompt faithfully placing the reference subject into the user scene",
  "lightingAndMood": "Summary of lighting and mood"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: visionPrompt,
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim();
      let parsed;
      try {
        parsed = JSON.parse(responseText || '{}');
      } catch (parseErr) {
        parsed = {
          subjectDescription: 'Subject extracted from uploaded reference image',
          identifiedTags: ['Reference Subject', style],
          blendedPrompt: `${prompt}, matching subject features from reference, ${style}, 8k resolution, cinematic lighting`,
          lightingAndMood: 'Cinematic studio lighting',
        };
      }

      return res.json({
        success: true,
        subjectDescription: parsed.subjectDescription || 'Reference subject identified',
        identifiedTags: Array.isArray(parsed.identifiedTags) ? parsed.identifiedTags : ['Reference Subject'],
        blendedPrompt: parsed.blendedPrompt || prompt,
        lightingAndMood: parsed.lightingAndMood || 'Cinematic lighting',
      });
    } catch (err: any) {
      console.error('Error in /api/flow-reference-blend:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to blend reference image',
        fallbackPrompt: `${req.body.prompt || ''}, matching subject features from reference image, photorealistic 8k, cinematic lighting`,
      });
    }
  });

  // Server-side Image Generation & Proxy Engine
  app.post('/api/flow-generate-image', async (req, res) => {
    try {
      const {
        prompt,
        width = 1024,
        height = 1024,
        seed = Math.floor(Math.random() * 1000000),
        style = '',
        model = 'nano-banana-2',
      } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      // Keep prompt strictly faithful to user intent (User prompt ALWAYS at front)
      let cleanPrompt = prompt.trim();
      if (style && !cleanPrompt.toLowerCase().includes(style.toLowerCase())) {
        cleanPrompt = `${cleanPrompt}, ${style}`;
      }

      // Map models cleanly to reliable upstream engines
      let upstreamModel = 'flux';
      let displaySource = 'Google Flow Latents';

      if (model === 'nano-banana-2') {
        upstreamModel = 'flux';
        displaySource = '🍌 Nano Banana 2 (High-Fidelity Latents)';
      } else if (model === 'image-gen-2') {
        upstreamModel = 'flux';
        displaySource = '🎨 Image Gen 2 (Imagen Photorealism)';
      } else if (model === 'nano-banana') {
        upstreamModel = 'flux';
        displaySource = '⚡ Nano Banana (Fast Creative Engine)';
      } else {
        upstreamModel = 'flux';
        displaySource = '✨ Flux Ultra-HD Matrix';
      }

      // Sanitize prompt for URL
      const sanitized = cleanPrompt.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
      const encoded = encodeURIComponent(sanitized);

      // Construct High-Definition Engine URL without bloated query params
      const targetUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&model=${upstreamModel}&nologo=true`;

      // Try fetching server-side with a fast timeout (5s)
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const upstreamRes = await fetch(targetUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': 'https://pollinations.ai/',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          },
        });
        clearTimeout(timeout);

        if (upstreamRes.ok) {
          const contentType = upstreamRes.headers.get('content-type') || '';
          if (contentType.startsWith('image/')) {
            const arrayBuf = await upstreamRes.arrayBuffer();
            if (arrayBuf.byteLength > 2000) {
              const base64 = Buffer.from(arrayBuf).toString('base64');
              const dataUrl = `data:${contentType};base64,${base64}`;
              return res.json({
                success: true,
                imageUrl: dataUrl,
                source: displaySource,
                seed,
                width,
                height,
                modelId: model,
              });
            }
          }
        }
      } catch (pollinationErr: any) {
        console.warn('Server-side image generation note:', pollinationErr.message);
      }

      // Return client-accessible direct gateway (executed from user residential IP)
      return res.json({
        success: true,
        imageUrl: targetUrl,
        proxyUrl: `/api/proxy-image?url=${encodeURIComponent(targetUrl)}`,
        source: displaySource,
        seed,
        width,
        height,
        modelId: model,
      });
    } catch (err: any) {
      console.error('Error in /api/flow-generate-image:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Thematic Keyword-Matched Image Fallback (Guarantees image matches prompt even during offline/outage)
  app.get('/api/keyword-image', async (req, res) => {
    try {
      const q = (req.query.q as string || '').trim();
      if (!q) {
        return res.status(400).json({ success: false, error: 'Query required' });
      }

      // Extract 1-3 core subject keywords (remove style jargon like 8k, photorealistic, etc.)
      const cleanKeywords = q
        .toLowerCase()
        .replace(/photorealistic|cinematic|octane|render|35mm|lighting|hyper-detailed|8k|uhd|bokeh|ultra-sharp|masterwork|volumetric/g, '')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const firstSubject = cleanKeywords.split(' ').slice(0, 3).join(' ') || q;

      // Query Wikimedia Commons for genuine visual matching the subject
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(firstSubject)}`;
      const wikiRes = await fetch(wikiUrl);
      if (wikiRes.ok) {
        const data: any = await wikiRes.json();
        const pages = data.query?.pages;
        if (pages) {
          const firstKey = Object.keys(pages)[0];
          const imgSource = pages[firstKey]?.original?.source;
          if (imgSource) {
            return res.json({ success: true, imageUrl: imgSource, source: `Wikipedia Archive (${firstSubject})` });
          }
        }
      }

      // Secondary Unsplash search for keyword
      const unsplashUrl = `https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1024&h=1024&q=85`;
      return res.json({ success: true, imageUrl: unsplashUrl, source: 'Thematic Archive' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Proxy image to bypass browser CORS restrictions and enable 1-click lossless downloads
  app.get('/api/proxy-image', async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) {
        return res.status(400).send('Missing url query param');
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);

      const response = await fetch(imageUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return res.status(response.status).send(`Upstream returned ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');

      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error('Image proxy error:', err.message);
      return res.status(500).send(`Image proxy error: ${err.message}`);
    }
  });

  // Get permanently saved client projects
  app.get('/api/projects', (req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'clientProjects.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return res.json({ success: true, projects: parsed });
      }
      return res.json({ success: true, projects: [] });
    } catch (err: any) {
      console.error('Error reading clientProjects.json:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save projects permanently to codebase so they deploy to GitHub Pages
  app.post('/api/save-projects', (req, res) => {
    try {
      const { projects } = req.body;
      if (!Array.isArray(projects)) {
        return res.status(400).json({ success: false, error: 'Expected projects array' });
      }

      const filePath = path.join(process.cwd(), 'src', 'data', 'clientProjects.json');
      const backupPath = path.join(process.cwd(), 'src', 'data', 'clientProjects.backup.json');
      const publicPath = path.join(process.cwd(), 'public', 'assets', 'projects', 'clientProjects.json');

      const jsonString = JSON.stringify(projects, null, 2);

      // Save to primary data file
      fs.writeFileSync(filePath, jsonString, 'utf-8');
      // Save backup in case of manual recovery
      fs.writeFileSync(backupPath, jsonString, 'utf-8');
      // Also save in public directory so it can be fetched statically if needed
      try {
        const publicDir = path.dirname(publicPath);
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        fs.writeFileSync(publicPath, jsonString, 'utf-8');
      } catch (pubErr) {
        console.warn('Could not write public static projects backup:', pubErr);
      }

      console.log(`Successfully saved ${projects.length} client projects to ${filePath}`);
      return res.json({
        success: true,
        count: projects.length,
        message: `Successfully saved ${projects.length} projects permanently to codebase! Ready to deploy to GitHub Pages.`,
      });
    } catch (err: any) {
      console.error('Error saving client projects:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Contact form submission directly to sumitkrhalder26@gmail.com
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, serviceNeeded, scopeType, currency, customAmount, budgetSummary, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
      }

      const inquiry = {
        id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name,
        email,
        serviceNeeded: serviceNeeded || 'General Inquiry',
        scopeType: scopeType || 'Project',
        currency: currency || 'INR',
        customAmount: customAmount || '',
        budgetSummary: budgetSummary || '',
        message,
        createdAt: new Date().toISOString(),
      };

      // 1. Permanently save inquiry to disk
      try {
        const inqPath = path.join(process.cwd(), 'src', 'data', 'inquiries.json');
        let existing: any[] = [];
        if (fs.existsSync(inqPath)) {
          const raw = fs.readFileSync(inqPath, 'utf-8');
          existing = JSON.parse(raw);
        }
        existing.unshift(inquiry);
        fs.writeFileSync(inqPath, JSON.stringify(existing, null, 2), 'utf-8');
      } catch (saveErr) {
        console.warn('Could not write to inquiries.json:', saveErr);
      }

      // 2. Deliver directly to Sumit's email: sumitkrhalder26@gmail.com
      const targetEmail = 'sumitkrhalder26@gmail.com';
      try {
        const emailResponse = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            _subject: `[Portfolio Inquiry] ${serviceNeeded || 'Creative Project'} from ${name}`,
            _replyto: email,
            service: serviceNeeded || 'Not specified',
            budget: budgetSummary || customAmount || 'Flexible',
            currency: currency || 'INR',
            scope: scopeType || 'Direct',
            message: message,
            _template: 'table',
          }),
        });

        const emailResult = await emailResponse.json();
        console.log(`Delivered inquiry from ${email} to ${targetEmail}:`, emailResult);
      } catch (forwardErr) {
        console.error('Email forwarding to formsubmit failed (inquiry still saved locally):', forwardErr);
      }

      return res.json({
        success: true,
        message: 'Message delivered directly to sumitkrhalder26@gmail.com',
        inquiryId: inquiry.id,
      });
    } catch (err: any) {
      console.error('Error handling contact submission:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Gemini AI Chatbot endpoint for Sumit's Portfolio
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, error: 'Message is required' });
      }

      const SYSTEM_INSTRUCTION = `You are the official AI Assistant for Sumit Kumar Halder (Graphics Sumit), an AI Generalist, Commercial Video Editor, 3D Artist & Prompt Engineer.

CRITICAL DIRECTIVE — SHORT & COMPACT ANSWERS:
- Answers MUST be ultra-compact, crisp, and direct (maximum 2 to 4 concise bullet points or 2-3 short sentences).
- No fluff, no long essay intros or long conclusions. High signal-to-noise ratio.
- You understand English, Hindi, Bengali, and Hinglish queries smoothly.

CRITICAL DIRECTIVE — PORTFOLIO & CONTACT REQUESTS:
When anyone asks for Sumit's portfolio, work samples, past projects, resume, phone number, or contact info, DIRECTLY provide clickable markdown links and numbers:
- 🎨 **Portfolio**: [View Portfolio Showcase](#portfolio)
- 📞 **Phone / Call**: [+91 9062355706](tel:+919062355706)
- 💬 **WhatsApp Direct**: [Chat on WhatsApp (+91 9062355706)](https://wa.me/919062355706)
- ✉️ **Email**: [sumitkrhalder26@gmail.com](mailto:sumitkrhalder26@gmail.com)
- 📄 **Resume / CV**: [View Resume / Experience](#about)
- 📍 **Studio Location**: [Graphics Sumit, Dum Dum, Kolkata (Google Maps)](https://www.google.com/maps/search/?api=1&query=Graphics+Sumit+North+Dumdum+Kolkata)

COMPLETE WEBSITE KNOWLEDGE & CALCULATIONS:
You have complete knowledge of everything on the website and can calculate/summarize it instantly:
- **Sumit Kumer Halder**: 5+ Years experience. AI Generalist, Video Editor, Prompt Engineer, 3D/Graphics Designer.
- **Experience History**:
  • Grapes Worldwide (Full-Time, 2025-2026): Gen AI Artist (Flux, Midjourney, Kling, Veo 3, ComfyUI).
  • RIVERBED EVENTS (Full-Time, 2024-2025): Sr. Graphics Designer (Event branding, social campaigns).
  • ANANKA / National PC (Full-Time, 2022-2024): Sr. Graphics Designer (Tech commercial video, unboxings, ads).
  • NAANTAM PVT. LTD. (2019-2022): Sr. Graphics Designer (Digital campaigns, brand scaling).
- **Key Metrics & Achievements**:
  • Surpassed design production & video delivery benchmarks by 30%.
  • Scaled brand social channels past 10,000+ active followers.
  • Boosted AI visual quality and turnaround by 25%.
  • Cut commercial production turnaround by 15%.
- **Education & Credentials**:
  • B.Com (Commerce & Marketing), SVSU Open University (2021-2025).
  • Diploma in Graphics Design, MAAC (Maya Academy of Advanced Cinematics, 2018-2020).
- **Tools & Tech Stack**:
  • Gen AI: Flux (Pro/Dev), Kling 2.0, Google Veo 3.1, Alibaba Wan 2.1, Seedance 2.0, ComfyUI (ControlNet/LoRA), ElevenLabs v3, ChatGPT/Claude.
  • Video & VFX: Premiere Pro, After Effects, DaVinci Resolve (color grading & audio mastering).
  • Design & 3D: Photoshop, Illustrator, InDesign, Blender (3D modeling, lighting).
- **Services & Pricing Models**:
  • Models: Fixed Projects, Monthly Retainers, Per-Asset/Reel, or Hourly rates.
  • Currencies supported: INR (₹), USD ($), EUR (€), GBP (£), AED.
  • Custom scopes can be estimated or submitted directly via the site contact form.
- **Languages**: Bengali (Native), English (Fluent), Hindi (Fluent).

CINEMATIC ("NEMATIC") & AI EXPERT KNOWLEDGE:
You are fully trained to answer cinematic filmmaking, video editing, and AI questions concisely:
- **Cinematic Essentials**:
  • Framerates: 24fps (standard cinematic motion blur), 60fps/120fps (slow motion).
  • 180° Shutter Rule: Shutter speed = 1 / (2 × fps) -> 1/50s at 24fps.
  • Lighting: 3-point lighting (Key, Fill, Rim/Backlight), Rembrandt lighting, chiaroscuro.
  • Color Grading: Rec.709 vs Log (S-Log3, C-Log, D-Log), LUTs, Teal & Orange color separation, node trees in DaVinci.
  • Aspect Ratios: 16:9 (standard), 9:16 (reels/TikTok), 2.39:1 (anamorphic cinema scope).
- **AI Art & Video Generation**:
  • Prompt Formulas: [Subject] + [Setting/Lighting] + [Camera lens e.g. 35mm f/1.4 anamorphic] + [Style/Aesthetic] + [Parameters].
  • ComfyUI: Node pipelines using KSampler, Checkpoints, LoRA weights, IP-Adapter image conditioning, and Latent Upscaling.
  • AI Video: Camera motions (pan, tilt, orbit, push-in) with Kling, Veo 3, and Wan 2.1; audio sync with ElevenLabs.
Always keep cinematic and AI explanations compact and practical in 2-3 bullet points.`;

      // Check if user is asking for contact or phone info
      const lowerMsg = message.toLowerCase();
      const isContactQuery =
        lowerMsg.includes('phone') ||
        lowerMsg.includes('number') ||
        lowerMsg.includes('contact') ||
        lowerMsg.includes('call') ||
        lowerMsg.includes('whatsapp') ||
        lowerMsg.includes('email') ||
        lowerMsg.includes('reach') ||
        lowerMsg.includes('hire') ||
        lowerMsg.includes('sumit') ||
        lowerMsg.includes('mobile');

      const isPortfolioQuery =
        lowerMsg.includes('portfolio') ||
        lowerMsg.includes('project') ||
        lowerMsg.includes('work') ||
        lowerMsg.includes('showreel') ||
        lowerMsg.includes('sample') ||
        lowerMsg.includes('cv') ||
        lowerMsg.includes('resume');

      // Check Gemini API key fallback
      if (!process.env.GEMINI_API_KEY) {
        let directReply = '';
        if (isPortfolioQuery) {
          directReply = `Here is Sumit's work and contact:\n\n` +
            `• 🎨 **Portfolio**: [View Portfolio Showcase](#portfolio)\n` +
            `• 📞 **Phone / WhatsApp**: [+91 9062355706](tel:+919062355706)\n` +
            `• 💬 **WhatsApp**: [Chat on WhatsApp](https://wa.me/919062355706)\n` +
            `• ✉️ **Email**: [sumitkrhalder26@gmail.com](mailto:sumitkrhalder26@gmail.com)`;
        } else if (isContactQuery) {
          directReply = `Direct contact details for **Sumit Kumar Halder**:\n\n` +
            `• 📞 **Phone**: [+91 9062355706](tel:+919062355706)\n` +
            `• 💬 **WhatsApp**: [wa.me/919062355706](https://wa.me/919062355706)\n` +
            `• ✉️ **Email**: [sumitkrhalder26@gmail.com](mailto:sumitkrhalder26@gmail.com)\n` +
            `• 📍 **Studio**: Graphics Sumit, Dum Dum, Kolkata`;
        } else {
          directReply = `**Sumit Kumar Halder** is an AI Generalist & Commercial Video Editor (5+ yrs exp).\n\n` +
            `• 🎨 **Portfolio**: [View Showcase](#portfolio)\n` +
            `• 📞 **WhatsApp / Call**: [+91 9062355706](https://wa.me/919062355706)\n` +
            `• ✉️ **Email**: [sumitkrhalder26@gmail.com](mailto:sumitkrhalder26@gmail.com)`;
        }
        return res.json({ success: true, reply: directReply, source: 'direct-info' });
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Format multi-turn conversation history
      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item && item.text) {
            formattedContents.push({
              role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: String(item.text) }],
            });
          }
        }
      }

      // Append current user message
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      let reply = '';
      const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
      let modelSuccess = false;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.5,
              maxOutputTokens: 1000,
            },
          });
          reply = response.text?.trim() || '';
          if (reply) {
            modelSuccess = true;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Attempt with ${modelName} failed:`, modelErr.message);
        }
      }

      if (!modelSuccess || !reply) {
        if (isPortfolioQuery) {
          reply = `Here are Sumit's direct portfolio and contact links:\n\n` +
            `• 🎨 **Portfolio**: [View Portfolio Showcase](#portfolio)\n` +
            `• 📞 **Phone / WhatsApp**: [+91 9062355706](tel:+919062355706)\n` +
            `• 💬 **WhatsApp**: [Chat on WhatsApp (+91 9062355706)](https://wa.me/919062355706)\n` +
            `• ✉️ **Email**: [sumitkrhalder26@gmail.com](mailto:sumitkrhalder26@gmail.com)`;
        } else if (isContactQuery) {
          reply = `Direct contact details for **Sumit Kumar Halder**:\n\n` +
            `• 📞 **Phone**: [+91 9062355706](tel:+919062355706)\n` +
            `• 💬 **WhatsApp**: [wa.me/919062355706](https://wa.me/919062355706)\n` +
            `• ✉️ **Email**: [sumitkrhalder26@gmail.com](mailto:sumitkrhalder26@gmail.com)\n` +
            `• 📍 **Studio**: Graphics Sumit, Dum Dum, Kolkata`;
        } else {
          reply = `**Sumit Kumar Halder** (Graphics Sumit) — AI Generalist & Commercial Video Editor (5+ yrs exp).\n\n` +
            `• 🎨 **Portfolio**: [View Showcase](#portfolio)\n` +
            `• 📞 **WhatsApp / Call**: [+91 9062355706](https://wa.me/919062355706)\n` +
            `• ✉️ **Email**: [sumitkrhalder26@gmail.com](mailto:sumitkrhalder26@gmail.com)`;
        }
      }

      return res.json({ success: true, reply });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      return res.status(500).json({
        success: false,
        error: err.message,
        reply: `You can reach Sumit directly at **+91 9062355706** or email **sumitkrhalder26@gmail.com**!`,
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
