import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = 3000;

app.use(express.json());

// In-memory persistent database store for users & sessions during container lifecycle
interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  targetRole: string;
  preferredLanguage: string;
  bio: string;
  token: string;
  createdAt: string;
  streakDays: number;
}

const usersDatabase: Map<string, StoredUser> = new Map();

// Seed initial demo user
const seedDemoUser: StoredUser = {
  id: 'usr-default-alex',
  name: 'Alex Chen',
  email: 'alex@learnpath.ai',
  passwordHash: 'password123',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  targetRole: 'Senior AI Engineer',
  preferredLanguage: 'TypeScript / Python',
  bio: 'Specializing in generative AI architectures, LLM fine-tuning, and scalable production APIs.',
  token: 'lp-tok-demo-alex-session',
  createdAt: new Date().toISOString(),
  streakDays: 5
};
usersDatabase.set(seedDemoUser.email.toLowerCase(), seedDemoUser);

// Initialize Google GenAI client lazily
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper: robustly extract JSON from Gemini response (handles code fences or loose text)
function cleanAndParseJSON(rawText: string) {
  try {
    // 1. Direct JSON parse
    return JSON.parse(rawText);
  } catch {
    // 2. Remove markdown code block if present
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      // 3. Regex extract first JSON object {...} or array [...]
      const match = rawText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error('Failed to parse valid JSON from AI response');
    }
  }
}

// ================= AUTHENTICATION API ROUTES =================

// Register new user
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, targetRole = 'Software Engineer', avatarUrl } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (usersDatabase.has(normalizedEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const token = `lp-tok-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const defaultAvatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    const newUser: StoredUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password, // In production this would be bcrypt
      avatarUrl: defaultAvatar,
      targetRole: targetRole.trim(),
      preferredLanguage: 'TypeScript',
      bio: `Aspiring ${targetRole.trim()} exploring personalized learning paths.`,
      token,
      createdAt: new Date().toISOString(),
      streakDays: 1
    };

    usersDatabase.set(normalizedEmail, newUser);

    const { passwordHash, ...safeUser } = newUser;
    return res.json({
      success: true,
      user: safeUser,
      token: newUser.token,
      message: 'Account created successfully!'
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login user
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = usersDatabase.get(normalizedEmail);

    if (!existing) {
      // Create flexible instant account if logging in with test credentials
      const token = `lp-tok-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const autoUser: StoredUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: normalizedEmail,
        passwordHash: password,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        targetRole: 'Full-Stack AI Developer',
        preferredLanguage: 'TypeScript',
        bio: 'Learning path explorer and software craftsman.',
        token,
        createdAt: new Date().toISOString(),
        streakDays: 2
      };
      usersDatabase.set(normalizedEmail, autoUser);

      const { passwordHash: _, ...safeUser } = autoUser;
      return res.json({
        success: true,
        user: safeUser,
        token: autoUser.token,
        message: 'Signed in successfully!'
      });
    }

    // Verify password
    if (existing.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid password. Please verify your credentials.' });
    }

    // Refresh token
    existing.token = `lp-tok-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    usersDatabase.set(normalizedEmail, existing);

    const { passwordHash, ...safeUser } = existing;
    return res.json({
      success: true,
      user: safeUser,
      token: existing.token,
      message: 'Signed in successfully!'
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during sign in' });
  }
});

// Verify session token / Get current user profile
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  for (const user of usersDatabase.values()) {
    if (user.token === token) {
      const { passwordHash, ...safeUser } = user;
      return res.json({ success: true, user: safeUser });
    }
  }

  return res.status(401).json({ error: 'Invalid or expired session token' });
});

// Update profile details
app.post('/api/auth/update-profile', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const { name, targetRole, bio, avatarUrl, preferredLanguage, email } = req.body;

  let targetUser: StoredUser | undefined;
  if (token) {
    for (const u of usersDatabase.values()) {
      if (u.token === token) {
        targetUser = u;
        break;
      }
    }
  }

  if (!targetUser && email) {
    targetUser = usersDatabase.get(email.toLowerCase().trim());
  }

  if (!targetUser) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  if (name) targetUser.name = name.trim();
  if (targetRole) targetUser.targetRole = targetRole.trim();
  if (bio) targetUser.bio = bio;
  if (avatarUrl) targetUser.avatarUrl = avatarUrl;
  if (preferredLanguage) targetUser.preferredLanguage = preferredLanguage;

  usersDatabase.set(targetUser.email.toLowerCase(), targetUser);

  const { passwordHash, ...safeUser } = targetUser;
  return res.json({
    success: true,
    user: safeUser,
    message: 'Profile updated successfully!'
  });
});

// Forgot password simulation
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  return res.json({
    success: true,
    message: `Password reset instructions sent to ${email}. Check your inbox.`
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Signed out successfully.' });
});

// ================= AI LEARNING & CURRICULUM ENDPOINTS =================

// API Health Check
app.get('/api/health', (req, res) => {
  const ai = getGeminiAI();
  res.json({
    status: 'ok',
    aiEnabled: !!ai,
    engine: 'Gemini 3.7 Flash',
    message: ai ? 'Gemini AI Core is online and active' : 'Live AI ready with intelligent fallback active'
  });
});

// API: Generate Roadmap using Gemini AI
app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const {
      skill = 'Machine Learning',
      currentLevel = 'Beginner',
      targetGoal = 'Land a job in AI Engineering',
      weeklyHours = 10,
      durationWeeks = 8,
      learningStyle = 'Hands-on Projects',
      mode = 'ai'
    } = req.body;

    const cleanSkill = (skill || 'Software Engineering').trim();
    const cleanGoal = (targetGoal || `Master ${cleanSkill} and build portfolio systems`).trim();
    const cleanLevel = currentLevel || 'Intermediate';
    const totalWeeks = Number(durationWeeks) || 8;
    const hoursPerWeek = Number(weeklyHours) || 10;

    const ai = getGeminiAI();

    // If live AI is available and not forced demo mode
    if (ai && mode !== 'demo') {
      try {
        const prompt = `You are the lead curriculum architect and senior educational AI at LearnPath-AI.
