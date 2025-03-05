import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, authenticateToken, checkRole } from "./auth";
import { storage } from "./storage";
import { UserRole } from "@shared/schema";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

export async function registerRoutes(app: Express): Promise<Server> {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'"],
      },
    }
  }));

  app.use(cors({
    origin: true,
    credentials: true
  }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }));

  // Auth routes
  setupAuth(app);

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  app.post("/api/courses", authenticateToken, checkRole([UserRole.FORMATEUR]), async (req, res) => {
    try {
      const course = await storage.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: "Error creating course" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error fetching course" });
    }
  });

  app.put("/api/courses/:id", authenticateToken, checkRole([UserRole.FORMATEUR]), async (req, res) => {
    try {
      const course = await storage.updateCourse(req.params.id, req.body);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error updating course" });
    }
  });

  app.delete("/api/courses/:id", authenticateToken, checkRole([UserRole.FORMATEUR, UserRole.ADMINISTRATEUR]), async (req, res) => {
    try {
      await storage.deleteCourse(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting course" });
    }
  });

  // Module routes
  app.post("/api/modules", authenticateToken, checkRole([UserRole.FORMATEUR]), async (req, res) => {
    try {
      const module = await storage.createModule(req.body);
      res.status(201).json(module);
    } catch (error) {
      res.status(500).json({ message: "Error creating module" });
    }
  });

  app.get("/api/modules/:id", authenticateToken, async (req, res) => {
    try {
      const module = await storage.getModule(req.params.id);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Error fetching module" });
    }
  });

  // Quiz routes
  app.post("/api/quizzes", authenticateToken, checkRole([UserRole.FORMATEUR]), async (req, res) => {
    try {
      const quiz = await storage.createQuiz(req.body);
      res.status(201).json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Error creating quiz" });
    }
  });

  app.get("/api/quizzes/:id", authenticateToken, async (req, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quiz" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}