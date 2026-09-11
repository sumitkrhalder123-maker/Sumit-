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