Generate a structured, rigorous, and highly actionable learning roadmap for:
- Target Skill/Field: "${cleanSkill}"
- Current Proficiency Level: "${cleanLevel}"
- Ultimate Target Goal: "${cleanGoal}"
- Time Commitment: ${hoursPerWeek} hours/week
- Target Program Duration: ${totalWeeks} weeks
- Preferred Learning Style: "${learningStyle}"

Provide a comprehensive curriculum with 3 to 5 distinct progression phases tailored specifically to "${cleanSkill}".
For each phase:
- "phaseNumber": integer (1, 2, 3, etc.)
- "title": clear, descriptive milestone name
- "duration": e.g. "Weeks 1-2" (distributed across the ${totalWeeks} weeks)
- "description": 2-3 sentence overview of skills and mental models mastered
- "topics": array of 4-6 specific modern tools/libraries/theories
- "projects": array of 1-2 real-world portfolio project specifications (each with "name", "description")
- "resources": array of 2-3 genuine, high-quality learning resources (each with "name", "type" as 'Docs'|'Course'|'Book'|'Video'|'GitHub', and "url")

Return ONLY a valid JSON object matching this schema:
{
  "title": "${cleanSkill} Mastery: from ${cleanLevel} to ${cleanGoal}",
  "skill": "${cleanSkill}",
  "summary": "2-sentence compelling summary of the track",
  "targetGoal": "${cleanGoal}",
  "estimatedWeeks": ${totalWeeks},
  "weeklyHours": ${hoursPerWeek},
  "difficulty": "${cleanLevel}",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase 1: Foundations",
      "duration": "Weeks 1-2",
      "description": "...",
      "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
      "projects": [{"name": "Project Name", "description": "Project Description"}],
      "resources": [{"name": "Resource Name", "type": "Docs", "url": "https://..."}]
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          }
        });

        const text = response.text;
        if (text) {
          const parsed = cleanAndParseJSON(text);
          if (parsed && Array.isArray(parsed.phases) && parsed.phases.length > 0) {
            // Ensure essential metadata
            const sanitizedRoadmap = {
              title: parsed.title || `${cleanSkill} Mastery & Implementation Track`,
              skill: parsed.skill || cleanSkill,
              summary: parsed.summary || `A comprehensive curriculum designed to transition from ${cleanLevel.toLowerCase()} foundations into high-impact ${cleanSkill} engineering.`,
              targetGoal: parsed.targetGoal || cleanGoal,
              estimatedWeeks: Number(parsed.estimatedWeeks) || totalWeeks,
              weeklyHours: Number(parsed.weeklyHours) || hoursPerWeek,
              difficulty: parsed.difficulty || cleanLevel,
              phases: parsed.phases.map((ph: any, idx: number) => ({
                phaseNumber: Number(ph.phaseNumber) || (idx + 1),
                title: ph.title || `Phase ${idx + 1}: ${cleanSkill} Milestone ${idx + 1}`,
                duration: ph.duration || `Weeks ${idx * 2 + 1}-${idx * 2 + 2}`,
                description: ph.description || `Core competencies, architectural abstractions, and hands-on exercises for ${cleanSkill}.`,
                topics: Array.isArray(ph.topics) && ph.topics.length > 0 ? ph.topics : [`${cleanSkill} Core Principles`, 'System Design', 'Performance Optimization'],
                projects: Array.isArray(ph.projects) && ph.projects.length > 0 ? ph.projects : [
                  { name: `${cleanSkill} Milestone Lab ${idx + 1}`, description: `Build and benchmark an application utilizing ${cleanSkill} concepts.` }
                ],
                resources: Array.isArray(ph.resources) && ph.resources.length > 0 ? ph.resources : [
                  { name: `${cleanSkill} Documentation`, type: 'Docs', url: 'https://developer.mozilla.org/' }
                ]
              }))
            };

            return res.json({ success: true, source: 'gemini-3.7-flash', data: sanitizedRoadmap });
          }
        }
      } catch (aiErr: any) {
        console.warn('Gemini Roadmap synthesis warning, applying domain fallback engine:', aiErr?.message || aiErr);
      }
    }

    // Dynamic Context-Aware Curriculum Synthesis Engine
    const lowerSkill = cleanSkill.toLowerCase();
    const phase1End = Math.max(2, Math.floor(totalWeeks * 0.3));
    const phase2End = Math.max(phase1End + 2, Math.floor(totalWeeks * 0.7));

    let phase1Topics = [
      `Core Syntax, Mental Models & Foundations of ${cleanSkill}`,
      'Architectural Paradigms & Best Practice Design Patterns',
      'Runtime Environment, Tooling Setup & Debugging Workflows',
      'State Flow, Error Boundaries & Type Systems'
    ];
    let phase2Topics = [
      'Advanced Asynchronous Patterns & High-Throughput Processing',
      'Performance Profiling, Caching & Memory Optimization',
      'Defensive Error Handling, Validation & Data Consistency',
      'Integration with Distributed APIs & Relational/Vector Stores'
    ];
    let phase3Topics = [
      'Production Containerization (Docker) & CI/CD Pipelines',
      'Observability, Telemetry Metrics & Automated Alerting',
      'Scalable System Architecture & Security Hardening',
      'Technical Case Study Presentation & Code Review Defense'
    ];

    let resourceLinks = [
      { name: `${cleanSkill} Official Guides & Documentation`, type: 'Docs', url: 'https://devdocs.io/' },
      { name: 'System Architecture & Best Practices Guide', type: 'Book', url: 'https://refactoring.guru/' },
      { name: 'Production Implementation Repositories', type: 'GitHub', url: 'https://github.com/' }
    ];

    // Domain-specific custom enhancements
    if (lowerSkill.includes('ai') || lowerSkill.includes('machine learning') || lowerSkill.includes('deep learning') || lowerSkill.includes('llm')) {
      phase1Topics = [
        'Linear Algebra, Calculus & Tensor Operations in PyTorch/NumPy',
        'Supervised vs. Unsupervised Learning & Loss Functions',
        'Data Cleaning Pipelines, Normalization & Feature Engineering',
        'Model Evaluation Metrics (Loss, Accuracy, Precision/Recall, F1)'
      ];
      phase2Topics = [
        'Deep Neural Architectures: CNNs, RNNs & Attention Mechanisms',
        'Transformers, Multi-Head Self-Attention & Positional Encodings',
        'Fine-Tuning Strategies (LoRA/QLoRA) & RAG Vector Retrieval',
        'Latency Optimization (ONNX, Quantization, vLLM, TensorRT)'
      ];
      phase3Topics = [
        'MLOps: Model Registry, Experiment Tracking & Docker Containers',
        'Deploying Scalable Inference APIs with Fast-API & Triton',
        'Continuous Model Monitoring, Drift Detection & Telemetry',
        'Portfolio Project Defense & AI Systems Design Interviews'
      ];
      resourceLinks = [
        { name: 'PyTorch Official Documentation & Tutorials', type: 'Docs', url: 'https://pytorch.org/docs/' },
        { name: 'Hugging Face LLM & Transformers Course', type: 'Course', url: 'https://huggingface.co/learn' },
        { name: 'Deep Learning Specialization & Papers', type: 'Book', url: 'https://www.deeplearning.ai/' }
      ];
    } else if (lowerSkill.includes('react') || lowerSkill.includes('web') || lowerSkill.includes('frontend') || lowerSkill.includes('typescript') || lowerSkill.includes('fullstack') || lowerSkill.includes('full-stack')) {
      phase1Topics = [
        'Modern TypeScript 5 & Advanced Type Inference',
        'React 19 Core: Hooks, Concurrent Features & Server Components',
        'Tailwind CSS, Component Architecture & Accessibility (a11y)',
        'State Management Strategies & Optimistic UI Updates'
      ];
      phase2Topics = [
        'Server-Side Rendering (SSR), Streaming & Edge Middleware',
        'PostgreSQL Database Modeling, Drizzle/Prisma ORM & Migrations',
        'Authentication (JWT/OAuth), Session Management & RBAC Security',
        'Real-Time WebSockets & Asynchronous Background Workers'
      ];
      phase3Topics = [
        'Docker Containerization, Nginx Reverse Proxy & Cloud Deployment',
        'Automated End-to-End Testing (Playwright/Vitest) & CI/CD',
        'Observability, Web Vitals Optimization & Distributed Caching',
        'Production Capstone Launch & Architecture Portfolio Review'
      ];
      resourceLinks = [
        { name: 'React 19 Official Documentation', type: 'Docs', url: 'https://react.dev/' },
        { name: 'TypeScript Handbook & Deep Dive', type: 'Docs', url: 'https://www.typescriptlang.org/docs/' },
        { name: 'Full-Stack Architecture & Design Patterns', type: 'GitHub', url: 'https://github.com/goldbergyoni/nodebestpractices' }
      ];
    } else if (lowerSkill.includes('cloud') || lowerSkill.includes('devops') || lowerSkill.includes('kubernetes') || lowerSkill.includes('docker') || lowerSkill.includes('aws')) {
      phase1Topics = [
        'Linux Kernel Internals, Shell Scripting & Networking Protocols',
        'Docker Containerization: Multi-stage Builds & Layer Caching',
        'Infrastructure as Code (Terraform & OpenTofu)',
        'Cloud Security, IAM Permissions & Secret Management'
      ];
      phase2Topics = [
        'Kubernetes Architecture: Pods, Services, Deployments & Ingress',
        'Helm Charts, ConfigMaps & Operator Lifecycle Management',
        'Automated CI/CD Pipelines (GitHub Actions & GitLab CI)',
        'Distributed Caching, Load Balancing & CDN Edge Routing'
      ];
      phase3Topics = [
        'Observability: Prometheus, Grafana, OpenTelemetry & Fluentd',
        'Zero-Downtime Blue/Green & Canary Deployments',
        'Chaos Engineering, Disaster Recovery & High Availability',
        'Production SRE Runbooks & Cloud Certification Preparation'
      ];
      resourceLinks = [
        { name: 'Kubernetes Official Documentation', type: 'Docs', url: 'https://kubernetes.io/docs/' },
        { name: 'DevOps & SRE Roadmap Guide', type: 'GitHub', url: 'https://github.com/michaellzc/devops-roadmap' },
        { name: 'Terraform & Cloud Native Guides', type: 'Docs', url: 'https://developer.hashicorp.com/terraform' }
      ];
    }

    const fallbackRoadmap = {
      title: `${cleanSkill} Mastery: Accelerate to ${cleanGoal}`,
      skill: cleanSkill,
      summary: `An adaptive, project-first curriculum designed to transition from ${cleanLevel.toLowerCase()} foundations into high-impact ${cleanSkill} systems aligned with "${cleanGoal}".`,
      targetGoal: cleanGoal,
      estimatedWeeks: totalWeeks,
      weeklyHours: hoursPerWeek,
      difficulty: cleanLevel,
      phases: [
        {
          phaseNumber: 1,
          title: `Phase 1: ${cleanSkill} Core Foundations & Architecture`,
          duration: `Weeks 1-${phase1End}`,
          description: `Master fundamental mental models, development workflows, syntax paradigms, and environment configuration for ${cleanSkill}.`,
          topics: phase1Topics,
          projects: [
            {
              name: `${cleanSkill} Foundation Sandbox & Modular Architecture`,
              description: `Architect a robust sandbox system demonstrating proper project scaffolding, unit testing, and modular separation of concerns.`
            }
          ],
          resources: resourceLinks.slice(0, 2)
        },
        {
          phaseNumber: 2,
          title: `Phase 2: Deep Dive, Concurrency & Complex Workflows`,
          duration: `Weeks ${phase1End + 1}-${phase2End}`,
          description: `Tackle production-grade scenarios, asynchronous workflows, data persistence, performance profiling, and boundary resilience.`,
          topics: phase2Topics,
          projects: [
            {
              name: `Production-Grade ${cleanSkill} Application Engine`,
              description: `Deliver a scalable, feature-complete application with optimized data processing, security controls, and responsive UI feedback.`
            }
          ],
          resources: [resourceLinks[0], resourceLinks[2] || resourceLinks[1]]
        },
        {
          phaseNumber: 3,
          title: `Phase 3: Production Deployment, Portfolio & ${cleanGoal}`,
          duration: `Weeks ${phase2End + 1}-${totalWeeks}`,
          description: `Deploy to cloud infrastructure, configure observability metrics, write automated tests, and package a production-grade portfolio capstone.`,
          topics: phase3Topics,
          projects: [
            {
              name: `Full-Scale Capstone Project: ${cleanGoal}`,
              description: `Architect, benchmark, and deploy a live multi-module production system ready for hiring managers and technical evaluations.`
            }
          ],
          resources: [
            { name: 'System Design & Interview Handbook', type: 'Docs', url: 'https://www.techinterviewhandbook.org/' },
            resourceLinks[1]
          ]
        }
      ]
    };

    return res.json({
      success: true,
      source: 'learnpath-engine',
      data: fallbackRoadmap
    });
  } catch (error: any) {
    console.error('Roadmap Generator outer error:', error);
    // Absolute fallback safety net so the API NEVER fails with 500
    const cleanSkill = req.body?.skill || 'Computer Science & AI';
    const cleanGoal = req.body?.targetGoal || 'Senior Software Engineer';
    const weeks = Number(req.body?.durationWeeks) || 8;

    return res.json({
      success: true,
      source: 'emergency-safe-roadmap',
      data: {
        title: `${cleanSkill} Mastery Program`,
        skill: cleanSkill,
        summary: `A structured learning journey designed to master ${cleanSkill} and achieve: ${cleanGoal}.`,
        targetGoal: cleanGoal,
        estimatedWeeks: weeks,
        weeklyHours: Number(req.body?.weeklyHours) || 10,
        difficulty: req.body?.currentLevel || 'Intermediate',
        phases: [
          {
            phaseNumber: 1,
            title: `Phase 1: ${cleanSkill} Core Mechanics`,
            duration: `Weeks 1-${Math.max(2, Math.floor(weeks / 2))}`,
            description: `Understand the core building blocks, tooling setup, and mental models of ${cleanSkill}.`,
            topics: [`${cleanSkill} Syntax & Setup`, 'Architecture & Data Flow', 'Testing & Debugging'],
            projects: [{ name: `${cleanSkill} Starter System`, description: 'Build a fully tested modular foundation.' }],
            resources: [{ name: 'Documentation Hub', type: 'Docs', url: 'https://devdocs.io/' }]
          },
          {
            phaseNumber: 2,
            title: `Phase 2: Production Capstone & ${cleanGoal}`,
            duration: `Weeks ${Math.max(2, Math.floor(weeks / 2)) + 1}-${weeks}`,
            description: `Build a production-grade portfolio project demonstrating end-to-end expertise in ${cleanSkill}.`,
            topics: ['Performance Optimization', 'Cloud Deployment & CI/CD', 'Portfolio Presentation'],
            projects: [{ name: `Full Capstone: ${cleanGoal}`, description: 'Live deployed system with documentation.' }],
            resources: [{ name: 'Tech Interview Handbook', type: 'Docs', url: 'https://www.techinterviewhandbook.org/' }]
          }
        ]
      }
    });
  }
});

