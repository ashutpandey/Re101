import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybersecurity-roadmap';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
import toolsRouter from './routes/tools.js';
import peopleRouter from './routes/people.js';
import blogsRouter from './routes/blogs.js';
import communitiesRouter from './routes/communities.js';
import proxyRouter from './routes/proxy.js';

app.use('/api/tools', toolsRouter);
app.use('/api/people', peopleRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/proxy', proxyRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
