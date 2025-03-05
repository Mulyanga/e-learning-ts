import { Express } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { storage } from "./storage";
import { User } from "./database";
import { UserRole } from "@shared/schema";
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: Types.ObjectId | string, role: UserRole): string {
  return jwt.sign({ userId: userId.toString(), role }, JWT_SECRET, { expiresIn: '24h' });
}

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export function checkRole(roles: UserRole[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
}

export function setupAuth(app: Express) {
  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role
      });

      const token = generateToken(user._id, user.role);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user._id, user.role);
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });

  app.post("/api/logout", (req, res) => {
    res.sendStatus(200);
  });

  app.get("/api/user", authenticateToken, async (req: any, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });
}