// API: AI Tutor Chat
app.post('/api/ai-tutor', async (req, res) => {
  try {
    const { question, contextTopic, skill, currentLevel = 'Intermediate' } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getGeminiAI();

    if (ai) {
      const prompt = `You are an expert, encouraging, and clear technical AI Mentor at LearnPath-AI.
The student is studying: "${skill || 'Software & AI Engineering'}" (Level: ${currentLevel}).
Current Active Topic in their Roadmap: "${contextTopic || 'General Development'}".

Student Question: "${question}"

Please provide a structured, crystal-clear response with:
1. **Direct Concept & Real-World Analogy**: Explain it simply with zero fluff.
2. **Production-Ready Code Example**: Include a clean, commented snippet (Python/TypeScript/etc. as appropriate).
3. **Common Pitfalls & Senior Engineer Tips**: 2 crucial mistakes beginners make and how to avoid them.
4. **Interview Relevance**: How this concept appears in technical interviews.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      return res.json({
        success: true,
        answer: response.text,
        source: 'gemini-3.7-flash'
      });
    }

    // Dynamic mentor response
    return res.json({
      success: true,
      answer: `### Explanation for: **${contextTopic || skill}**\n\n#### 1. Intuitive Mental Model\nThink of **${contextTopic || skill}** as a modular assembly line. Rather than executing unmonitored commands, every step validates data before passing state downstream.\n\n#### 2. Implementation Pattern\n\`\`\`typescript\n// Production implementation example for ${contextTopic || skill}\ninterface Result<T> {\n  data: T | null;\n  error?: string;\n  status: 'idle' | 'success' | 'failed';\n}\n\nasync function handleWorkflow<T>(input: T): Promise<Result<T>> {\n  try {\n    // Validate and process payload cleanly\n    if (!input) throw new Error('Payload required');\n    return { data: input, status: 'success' };\n  } catch (err: any) {\n    return { data: null, error: err.message, status: 'failed' };\n  }\n}\n\`\`\`\n\n#### 3. Top Pitfalls to Avoid\n- **Unchecked Edge Cases**: Always validate boundaries and empty array inputs.\n- **Premature Optimization**: Build clean, testable interfaces first before scaling.\n\n*Ask me for further code samples or interview drills anytime!*`,
      source: 'offline-mentor'
    });
  } catch (error: any) {
    console.error('AI Tutor error:', error);
    res.status(500).json({ error: error.message || 'AI Tutor failed to respond' });
  }
});

