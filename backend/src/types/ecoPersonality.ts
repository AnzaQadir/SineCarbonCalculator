export type EcoPersonalityType = 
  | 'Sustainability Slayer'
  | 'Eco Warrior'
  | 'Green Guardian'
  | 'Climate Conscious'
  | 'Eco Explorer'
  | 'Green Novice'
  | 'Certified Climate Snoozer';

export const personalityHierarchy: EcoPersonalityType[] = [
  'Sustainability Slayer',
  'Eco Warrior',
  'Green Guardian',
  'Climate Conscious',
  'Eco Explorer',
  'Green Novice',
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
  'Eco Warrior': {
    title: 'Eco Warrior',
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
  'Green Guardian': {
    title: 'Green Guardian',
    description: 'You\'re a reliable steward of the environment! Your consistent efforts make a real difference.',
    strengths: [
      'Solid foundation in sustainable practices',
      'Regular implementation of eco-friendly habits',
      'Growing awareness of environmental impact'
    ],
    nextSteps: [
      'Expand your sustainable practices to new areas',
      'Connect with like-minded individuals',
      'Set specific sustainability goals'
    ]
  },
  'Climate Conscious': {
    title: 'Climate Conscious',
    description: 'You\'re becoming more aware of your environmental impact! Your growing interest in sustainability is promising.',
    strengths: [
      'Basic understanding of sustainability',
      'Willingness to learn and improve',
      'Some implementation of eco-friendly practices'
    ],
    nextSteps: [
      'Learn more about sustainable practices',
      'Start implementing more eco-friendly habits',
      'Track your environmental impact'
    ]
  },
  'Eco Explorer': {
    title: 'Eco Explorer',
    description: 'You\'re beginning your journey into sustainability! Your curiosity about environmental practices is a great start.',
    strengths: [
      'Interest in learning about sustainability',
      'Openness to new eco-friendly practices',
      'Basic awareness of environmental issues'
    ],
    nextSteps: [
      'Research sustainable practices that interest you',
      'Start with small, manageable changes',
      'Connect with sustainability resources'
    ]
  },
  'Green Novice': {
    title: 'Green Novice',
    description: 'You\'re taking your first steps toward sustainability! Every journey begins with awareness.',
    strengths: [
      'Initial interest in environmental issues',
      'Potential for growth in sustainable practices',
      'Basic understanding of environmental impact'
    ],
    nextSteps: [
      'Learn about basic sustainable practices',
      'Start with one eco-friendly habit',
      'Explore environmental resources'
    ]
  },
  'Certified Climate Snoozer': {
    title: 'Certified Climate Snoozer',
    description: 'You\'re at the beginning of your sustainability journey! There\'s plenty of room for growth and positive impact.',
    strengths: [
      'Recognition of the need for change',
      'Potential for significant improvement',
      'Opportunity to make a big difference'
    ],
    nextSteps: [
      'Learn about environmental impact',
      'Start with basic sustainable practices',
      'Set small, achievable sustainability goals'
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
      'PLANT_BASED': ['Sustainability Slayer', 'Eco Warrior'],
      'VEGETARIAN': ['Green Guardian', 'Climate Conscious'],
      'FLEXITARIAN': ['Eco Explorer', 'Green Novice'],
      'MODERATE_MEAT': ['Certified Climate Snoozer']
    },
    foodSource: {
      'LOCAL_SEASONAL': ['Sustainability Slayer', 'Eco Warrior'],
      'MIXED': ['Green Guardian', 'Climate Conscious'],
      'CONVENTIONAL': ['Eco Explorer', 'Green Novice', 'Certified Climate Snoozer']
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
    }
  },
  airQuality: {
    monitoring: {
      'A': ['Sustainability Slayer', 'Eco Warrior'],
      'B': ['Green Guardian', 'Climate Conscious'],
      'C': ['Eco Explorer', 'Green Novice'],
      'D': ['Certified Climate Snoozer']
    },
    impact: {
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