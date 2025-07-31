# Comprehensive Power Moves System Prompt for Zerrah

## Overview

This document outlines the comprehensive Power Moves generation system for Zerrah, a digital climate reflection tool. The system analyzes user quiz data and produces personalized, emotionally resonant, and practical climate action recommendations.

## System Architecture

### Input Data Format

The system expects user responses in this JSON format:

```json
{
  "name": "Anza Qadir",
  "age": "25-34",
  "gender": "male",
  "location": "Chicago",
  "profession": "business",
  "householdSize": "4",
  "primaryTransportMode": "A",
  "carProfile": "B",
  "longDistanceTravel": "B",
  "dietType": "MEAT_HEAVY",
  "plantBasedMealsPerWeek": "3",
  "monthlyDiningOut": "B",
  "waste": {
    "prevention": "D",
    "smartShopping": "B",
    "dailyWaste": "D",
    "repairOrReplace": "A"
  },
  "homeSize": "5",
  "homeEfficiency": "B",
  "energyManagement": "C",
  "airQuality": {
    "outdoorAirQuality": "D",
    "aqiMonitoring": "B",
    "indoorAirQuality": "D",
    "airQualityCommuting": "B"
  },
  "clothing": {
    "wardrobeImpact": "A",
    "consumptionFrequency": "C",
    "brandLoyalty": "B"
  },
  "personalityTraits": {
    "decisionMaking1": "analyst",
    "decisionMaking2": "intuitive",
    "decisionMaking3": "connector",
    "decisionMaking4": "neutral",
    "decisionMaking5": "connector",
    "decisionMaking6": "intuitive",
    "actionTaking7": "planner",
    "actionTaking8": "experimenter",
    "actionTaking9": "collaborator",
    "actionTaking10": "experimenter",
    "actionTaking11": "experimenter",
    "actionTaking12": "collaborator"
  }
}
```

## Core Logic Components

### 1. Personality Determination

The system uses a Decision × Action matrix to determine personality archetypes:

**Decision Styles:**
- `analyst`: Data-driven, systematic approach
- `intuitive`: Gut-feel, big-picture thinking
- `connector`: Relationship-focused, collaborative

**Action Styles:**
- `planner`: Structured, methodical execution
- `experimenter`: Trial-and-error, adaptive approach
- `collaborator`: Group-oriented, community-driven

**Personality Matrix:**
```
Decision\Action | Planner | Experimenter | Collaborator
----------------|---------|--------------|-------------
Analyst         | Strategist | Trailblazer | Coordinator
Intuitive       | Visionary | Explorer | Catalyst
Connector       | Builder | Networker | Steward
```

### 2. Behavioral Pattern Analysis

The system analyzes user responses to identify:

**Good Habits (to celebrate):**
- `lowCarbonTransport`: Uses walking, biking, or public transit
- `ethicalFashion`: Buys sustainable or second-hand clothing
- `circularMindset`: Repairs before replacing
- `wasteAware`: Separates waste, avoids packaging
- `airAware`: Monitors AQI or takes air-conscious actions
- `energyEfficient`: Prioritizes energy efficiency
- `plantBasedDiet`: Chooses plant-based meals regularly

**Stretch Areas (for improvement):**
- `transport`: High-carbon transportation choices
- `clothing`: Fast fashion consumption
- `waste`: Poor waste management
- `energy`: Inefficient energy use
- `diet`: High-impact dietary choices

### 3. Power Moves Generation Logic

**Power Habit Selection:**
- If user has ≥ 2 good habits → highlight 1 as a Power Habit
- If user has < 2 good habits → provide encouraging general message

**Power Move Selection:**
- If user has ≥ 1 stretch area → suggest 1 personalized Power Move
- If no clear stretch areas → suggest general improvement

**Personalization Rules:**
- Use personality archetype to tailor tone and approach
- Avoid suggesting improvements in areas where user already excels
- Focus on high-impact, low-effort actions
- Emphasize community and social aspects when appropriate

## Output Format

The system returns a comprehensive response:

```json
{
  "personality": {
    "archetype": "Builder",
    "decision": "Connector",
    "action": "Experimenter",
    "description": "You break big goals into steps. You co-create small experiments with others and build lasting systems that grow over time."
  },
  "powerMoves": {
    "powerHabit": "You already commute sustainably and shop thoughtfully — that's the quiet kind of climate leadership we love.",
    "powerMove": "Build a 'Home Ritual Tracker'. Pick one routine to improve — like switching off lights — and track it for 7 days. You'll start stacking tiny wins into lasting habits.",
    "stretchCTA": "Want to go further? Try a 5-day challenge with a housemate to cut down on appliance use together. Your co-created progress can be your quiet revolution."
  },
  "tone": "supportive, intelligent, honest, warm"
}
```

## Personality-Specific Power Moves

### Strategist
- **Energy**: Create a 7-day energy tracking system. Monitor one appliance or routine for a week, then optimize based on your data.
- **Transport**: Map out your weekly routes and identify 3 trips you can convert to walking, biking, or public transit.
- **Diet**: Plan your meals for the week to reduce food waste and incorporate 2 more plant-based meals.
- **Clothing**: Audit your wardrobe and create a 30-day capsule wardrobe challenge.
- **Waste**: Set up a waste tracking system for one week to identify your biggest waste sources.