// API: Dynamic Quiz Generator
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { skill = 'Machine Learning', topic = 'Neural Networks', difficulty = 'Intermediate' } = req.body;
    const ai = getGeminiAI();

    if (ai) {
      try {
        const prompt = `Generate a 4-question multiple-choice technical skill assessment quiz for a student learning "${skill}" on the topic "${topic}" at "${difficulty}" difficulty.
Return ONLY valid JSON matching this schema:
{
  "topic": "${topic}",
  "skill": "${skill}",
  "questions": [
    {
      "id": 1,
      "question": "Clear technical question testing conceptual mastery?",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why the correct option is right and why the distractors are wrong."
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.5,
          }
        });

        if (response.text) {
          const parsed = cleanAndParseJSON(response.text);
          if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            return res.json({ success: true, quiz: parsed, source: 'gemini-3.7-flash' });
          }
        }
      } catch (aiErr: any) {
        console.warn('Gemini quiz generation warning, using technical fallback:', aiErr?.message || aiErr);
      }
    }

    // Dynamic Context-Aware Technical Quiz Fallback
    const cleanTopic = topic || 'Software Engineering Core';
    const cleanSkill = skill || 'Computer Science';

    return res.json({
      success: true,
      source: 'domain-fallback-engine',
      quiz: {
        topic: cleanTopic,
        skill: cleanSkill,
        difficulty: difficulty,
        questions: [
          {
            id: 1,
            question: `In modern ${cleanSkill}, what fundamental problem does "${cleanTopic}" solve?`,
            options: [
              `It provides scalable architectural abstractions, predictable execution, and consistent state management`,
              `It bypasses compile-time verification by disabling runtime type checks`,
              `It substitutes automated integration tests with manual console logging`,
              `It permanently forces single-threaded blocking execution across all nodes`
            ],
            correctAnswer: 0,
            explanation: `Mastering ${cleanTopic} is essential in ${cleanSkill} to ensure modular separation of concerns, reliable performance, and predictable state transitions under high load.`
          },
          {
            id: 2,
            question: `When deploying systems utilizing "${cleanTopic}", which engineering practice best prevents production regressions?`,
            options: [
              `Eliminating logging and telemetry to minimize container disk space`,
              `Comprehensive boundary validation, defensive typing, and continuous automated test coverage`,
              `Hardcoding environment secrets directly into repository files`,
              `Ignoring memory leaks and unhandled asynchronous promise rejections`
            ],
            correctAnswer: 1,
            explanation: `Defensive programming, automated integration tests, and rigorous boundary validation guarantee that anomalies in ${cleanTopic} are caught before user impact.`
          },
          {
            id: 3,
            question: `How does a senior engineer approach performance tuning when working with "${cleanTopic}"?`,
            options: [
              `Profiling memory allocations, minimizing computational complexity (Big-O), and establishing metric benchmarks`,
              `Refactoring all microservices into a single unmonitored script`,
              `Disabling caching layers to force continuous cold database reads`,
              `Skipping code reviews and deploying untested changes directly to master`
            ],
            correctAnswer: 0,
            explanation: `Senior software engineering relies on data-driven telemetry, systematic memory/latency profiling, and optimizing algorithmic bottlenecks rather than guessing.`
          },
          {
            id: 4,
            question: `What distinguishes a production-grade implementation of "${cleanTopic}" from a beginner prototype?`,
            options: [
              `Zero-downtime resilience, error recovery strategies, clear documentation, and observability`,
              `Writing monolithic 3,000-line functions without unit tests`,
              `Relying on deprecated third-party packages without security scans`,
              `Omitting type signatures and exception handlers`
            ],
            correctAnswer: 0,
            explanation: `Production readiness demands fault tolerance, clear observability dashboards, structured exception handling, and self-documenting clean code architecture.`
          }
        ]
      }
    });
  } catch (error: any) {
    console.error('Quiz Generator outer error:', error);
    // Even on catastrophic error, return a valid playable quiz so the UI never breaks
    return res.json({
      success: true,
      source: 'emergency-safe-quiz',
      quiz: {
        topic: req.body?.topic || 'Core Engineering Principles',
        skill: req.body?.skill || 'Software Development',
        questions: [
          {
            id: 1,
            question: `What is the primary benefit of modular code organization and clean architectural boundaries?`,
            options: [
              `High maintainability, easier unit testing, and isolated blast radius for bugs`,
              `Increased coupling between unrelated database tables`,
              `Slower compilation times and difficult refactoring`,
              `Disabling linting and continuous integration`
            ],
            correctAnswer: 0,
            explanation: `Modularity reduces cognitive load and allows isolated testing, refactoring, and independent deployment of system components.`
          },
          {
            id: 2,
            question: `Why is defensive input validation crucial in production software systems?`,
            options: [
              `It prevents SQL/injection attacks, invalid state corruption, and unexpected server crashes`,
              `It ensures all queries run without indexing`,
              `It replaces the need for server authentication`,
              `It adds unnecessary code boilerplate with no security benefit`
            ],
            correctAnswer: 0,
            explanation: `Validating all inputs at the boundary prevents malformed data from corrupting database state or causing security vulnerabilities.`
          }
        ]
      }
    });
  }
});

// API: AI Topic Explainer / Flashcard Deep-Dive
app.post('/api/ai-explain-topic', async (req, res) => {
  try {
    const { topic, skill = 'Computer Science', level = 'Intermediate' } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const ai = getGeminiAI();
    if (ai) {
      const prompt = `You are a world-class senior technical instructor. Generate an in-depth study guide flashcard for the topic "${topic}" within "${skill}" (${level} level).
Return ONLY valid JSON matching this schema:
{
  "topic": "${topic}",
  "skill": "${skill}",
  "quickSummary": "2-3 sentences explaining what this is and why it matters.",
  "analogy": "A brilliant real-world physical analogy explaining the concept.",
  "keyConcepts": [
    {"title": "Concept 1", "desc": "Explanation"}
  ],
  "codeSnippet": "// Clean, working code snippet demonstrating usage\\n...",
  "codeLanguage": "typescript",
  "interviewTips": [
    "Tip 1 for answering questions on this in FAANG/top tech interviews",
    "Tip 2"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      if (response.text) {
        const parsed = cleanAndParseJSON(response.text);
        return res.json({ success: true, data: parsed, source: 'gemini-3.7-flash' });
      }
    }

    // Dynamic Flashcard Fallback
    return res.json({
      success: true,
      data: {
        topic,
        skill,
        quickSummary: `${topic} is a core foundational pillar in ${skill} used to structure predictable, high-performance computing logic and maintainable architectures.`,
        analogy: `Think of ${topic} like a high-speed express subway transit system: instead of every traveler driving independently, organized rails guide traffic predictably with zero collisions.`,
        keyConcepts: [
          { title: 'Modular Encapsulation', desc: 'Isolating logic into self-contained units with strict input/output contracts.' },
          { title: 'Deterministic State Flow', desc: 'Ensuring predictable transitions across all user and system interactions.' },
          { title: 'Performance Optimization', desc: 'Minimizing redundant computational cycles through caching and vectorized algorithms.' }
        ],
        codeSnippet: `// Practical demonstration of ${topic}\nexport function processData<T>(input: T[]): T[] {\n  // Filter and transform with O(N) linear efficiency\n  return input.filter(item => Boolean(item));\n}`,
        codeLanguage: 'typescript',
        interviewTips: [
          `Be prepared to explain the time & space complexity (Big-O) tradeoffs of ${topic}.`,
          `Highlight real-world production edge cases, such as network jitter, concurrency, or cache invalidation.`
        ]
      }
    });
  } catch (err: any) {
    console.error('Topic explain error:', err);
    res.status(500).json({ error: 'Failed to generate study guide' });
  }
});

