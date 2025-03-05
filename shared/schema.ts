import { z } from "zod";

export enum UserRole {
  APPRENANT = "apprenant",
  FORMATEUR = "formateur",
  ADMINISTRATEUR = "administrateur"
}

// Base User Schema
export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertUserSchema = userSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Course Schema
export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  formateur: z.string(), // Reference to User
  content: z.array(z.string()), // Array of Module IDs
  price: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertCourseSchema = courseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Module Schema
export const moduleSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  courseId: z.string(),
  resources: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertModuleSchema = moduleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Quiz Schema
export const quizSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string()
  })),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertQuizSchema = quizSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Course = z.infer<typeof courseSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
