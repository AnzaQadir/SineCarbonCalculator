import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables (only in development)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a sustainability transformation engine. 
Given a user's ecoPersonality, category scores, behaviors, region, lifestyle, and intent, generate:
1. A list of 2-5 creative, emotionally resonant, and actionable sustainability recommendations. Each should include:
   - action
   - linkedBehavior
   - impact (quantified)
   - analogy (emotional hook)
   - effortLevel (low/medium/high)
   - category
   - roi (emotional, environmental)
2. A 30-day playbook: weekly themes, daily micro-actions, reasons, feelings, end-of-month simulated impact.
3. Output must be valid, parseable JSON. No extra commentary.
`;

export async function generateRecommendations(userProfile: any) {
  const userPrompt = `
User Profile:
${JSON.stringify(userProfile, null, 2)}

Instructions:
- Detect user intent and needs.
- For each low or mid-performing category, generate a creative, persona-matched action.
- Use analogies and emotional hooks.
- Quantify impact.
- Build a 4-week playbook with weekly themes, daily actions, and motivational context.
- Output JSON with fields: intent, actions, playbook (see schema below).

Schema:
{
  "intent": "...",
  "actions": [
    {
      "action": "...",
      "linkedBehavior": "...",
      "impact": "...",
      "analogy": "...",
      "effortLevel": "...",
      "category": "...",
      "roi": {
        "emotional": "...",
        "environmental": "..."
      }
    }
  ],
  "playbook": {
    "weeks": [
      {
        "theme": "...",
        "why": "...",
        "actions": ["...", "..."],
        "feelings": "..."
      }
    ],
    "milestones": ["..."],
    "endOfMonthImpact": "..."
  }
}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.8,
    max_tokens: 1200,
  });

  const text = completion.choices[0]?.message?.content || '';
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } else {
    throw new Error('No JSON found in LLM response');
  }
} 