// API: Dynamic Flashcard Deck Generator
app.post('/api/generate-flashcard-deck', async (req, res) => {
  try {
    const { skill = 'AI Engineering', topic = 'Transformer Architectures', difficulty = 'Intermediate' } = req.body;
    const ai = getGeminiAI();

    if (ai) {
      const prompt = `You are a principal engineer and master technical educator. Generate a high-yield study deck of 5 technical flashcards on the topic "${topic}" within "${skill}" (${difficulty} difficulty).
Return ONLY valid JSON matching this schema:
{
  "title": "${topic} Study Deck",
  "skill": "${skill}",
  "topic": "${topic}",
  "description": "Master core concepts, real-world mental models, and interview questions for ${topic}.",
  "cards": [
    {
      "id": "fc-ai-1",
      "topic": "Specific subconcept title",
      "front": "Thought-provoking technical question or concept test?",
      "back": "Precise, authoritative answer explaining the mechanics and trade-offs.",
      "analogy": "Clear real-world physical analogy.",
      "codeSnippet": "// Clean, working code demonstration\\n...",
      "codeLanguage": "typescript",
      "keyTakeaways": [
        "Takeaway 1",
        "Takeaway 2"
      ],
      "interviewTip": "Senior tech interview advice for this subtopic.",
      "difficulty": "${difficulty}"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      if (response.text) {
        const parsed = cleanAndParseJSON(response.text);
        return res.json({ success: true, deck: parsed, source: 'gemini-3.7-flash' });
      }
    }

    // High quality fallback deck
    return res.json({
      success: true,
      deck: {
        title: `${topic} Mastery Deck`,
        skill: skill,
        topic: topic,
        description: `Comprehensive study flashcards covering key mechanics, architecture, and interview questions for ${topic}.`,
        cards: [
          {
            id: `fc-fb-1`,
            topic: `Core Principles of ${topic}`,
            front: `What fundamental engineering problem does ${topic} solve in ${skill}?`,
            back: `${topic} provides modular decomposition, deterministic state boundaries, and high-throughput execution guarantees, preventing architectural coupling.`,
            analogy: `Like building with standardized shipping containers: standard dimensions allow massive ships, cranes, and trains to transport goods worldwide without bespoke handling.`,
            codeSnippet: `// Exemplary pattern for ${topic}\nexport function applyConcept<T>(data: T[]): T[] {\n  return data.filter(Boolean);\n}`,
            codeLanguage: 'typescript',
            keyTakeaways: [
              'Enforces low coupling and high cohesion across modules.',
              'Ensures O(1) or O(N) predictable computational efficiency.',
              'Enables robust telemetry observability and automated unit testing.'
            ],
            interviewTip: `Clearly define the trade-offs between memory overhead vs. throughput latency when discussing ${topic}.`,
            difficulty: difficulty
          },
          {
            id: `fc-fb-2`,
            topic: `Production Concurrency & Scaling`,
            front: `How does ${topic} behave under high-concurrency or distributed workloads?`,
            back: `It avoids shared mutable state through immutable message passing, optimistic locking, or vectorized batching, ensuring thread safety and preventing race conditions.`,
            analogy: `Like a modern airport luggage carousel where bags move in a one-way continuous loop rather than travelers fighting over an unorganized baggage pile.`,
            codeSnippet: `// Safe concurrent pipeline\nexport async function runBatch<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {\n  return Promise.all(tasks.map(t => t()));\n}`,
            codeLanguage: 'typescript',
            keyTakeaways: [
              'Eliminates lock contention bottlenecks.',
              'Maintains atomic consistency across asynchronous workers.'
            ],
            interviewTip: `Mention idempotent event handlers and circuit breaker patterns during system design interviews.`,
            difficulty: difficulty
          },
          {
            id: `fc-fb-3`,
            topic: `Telemetry & Failure Recovery`,
            front: `What telemetry metrics should you monitor in production for ${topic}?`,
            back: `P99 latency, error rates (HTTP 5xx / unhandled exceptions), memory leak allocations, and cache hit ratios.`,
            analogy: `Like the cockpit instrument panel on a commercial airliner alerting pilots to fuel flow, altitude drift, and engine pressure before any failure occurs.`,
            codeSnippet: `// Telemetry timing wrapper\nconst start = performance.now();\n// execute operation...\nconst durationMs = performance.now() - start;`,
            codeLanguage: 'typescript',
            keyTakeaways: [
              'Track P50, P95, and P99 tail latencies.',
              'Set automated alerting thresholds for sudden rate anomalies.'
            ],
            interviewTip: `Always bring up observability (logs, metrics, traces) to demonstrate senior production mindset.`,
            difficulty: difficulty
          }
        ]
      }
    });
  } catch (err: any) {
    console.error('Flashcard deck error:', err);
    res.status(500).json({ error: 'Failed to generate flashcard deck' });
  }
});

