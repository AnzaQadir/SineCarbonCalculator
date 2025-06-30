export type EcoPersonalityType = 
  | 'Sustainability Slayer'
  | "Planet's Main Character"
  | 'Sustainability Soft Launch'
  | 'Kind of Conscious, Kind of Confused'
  | 'Eco in Progress'
  | 'Doing Nothing for the Planet'
  | 'Certified Climate Snoozer';

export const personalityHierarchy: EcoPersonalityType[] = [
  'Sustainability Slayer',
  "Planet's Main Character",
  'Sustainability Soft Launch',
  'Kind of Conscious, Kind of Confused',
  'Eco in Progress',
  'Doing Nothing for the Planet',
  'Certified Climate Snoozer'
];

export const EcoPersonalityTypes = {
  'Sustainability Slayer': {
    title: 'Sustainability Slayer',
    description: 'You\'re a true champion of sustainability! Your commitment to eco-friendly practices is inspiring.',
    strengths: [
      'Comprehensive understanding of sustainable practices',
      'Consistent implementation of eco-friendly habits',
      'Strong influence on others\' environmental choices'
    ],
    nextSteps: [
      'Share your knowledge with your community',
      'Consider mentoring others in their sustainability journey',
      'Explore advanced sustainability certifications or courses'
    ]
  },
  "Planet's Main Character": {
    title: "Planet's Main Character",
    description: 'You\'re making significant strides in your sustainability journey! Your dedication to environmental causes is commendable.',
    strengths: [
      'Strong commitment to sustainable living',
      'Good understanding of environmental impact',
      'Active participation in eco-friendly practices'
    ],
    nextSteps: [
      'Deepen your knowledge in specific areas of sustainability',
      'Engage more with environmental communities',
      'Set more ambitious sustainability goals'
    ]
  },
  'Sustainability Soft Launch': {
    title: 'Sustainability Soft Launch',
    description: 'You\'re making conscious efforts to live more sustainably and building momentum for bigger changes.',
    strengths: [
      'Growing awareness of environmental impact',
      'Implementing basic sustainable practices',
      'Openness to eco-friendly alternatives'
    ],
    nextSteps: [
      'Establish more consistent eco-habits',
      'Learn about advanced sustainability practices',
      'Connect with like-minded individuals'
    ]
  },
  'Kind of Conscious, Kind of Confused': {
    title: 'Kind of Conscious, Kind of Confused',
    description: 'You\'re aware of environmental issues and making some efforts, but could use more direction and consistency.',
    strengths: [
      'Basic environmental awareness',
      'Some sustainable practices in place',
      'Interest in improvement'
    ],
    nextSteps: [
      'Establish daily eco-friendly routines',
      'Learn more about environmental impact',
      'Start with simple sustainable swaps'
    ]
  },
  'Eco in Progress': {
    title: 'Eco in Progress',
    description: 'You\'re at the beginning of your sustainability journey with lots of potential for positive change.',
    strengths: [
      'Open to learning',
      'Taking first steps',
      'Recognizing need for change'
    ],
    nextSteps: [
      'Start with one sustainable habit',
      'Learn about basic environmental issues',
      'Find easy eco-friendly alternatives'
    ]
  },
  'Doing Nothing for the Planet': {
    title: 'Doing Nothing for the Planet',
    description: 'Your current lifestyle has significant room for improvement in terms of environmental impact.',
    strengths: [
      'Potential for significant impact',
      'Room for easy improvements',
      'Opportunity for fresh start'
    ],
    nextSteps: [
      'Start with simple eco-friendly changes',
      'Learn about environmental basics',
      'Track your daily habits'
    ]
  },
  'Certified Climate Snoozer': {
    title: 'Certified Climate Snoozer',
    description: 'It\'s time to wake up to environmental issues and start making positive changes.',
    strengths: [
      'Opportunity for major improvement',
      'Clean slate for new habits',
      'Potential for immediate impact'
    ],
    nextSteps: [
      'Begin with basic awareness',
      'Make one eco-friendly change',
      'Learn about environmental impact'
    ]
  }
};

export const personalityMappings = {
  homeEnergy: {
    efficiency: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice', 'Certified Climate Snoozer']
    },
    management: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice', 'Certified Climate Snoozer']
    }
  },
  transport: {
    primary: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    },
    carProfile: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer'],
      'E': ['Certified Climate Snoozer']
    }
  },
  food: {
    dietType: {
      'VEGAN': ['Sustainability Slayer', 'Eco Warrior'],
      'VEGETARIAN': ['Green Guardian', 'Climate Conscious'],
      'FLEXITARIAN': ['Eco Explorer', 'Green Novice'],
      'MEAT_MODERATE': ['Certified Climate Snoozer'],
      'MEAT_HEAVY': ['Certified Climate Snoozer']
    },
    plateProfile: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice', 'Certified Climate Snoozer']
    },
    monthlyDiningOut: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    }
  },
  waste: {
    prevention: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    },
    management: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice', 'Certified Climate Snoozer']
    },
    repairOrReplace: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice', 'Certified Climate Snoozer']
    }
  },
  airQuality: {
    outdoorAirQuality: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer'],
      'E': ['Certified Climate Snoozer']
    },
    aqiMonitoring: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    },
    indoorAirQuality: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    },
    airQualityCommuting: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    },
    airQualityImpact: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    }
  },
  clothing: {
    wardrobeImpact: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice', 'Certified Climate Snoozer']
    },
    mindfulUpgrades: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice', 'Certified Climate Snoozer']
    },
    durability: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice', 'Certified Climate Snoozer']
    },
    consumptionFrequency: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    },
    brandLoyalty: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    }
  }
}; 