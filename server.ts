import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// Trust proxy for rate limiting behind reverse proxies (like Cloud Run or Nginx)
app.set("trust proxy", 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // In development with Vite, strict CSP might block HMR/eval. Can be tailored for prod.
}));

app.use(express.json({ limit: "10kb" })); // Limit payload size to prevent DOS

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, error: "Te veel verzoeken. Probeer het later opnieuw." },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login requests per hour to prevent brute-force
  message: { success: false, error: "Te veel mislukte inlogpogingen. Probeer het over een uur opnieuw." },
  validate: { xForwardedForHeader: false },
});

// Apply general rate limiting to all API routes
app.use("/api/", apiLimiter);

const PORT = 3000;



// Helper to sanitize basic strings
const sanitizeString = (str: any): string => {
  if (typeof str !== "string") return "";
  return str.replace(/[^\w\s-]/gi, "").substring(0, 100);
};

// API endpoint for admin password verification
app.post("/api/admin/verify", authLimiter, (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || typeof password !== "string") {
      return res.status(400).json({ success: false, error: "Ongeldige invoer." });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD is niet ingesteld in de omgevingsvariabelen.");
      return res.status(500).json({ success: false, error: "Serverconfiguratiefout." });
    }

    if (password === adminPassword) {
      return res.json({ success: true });
    }
    
    return res.status(401).json({ success: false, error: "Onjuist wachtwoord!" });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ success: false, error: "Interne serverfout." });
  }
});





// Configure Vite or Static Serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
