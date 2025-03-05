import { User, Course, Module, Quiz } from "./database";
import { InsertUser, InsertCourse, InsertModule, InsertQuiz } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<any>;
  getUser(id: string): Promise<any>;
  getUserByUsername(username: string): Promise<any>;

  // Course operations
  createCourse(course: InsertCourse): Promise<any>;
  getCourse(id: string): Promise<any>;
  getAllCourses(): Promise<any>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<any>;
  deleteCourse(id: string): Promise<any>;

  // Module operations
  createModule(module: InsertModule): Promise<any>;
  getModule(id: string): Promise<any>;
  updateModule(id: string, module: Partial<InsertModule>): Promise<any>;
  deleteModule(id: string): Promise<any>;

  // Quiz operations
  createQuiz(quiz: InsertQuiz): Promise<any>;
  getQuiz(id: string): Promise<any>;
  updateQuiz(id: string, quiz: Partial<InsertQuiz>): Promise<any>;
  deleteQuiz(id: string): Promise<any>;

  sessionStore: session.Store;
}

export class MongoStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
  }

  // User operations
  async createUser(user: InsertUser) {
    return User.create(user);
  }

  async getUser(id: string) {
    return User.findById(id);
  }

  async getUserByUsername(username: string) {
    return User.findOne({ username });
  }

  // Course operations
  async createCourse(course: InsertCourse) {
    return Course.create(course);
  }

  async getCourse(id: string) {
    return Course.findById(id).populate('formateur content');
  }

  async getAllCourses() {
    return Course.find().populate('formateur');
  }

  async updateCourse(id: string, course: Partial<InsertCourse>) {
    return Course.findByIdAndUpdate(id, course, { new: true });
  }

  async deleteCourse(id: string) {
    return Course.findByIdAndDelete(id);
  }

  // Module operations
  async createModule(module: InsertModule) {
    return Module.create(module);
  }

  async getModule(id: string) {
    return Module.findById(id);
  }

  async updateModule(id: string, module: Partial<InsertModule>) {
    return Module.findByIdAndUpdate(id, module, { new: true });
  }

  async deleteModule(id: string) {
    return Module.findByIdAndDelete(id);
  }

  // Quiz operations
  async createQuiz(quiz: InsertQuiz) {
    return Quiz.create(quiz);
  }

  async getQuiz(id: string) {
    return Quiz.findById(id);
  }

  async updateQuiz(id: string, quiz: Partial<InsertQuiz>) {
    return Quiz.findByIdAndUpdate(id, quiz, { new: true });
  }

  async deleteQuiz(id: string) {
    return Quiz.findByIdAndDelete(id);
  }
}

export const storage = new MongoStorage();