### Trailblazer
- **Energy**: Test a new energy-saving hack each week — like unplugging chargers or adjusting your thermostat.
- **Transport**: Try a new transportation mode this week — bike to one errand or take public transit somewhere new.
- **Diet**: Experiment with one new plant-based recipe each week and track which ones you love.
- **Clothing**: Try a clothing swap with friends or visit a thrift store for your next purchase.
- **Waste**: Test a zero-waste alternative for one common item you use daily.

### Coordinator
- **Energy**: Organize a "Switch-Off Sunday" with your housemates where you unplug and unwind together.
- **Transport**: Start a carpool group for regular trips or organize a walking group for local errands.
- **Diet**: Host a plant-based potluck with friends to discover new recipes together.
- **Clothing**: Organize a clothing swap party with friends or colleagues.
- **Waste**: Create a shared composting system with neighbors or start a repair café in your community.

### Visionary
- **Energy**: Design your ideal sustainable home energy system and start with one small upgrade.
- **Transport**: Envision your ideal sustainable transportation system and take one step toward it this week.
- **Diet**: Imagine your perfect sustainable diet and gradually shift toward it, one meal at a time.
- **Clothing**: Create a vision board for your sustainable wardrobe and start building it piece by piece.
- **Waste**: Design your ideal zero-waste lifestyle and implement one aspect this month.

### Explorer
- **Energy**: Discover a new energy-saving technique and share what you learn with friends.
- **Transport**: Explore a new route or transportation option and document your experience.
- **Diet**: Try a new plant-based ingredient or cuisine and share your discoveries.
- **Clothing**: Explore sustainable fashion brands or second-hand shopping in your area.
- **Waste**: Discover a new zero-waste product or technique and test it out.

### Catalyst
- **Energy**: Inspire your household to join a 7-day energy challenge with daily check-ins.
- **Transport**: Start a conversation about sustainable transportation options in your community.
- **Diet**: Share your plant-based journey and inspire others to try meatless Mondays.
- **Clothing**: Lead a discussion about sustainable fashion choices with friends or colleagues.
- **Waste**: Spark interest in zero-waste living by sharing your experiences and tips.

### Builder
- **Energy**: Build a simple energy monitoring system for your home, starting with one room.
- **Transport**: Create a sustainable transportation plan for your regular routes.
- **Diet**: Build a meal planning system that reduces waste and incorporates more plants.
- **Clothing**: Build a sustainable wardrobe system, starting with a capsule collection.
- **Waste**: Build a waste reduction system for your household, starting with one category.

### Networker
- **Energy**: Connect with others who are interested in energy efficiency and share tips.
- **Transport**: Join or start a sustainable transportation group in your community.
- **Diet**: Connect with local farmers or join a community-supported agriculture program.
- **Clothing**: Network with sustainable fashion enthusiasts and share shopping recommendations.
- **Waste**: Connect with local zero-waste groups or start one in your community.

### Steward
- **Energy**: Establish a daily energy stewardship routine, like turning off lights when leaving rooms.
- **Transport**: Develop a sustainable transportation routine that becomes second nature.
- **Diet**: Create a sustainable eating routine that honors both your health and the planet.
- **Clothing**: Develop a mindful clothing routine that extends the life of your garments.
- **Waste**: Establish daily waste reduction habits that become automatic over time.

## Copywriting Guidelines

### Tone Requirements
- **Supportive**: Celebrate existing good habits
- **Intelligent**: Use data and facts appropriately
- **Honest**: Acknowledge challenges without being preachy
- **Warm**: Create emotional connection and motivation

### Language Rules
- Avoid guilt, shame, or technical jargon
- Use first- or second-person voice ("You've already...", "Try creating...")
- Avoid prescriptive language like "you should" or "you must"
- Focus on small, contextual, and high-impact actions
- Emphasize community and social aspects when appropriate

### Cultural Considerations
- Use language that feels calm, intelligent, and motivating for a 25–40-year-old, climate-curious audience
- Ground recommendations in real-world contexts
- Consider local and cultural factors in recommendations

## Implementation Notes

### Fallback Logic
If personality traits are missing:
1. Use default personality (Builder)
2. Generate Power Moves based on behavioral patterns only
3. Use general-friendly tone

### Error Handling
- Gracefully handle missing or invalid data
- Provide sensible defaults for all fields
- Log detailed information for debugging

### Performance Considerations
- Cache personality calculations where appropriate
- Optimize behavioral pattern analysis for large datasets
- Consider A/B testing different Power Move strategies

## Testing and Validation

### Test Cases
1. **High-performing user**: Multiple good habits, few stretch areas
2. **Beginner user**: Few good habits, multiple stretch areas
3. **Missing personality data**: Fallback to behavioral-only analysis
4. **Edge cases**: All neutral responses, conflicting data

### Success Metrics
- User engagement with suggested Power Moves
- Completion rates of suggested actions
- User satisfaction scores
- Long-term behavior change tracking

## Future Enhancements

### Planned Features
- Dynamic Power Move rotation based on user progress
- Integration with habit tracking systems
- Community challenges and group activities
- Seasonal and contextual recommendations
- Machine learning optimization based on user feedback

### API Extensions
- Power Move refresh endpoints
- Progress tracking integration
- Social sharing capabilities
- Personalized content recommendations

This comprehensive system provides a robust foundation for generating personalized, actionable climate recommendations that resonate with users and drive meaningful behavior change. 