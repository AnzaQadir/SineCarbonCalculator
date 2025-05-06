import express from 'express';
import cors from 'cors';
import { calculatePersonality } from '../services/personalityService';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Calculate personality endpoint
app.post('/api/calculate-personality', async (req, res) => {
  try {
    const personality = await calculatePersonality(req.body);
    res.json(personality);
  } catch (error) {
    console.error('Error calculating personality:', error);
    res.status(500).json({ error: 'Failed to calculate personality' });
  }
});

// Get personality details endpoint
app.get('/api/personality-details/:type', (req, res) => {
  try {
    const { type } = req.params;
    // TODO: Implement personality details service
    res.json({ type, details: 'Coming soon' });
  } catch (error) {
    console.error('Error fetching personality details:', error);
    res.status(500).json({ error: 'Failed to fetch personality details' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 