import mongoose from 'mongoose';
import { log } from './vite';

// Use local MongoDB if no URI is provided
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning';

mongoose.connect(MONGODB_URI)
  .then(() => log('Connected to MongoDB', 'mongodb'))
  .catch((err) => {
    log(`MongoDB connection error: ${err}`, 'mongodb');
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['apprenant', 'formateur', 'administrateur'], required: true },
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  price: { type: Number, required: true },
}, { timestamps: true });

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  resources: [{ type: String }],
}, { timestamps: true });

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }
  }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Course = mongoose.model('Course', courseSchema);
export const Module = mongoose.model('Module', moduleSchema);
export const Quiz = mongoose.model('Quiz', quizSchema);