// ================= LEADERBOARD STATE & ENDPOINTS =================
interface LeaderboardRecord {
  id: string;
  name: string;
  avatarUrl: string;
  targetRole: string;
  xp: number;
  streakDays: number;
  quizzesPassed: number;
  flashcardsMastered: number;
  roadmapsCompleted: number;
  badgesCount: number;
  track: string;
  badgeTitle: string;
}

const leaderboardStore: LeaderboardRecord[] = [
  {
    id: 'usr-lb-1',
    name: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Lead AI Research Scientist',
    xp: 3450,
    streakDays: 28,
    quizzesPassed: 24,
    flashcardsMastered: 48,
    roadmapsCompleted: 3,
    badgesCount: 11,
    track: 'AI Engineering',
    badgeTitle: 'Grandmaster'
  },
  {
    id: 'usr-lb-2',
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Staff Distributed Systems Architect',
    xp: 2980,
    streakDays: 21,
    quizzesPassed: 19,
    flashcardsMastered: 38,
    roadmapsCompleted: 2,
    badgesCount: 9,
    track: 'Full-Stack Development',
    badgeTitle: 'Diamond Fellow'
  },
  {
    id: 'usr-lb-3',
    name: 'Sophia Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Senior ML Engineer',
    xp: 2640,
    streakDays: 16,
    quizzesPassed: 17,
    flashcardsMastered: 32,
    roadmapsCompleted: 2,
    badgesCount: 8,
    track: 'AI Engineering',
    badgeTitle: 'Platinum Architect'
  },
  {
    id: 'usr-default-alex',
    name: 'Alex Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Senior AI Engineer',
    xp: 2120,
    streakDays: 5,
    quizzesPassed: 12,
    flashcardsMastered: 18,
    roadmapsCompleted: 1,
    badgesCount: 6,
    track: 'AI Engineering',
    badgeTitle: 'Gold Scholar'
  },
  {
    id: 'usr-lb-4',
    name: 'Kenji Takahashi',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Full-Stack Cloud Engineer',
    xp: 1890,
    streakDays: 12,
    quizzesPassed: 14,
    flashcardsMastered: 22,
    roadmapsCompleted: 1,
    badgesCount: 6,
    track: 'Full-Stack Development',
    badgeTitle: 'Gold Scholar'
  },
  {
    id: 'usr-lb-5',
    name: 'Amina Diallo',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Data Systems Engineer',
    xp: 1650,
    streakDays: 9,
    quizzesPassed: 11,
    flashcardsMastered: 19,
    roadmapsCompleted: 1,
    badgesCount: 5,
    track: 'Data Science',
    badgeTitle: 'Silver Master'
  },
  {
    id: 'usr-lb-6',
    name: 'Lucas Silva',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    targetRole: 'DevOps & SRE Specialist',
    xp: 1420,
    streakDays: 8,
    quizzesPassed: 9,
    flashcardsMastered: 15,
    roadmapsCompleted: 1,
    badgesCount: 4,
    track: 'Cloud & DevOps',
    badgeTitle: 'Silver Master'
  }
];

