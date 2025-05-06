import { CalculatorState } from '../types/calculator';

export interface PersonalityResult {
  personality: string;
  emoji: string;
  story: string;
  avatarSuggestion: string;
  nextAction: string;
  badge: string;
  champion: string;
  powerMoves: string[];
  subCategory: string;
  tally: Record<string, number>;
}

export const calculatePersonality = async (state: CalculatorState): Promise<PersonalityResult> => {
  console.log('Sending state to API:', state);
  try {
    const response = await fetch('/api/calculate-personality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to calculate personality: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Error calculating personality:', error);
    throw error;
  }
}; 