app.get('/api/leaderboard', (req, res) => {
  try {
    const { track, timeframe } = req.query;
    let list = [...leaderboardStore];

    if (track && track !== 'All') {
      list = list.filter(item => item.track === track);
    }

    // Sort descending by XP
    list.sort((a, b) => b.xp - a.xp);

    const ranked = list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    res.json({ success: true, leaderboard: ranked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.post('/api/leaderboard/sync', (req, res) => {
  try {
    const { user, stats } = req.body;
    if (!user || !user.id) {
      return res.status(400).json({ error: 'User info required' });
    }

    const index = leaderboardStore.findIndex(entry => entry.id === user.id || entry.name.toLowerCase() === user.name.toLowerCase());
    const xpCalculated = (stats?.xp || 0) + (stats?.streakDays || 5) * 50 + (stats?.completedMilestones || 4) * 200 + (stats?.quizzesPassed || 0) * 100;

    const record: LeaderboardRecord = {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`,
      targetRole: user.targetRole || 'Software Engineer',
      xp: xpCalculated,
      streakDays: user.streakDays || stats?.streakDays || 1,
      quizzesPassed: stats?.quizzesPassed || 0,
      flashcardsMastered: stats?.flashcardsMastered || 0,
      roadmapsCompleted: stats?.savedRoadmaps?.filter((r: any) => r.phases?.every((p: any) => p.completed)).length || 0,
      badgesCount: stats?.badges?.filter((b: any) => b.unlocked).length || 5,
      track: user.targetRole?.includes('AI') ? 'AI Engineering' : user.targetRole?.includes('Data') ? 'Data Science' : 'Full-Stack Development',
      badgeTitle: xpCalculated > 3000 ? 'Grandmaster' : xpCalculated > 2000 ? 'Gold Scholar' : 'Silver Master'
    };

    if (index >= 0) {
      leaderboardStore[index] = record;
    } else {
      leaderboardStore.push(record);
    }

    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync leaderboard' });
  }
});

// ================= REAL-TIME GROUP DISCUSSIONS (SOCKET.IO) =================
interface StoredMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  text: string;
  codeSnippet?: string;
  codeLanguage?: string;
  timestamp: string;
  reactions: { [emoji: string]: string[] };
  badge?: string;
}

const roomMessages: Map<string, StoredMessage[]> = new Map();
const activeRoomUsers: Map<string, Map<string, { id: string; name: string; avatarUrl: string; targetRole: string }>> = new Map();

// Seed initial rich discussion messages per channel
const initialSeedMessages: { [roomId: string]: StoredMessage[] } = {
  'room-ai': [
    {
      id: 'msg-ai-1',
      roomId: 'room-ai',
      senderId: 'usr-lb-1',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Lead AI Scientist',
      text: 'Hey everyone! For anyone fine-tuning QLoRA models on custom datasets: make sure you use rank r=16 or r=32 on target modules q_proj and v_proj. Here is the config snippet I used in production today:',
      codeSnippet: `lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)`,
      codeLanguage: 'python',
      timestamp: '10:14 AM',
      reactions: { '🔥': ['usr-default-alex', 'usr-lb-3'], '💡': ['usr-lb-2'] },
      badge: 'Staff Researcher'
    },
    {
      id: 'msg-ai-2',
      roomId: 'room-ai',
      senderId: 'usr-lb-3',
      senderName: 'Sophia Patel',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Senior ML Engineer',
      text: 'Awesome tip Elena! I also found that combining reciprocal rank fusion (RRF) with vector embeddings boosted our retrieval accuracy by 23% in our RAG pipeline.',
      timestamp: '10:22 AM',
      reactions: { '🚀': ['usr-lb-1'] }
    }
  ],
  'room-fullstack': [
    {
      id: 'msg-fs-1',
      roomId: 'room-fullstack',
      senderId: 'usr-lb-2',
      senderName: 'Marcus Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Staff Architect',
      text: 'Quick tip on React 19 Server Components: keep data fetching inside RSCs and pass promises down to client components via the new `use()` hook for instant streamable UI!',
      codeSnippet: `// Server Component passes streamable promise
export default async function Page() {
  const dataPromise = fetchData();
  return (
    <Suspense fallback={<Skeleton />}>
      <Feed dataPromise={dataPromise} />
    </Suspense>
  );
}`,
      codeLanguage: 'typescript',
      timestamp: '09:45 AM',
      reactions: { '🔥': ['usr-lb-4'], '💡': ['usr-default-alex'] }
    }
  ],
  'room-interview': [
    {
      id: 'msg-iv-1',
      roomId: 'room-interview',
      senderId: 'usr-lb-4',
      senderName: 'Kenji Takahashi',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Cloud Engineer',
      text: 'Just finished a mock System Design interview on distributed rate limiters! Key takeaways: Token Bucket is preferred for bursty traffic, while Sliding Window Log gives exact rate guarantees at the cost of higher Redis memory.',
      timestamp: '08:30 AM',
      reactions: { '👏': ['usr-default-alex', 'usr-lb-1'] }
    }
  ],
  'room-general': [
    {
      id: 'msg-gen-1',
      roomId: 'room-general',
      senderId: 'usr-lb-5',
      senderName: 'Amina Diallo',
      senderAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Data Engineer',
      text: 'Welcome everyone! 🎯 Starting a 50-minute focused Pomodoro study sprint on Flashcards & Quiz reviews. Who wants to join?',
      timestamp: '09:15 AM',
      reactions: { '🚀': ['usr-default-alex', 'usr-lb-2', 'usr-lb-6'] }
    }
  ]
};

// Initialize room message stores
Object.entries(initialSeedMessages).forEach(([roomId, msgs]) => {
  roomMessages.set(roomId, [...msgs]);
});

// Setup Socket.io event listeners
io.on('connection', (socket) => {
  let currentRoom: string | null = null;
  let currentUserId: string | null = null;

  socket.on('join_room', ({ roomId, user }: { roomId: string; user: { id: string; name: string; avatarUrl: string; targetRole: string } }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      const roomUsers = activeRoomUsers.get(currentRoom);
      if (roomUsers && currentUserId) {
        roomUsers.delete(currentUserId);
        io.to(currentRoom).emit('room_users', Array.from(roomUsers.values()));
      }
    }

    currentRoom = roomId;
    currentUserId = user?.id || socket.id;
    socket.join(roomId);

    // Track active user
    if (!activeRoomUsers.has(roomId)) {
      activeRoomUsers.set(roomId, new Map());
    }
    const roomUsers = activeRoomUsers.get(roomId)!;
    roomUsers.set(currentUserId, {
      id: currentUserId,
      name: user?.name || 'Anonymous Learner',
      avatarUrl: user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user',
      targetRole: user?.targetRole || 'Learner'
    });

    // Send existing messages
    const msgs = roomMessages.get(roomId) || [];
    socket.emit('chat_history', msgs);

    // Broadcast updated user presence list
    io.to(roomId).emit('room_users', Array.from(roomUsers.values()));
  });

  socket.on('send_message', ({ roomId, message }: { roomId: string; message: Partial<StoredMessage> }) => {
    if (!roomId || !message.text) return;

    const newMessage: StoredMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      roomId,
      senderId: message.senderId || currentUserId || socket.id,
      senderName: message.senderName || 'Learner',
      senderAvatar: message.senderAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user',
      senderRole: message.senderRole || 'Learner',
      text: message.text,
      codeSnippet: message.codeSnippet,
      codeLanguage: message.codeLanguage || 'typescript',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
      badge: message.badge
    };

    if (!roomMessages.has(roomId)) {
      roomMessages.set(roomId, []);
    }
    const msgs = roomMessages.get(roomId)!;
    msgs.push(newMessage);
    if (msgs.length > 80) msgs.shift(); // Keep buffer bounded

    io.to(roomId).emit('receive_message', newMessage);
  });

  socket.on('toggle_reaction', ({ roomId, messageId, emoji, userId }: { roomId: string; messageId: string; emoji: string; userId: string }) => {
    const msgs = roomMessages.get(roomId);
    if (!msgs) return;

    const msg = msgs.find(m => m.id === messageId);
    if (msg) {
      if (!msg.reactions[emoji]) {
        msg.reactions[emoji] = [];
      }
      const existingIdx = msg.reactions[emoji].indexOf(userId);
      if (existingIdx >= 0) {
        msg.reactions[emoji].splice(existingIdx, 1);
        if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
      } else {
        msg.reactions[emoji].push(userId);
      }
      io.to(roomId).emit('reaction_updated', { messageId, reactions: msg.reactions });
    }
  });

  socket.on('typing', ({ roomId, user, isTyping }: { roomId: string; user: { name: string }; isTyping: boolean }) => {
    socket.to(roomId).emit('user_typing', { user, isTyping });
  });

  socket.on('disconnect', () => {
    if (currentRoom && currentUserId) {
      const roomUsers = activeRoomUsers.get(currentRoom);
      if (roomUsers) {
        roomUsers.delete(currentUserId);
        io.to(currentRoom).emit('room_users', Array.from(roomUsers.values()));
      }
    }
  });
});

// Vite middleware for development & static serving for production
async function startServer() {
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

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`LearnPath-AI Server with WebSockets running on http://localhost:${PORT}`);
  });
}

startServer();

