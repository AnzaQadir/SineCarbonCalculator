import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Globe, Award, Leaf, ExternalLink, Sparkles, Trophy, 
  Star, Calendar, Users, Target, ArrowRight, Medal,
  MapPin, Book, Heart, Lightbulb, ArrowUpRight
} from 'lucide-react';
import championImages from '../data/champion-images.json';

interface Achievement {
  title: string;
  description: string;
  year: string;
  icon: React.ReactNode;
}

interface LocalAction {
  title: string;
  description: string;
  impact: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeframe: string;
  participants: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Champion {
  id: string;
  name: string;
  country: string;
  role: string;
  contribution: string;
  quote: string;
  image: string;
  emoji: string;
  category: 'transport' | 'food' | 'waste' | 'home';
  matchReason: string;
  achievements: Achievement[];
  relatedAction: {
    title: string;
    description: string;
    link: string;
    impact: string;
    localActions: LocalAction[];
  };
  timeline: TimelineEvent[];
  impact: {
    people: string;
    region: string;
    focus: string;
    metrics: Record<string, string>;
  };
}

interface ChampionImage {
  name: string;
  image: string;
  fallback: string;
}

const getScoreMessage = (score: number): string => {
  if (score >= 90) return "Outstanding! You're already performing at champion level.";
  if (score >= 75) return "Excellent work! You're well on your way to becoming a climate leader.";
  if (score >= 60) return "Great progress! You're making a real difference.";
  if (score >= 45) return "Good start! You're building momentum for positive change.";
  return "Welcome to your climate journey! Every step counts.";
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getChampionImage = (name: string): { src: string; fallback: string } => {
  const key = name.toLowerCase().replace(/[^a-z]/g, '-');
  const championImage = (championImages as Record<string, ChampionImage>)[key];
  
  // Default to local paths if external URLs are not available
  const defaultImage = '/images/champions/default-champion.png';
  const localImagePath = `/images/champions/${key}.jpg`;
  
  return {
    src: championImage?.image || localImagePath,
    fallback: championImage?.fallback || defaultImage
  };
};

const champions: Record<string, Champion> = {
  transport: {
    id: 'transport',
    name: 'Sonam Wangchuk',
    country: 'India',
    role: 'Innovation Pioneer',
    contribution: 'Invented ice stupas to combat water scarcity in the Himalayas and promotes sustainable mobility solutions',
    quote: "Simple solutions can solve complex environmental challenges.",
    image: '/champions/placeholder.svg',
    emoji: '🚲',
    category: 'transport',
    matchReason: "Like you, Sonam believes in sustainable transportation. Your commitment to reducing transport emissions aligns perfectly with his innovative approach to sustainable mobility.",
    achievements: [
      {
        title: 'Rolex Award for Enterprise',
        description: 'Recognized for innovative climate solutions',
        year: '2016',
        icon: <Trophy className="h-4 w-4" />
      },
      {
        title: 'Ramon Magsaysay Award',
        description: 'For community-driven innovation',
        year: '2018',
        icon: <Medal className="h-4 w-4" />
      },
      {
        title: 'Global Climate Action Award',
        description: 'UNFCCC recognition for mobility solutions',
        year: '2020',
        icon: <Star className="h-4 w-4" />
      }
    ],
    relatedAction: {
      title: 'Expand Your Green Transit Impact',
      description: 'Take your sustainable transport choices to the next level by becoming a local mobility champion.',
      link: 'https://example.com/sustainable-mobility',
      impact: 'Your transport choices could inspire 10+ people in your community to switch to greener options.',
      localActions: [
        {
          title: 'Start a Bike-to-Work Group',
          description: 'Organize weekly group rides to work with colleagues',
          impact: 'Reduce commute emissions by 90%',
          difficulty: 'Easy',
          timeframe: '2-4 weeks',
          participants: '5-10 people'
        },
        {
          title: 'Create a Carpool Network',
          description: 'Build a neighborhood ride-sharing system',
          impact: 'Cut local commute emissions by 50%',
          difficulty: 'Medium',
          timeframe: '1-2 months',
          participants: '10-20 households'
        },
        {
          title: 'Launch an EV Awareness Campaign',
          description: 'Organize local EV showcase events',
          impact: 'Influence 20+ car purchases',
          difficulty: 'Hard',
          timeframe: '3-6 months',
          participants: '50+ community members'
        }
      ]
    },
    timeline: [
      {
        year: '1966',
        title: 'Early Years',
        description: 'Born in Ladakh, grew up witnessing the challenges of mountain communities',
        icon: <Heart className="h-4 w-4" />
      },
      {
        year: '1988',
        title: 'Education Innovation',
        description: 'Founded SECMOL to reform education in mountain regions',
        icon: <Book className="h-4 w-4" />
      },
      {
        year: '2014',
        title: 'Ice Stupa Project',
        description: 'Invented artificial glaciers to address water scarcity',
        icon: <Lightbulb className="h-4 w-4" />
      },
      {
        year: '2016',
        title: 'Global Recognition',
        description: 'Received Rolex Award for Enterprise for innovative climate solutions',
        icon: <Trophy className="h-4 w-4" />
      },
      {
        year: '2018',
        title: 'Community Impact',
        description: 'Ramon Magsaysay Award for transforming education and ecology',
        icon: <Users className="h-4 w-4" />
      }
    ],
    impact: {
      people: '12,000+ students',
      region: 'Himalayan Region',
      focus: 'Education & Innovation',
      metrics: {
        water: '50M+ liters saved',
        education: '1000+ schools impacted',
        innovation: '30+ ice stupas built'
      }
    }
  },
  food: {
    id: 'food',
    name: 'Vanessa Nakate',
    country: 'Uganda',
    role: 'Climate Justice Advocate',
    contribution: 'Advocates for sustainable agriculture and food security in Africa',
    quote: "Climate action must include food justice. Every meal choice matters.",
    image: '/champions/placeholder.svg',
    emoji: '🌱',
    category: 'food',
    matchReason: "Your mindful food choices mirror Vanessa's advocacy for sustainable food systems. Like her, you understand that our food choices have global impacts.",
    achievements: [
      {
        title: "TIME100 Next",
        description: "Named one of the world's most influential people",
        year: "2021",
        icon: <Star className="h-4 w-4" />
      },
      {
        title: "Young Climate Champion",
        description: "UN recognition for climate advocacy",
        year: "2020",
        icon: <Medal className="h-4 w-4" />
      },
      {
        title: "Africa Climate Leader",
        description: "For promoting sustainable agriculture",
        year: "2019",
        icon: <Trophy className="h-4 w-4" />
      }
    ],
    relatedAction: {
      title: 'Amplify Your Food Impact',
      description: 'Start a community garden or food waste reduction initiative in your neighborhood.',
      link: 'https://example.com/food-action',
      impact: 'You could help reduce local food waste by 30% and inspire sustainable eating habits.',
      localActions: [
        {
          title: 'Start a Community Garden',
          description: 'Transform unused space into a productive garden',
          impact: 'Produce 500+ kg of local food annually',
          difficulty: 'Medium',
          timeframe: '2-3 months',
          participants: '10-15 families'
        },
        {
          title: 'Launch a Food Waste Program',
          description: 'Organize community composting and food sharing',
          impact: 'Reduce local food waste by 40%',
          difficulty: 'Easy',
          timeframe: '1-2 months',
          participants: '20+ households'
        },
        {
          title: 'Create a Local Food Network',
          description: 'Connect local farmers with consumers',
          impact: 'Support 10+ local farms',
          difficulty: 'Hard',
          timeframe: '4-6 months',
          participants: '100+ community members'
        }
      ]
    },
    timeline: [
      {
        year: '1996',
        title: 'Early Inspiration',
        description: 'Born in Kampala, Uganda, witnessing climate impacts on agriculture',
        icon: <Heart className="h-4 w-4" />
      },
      {
        year: '2019',
        title: 'Climate Strike',
        description: 'Started Fridays for Future Uganda, inspiring youth action',
        icon: <Users className="h-4 w-4" />
      },
      {
        year: '2020',
        title: 'Global Voice',
        description: 'Named UN Young Leader for the SDGs',
        icon: <Globe className="h-4 w-4" />
      },
      {
        year: '2021',
        title: 'TIME100 Impact',
        description: "Recognized as one of TIME's most influential people",
        icon: <Star className="h-4 w-4" />
      },
      {
        year: '2022',
        title: 'Rise Up Movement',
        description: 'Founded Rise Up Movement for climate and food justice',
        icon: <Lightbulb className="h-4 w-4" />
      }
    ],
    impact: {
      people: '100,000+ youth engaged',
      region: 'East Africa',
      focus: 'Climate Justice & Food Security',
      metrics: {
        trees: '200,000+ planted',
        communities: '50+ supported',
        campaigns: '100+ launched'
      }
    }
  },
  waste: {
    id: 'waste',
    name: 'Jane Goodall',
    country: 'United Kingdom',
    role: 'Conservation Leader',
    contribution: 'Pioneered waste reduction in conservation efforts and promotes circular living',
    quote: "What you do makes a difference, and you have to decide what kind of difference you want to make.",
    image: '/champions/placeholder.svg',
    emoji: '♻️',
    category: 'waste',
    matchReason: "Your dedication to waste reduction echoes Jane's lifelong commitment to conservation. You both understand that every piece of waste avoided matters.",
    achievements: [
      {
        title: 'UN Messenger of Peace',
        description: 'Lifetime achievement in conservation',
        year: '2002',
        icon: <Trophy className="h-4 w-4" />
      },
      {
        title: 'DBE Award',
        description: 'For services to environment',
        year: '2004',
        icon: <Medal className="h-4 w-4" />
      },
      {
        title: 'Lifetime Achievement',
        description: 'Time Magazine Environmental Award',
        year: '2021',
        icon: <Star className="h-4 w-4" />
      }
    ],
    relatedAction: {
      title: 'Lead Zero-Waste Initiatives',
      description: 'Start a neighborhood zero-waste challenge and share your successful waste reduction strategies.',
      link: 'https://example.com/zero-waste',
      impact: 'Your actions could prevent 1000+ kg of waste from reaching landfills annually.',
      localActions: [
        {
          title: 'Start a Recycling Education Program',
          description: 'Teach proper recycling techniques',
          impact: 'Improve recycling rates by 60%',
          difficulty: 'Easy',
          timeframe: '1-2 months',
          participants: '50+ households'
        },
        {
          title: 'Create a Community Repair Cafe',
          description: 'Monthly events to fix broken items',
          impact: 'Save 100+ items from landfill',
          difficulty: 'Medium',
          timeframe: '2-3 months',
          participants: '15-20 volunteers'
        },
        {
          title: 'Launch a Zero-Waste Business Program',
          description: 'Help local businesses reduce waste',
          impact: 'Convert 10+ businesses to zero-waste',
          difficulty: 'Hard',
          timeframe: '6-12 months',
          participants: '25+ businesses'
        }
      ]
    },
    timeline: [
      {
        year: '1934',
        title: 'Early Passion',
        description: 'Born in London, developed early love for nature and animals',
        icon: <Heart className="h-4 w-4" />
      },
      {
        year: '1960',
        title: 'Groundbreaking Research',
        description: 'Began revolutionary chimpanzee research in Gombe',
        icon: <Book className="h-4 w-4" />
      },
      {
        year: '1977',
        title: 'Global Institute',
        description: 'Founded the Jane Goodall Institute for conservation',
        icon: <Globe className="h-4 w-4" />
      },
      {
        year: '2002',
        title: 'UN Recognition',
        description: 'Appointed as UN Messenger of Peace',
        icon: <Award className="h-4 w-4" />
      },
      {
        year: '2021',
        title: 'Lifetime Achievement',
        description: "Received Templeton Prize for life's work",
        icon: <Trophy className="h-4 w-4" />
      }
    ],
    impact: {
      people: '1M+ youth mobilized',
      region: 'Global',
      focus: 'Conservation & Education',
      metrics: {
        research: '60+ years of data',
        programs: '65+ countries reached',
        conservation: '5M+ acres protected'
      }
    }
  },
  home: {
    id: 'home',
    name: 'Dr. Katharine Hayhoe',
    country: 'United States',
    role: 'Climate Scientist',
    contribution: 'Champions home energy efficiency and community-based climate solutions',
    quote: "The most important thing you can do to fight climate change is to talk about it.",
    image: '/champions/placeholder.svg',
    emoji: '🏡',
    category: 'home',
    matchReason: "Your focus on home energy efficiency aligns with Dr. Hayhoe's practical approach to climate action. You both show that change starts at home.",
    achievements: [
      {
        title: 'UN Champion of the Earth',
        description: 'For climate communication',
        year: '2019',
        icon: <Trophy className="h-4 w-4" />
      },
      {
        title: 'Climate Breakthrough Award',
        description: 'For innovative solutions',
        year: '2020',
        icon: <Star className="h-4 w-4" />
      },
      {
        title: 'Stephen H. Schneider Award',
        description: 'For climate science communication',
        year: '2018',
        icon: <Medal className="h-4 w-4" />
      }
    ],
    relatedAction: {
      title: 'Create a Green Home Hub',
      description: 'Transform your home into a model of sustainability and host eco-home tours for neighbors.',
      link: 'https://example.com/green-home',
      impact: 'Your home could inspire 20+ households to adopt energy-efficient practices.',
      localActions: [
        {
          title: 'Host Green Home Tours',
          description: 'Showcase your sustainable home features',
          impact: 'Inspire 15+ home upgrades',
          difficulty: 'Easy',
          timeframe: '1 month',
          participants: '30+ visitors'
        },
        {
          title: 'Create an Energy Saving Group',
          description: 'Form a neighborhood energy efficiency club',
          impact: 'Reduce community energy use by 25%',
          difficulty: 'Medium',
          timeframe: '2-3 months',
          participants: '10-15 households'
        },
        {
          title: 'Launch a Solar Co-op',
          description: 'Organize group solar panel purchases',
          impact: 'Install 50+ kW of solar capacity',
          difficulty: 'Hard',
          timeframe: '6-8 months',
          participants: '20+ households'
        }
      ]
    },
    timeline: [
      {
        year: '1972',
        title: 'Scientific Beginnings',
        description: 'Born in Illinois, developed early interest in science',
        icon: <Heart className="h-4 w-4" />
      },
      {
        year: '1995',
        title: 'Climate Focus',
        description: 'Completed PhD in atmospheric science',
        icon: <Book className="h-4 w-4" />
      },
      {
        year: '2009',
        title: 'Communication Pioneer',
        description: 'Started bridging science and faith communities',
        icon: <Users className="h-4 w-4" />
      },
      {
        year: '2019',
        title: 'Global Recognition',
        description: 'Named UN Champion of the Earth',
        icon: <Globe className="h-4 w-4" />
      },
      {
        year: '2021',
        title: 'Chief Scientist',
        description: 'Appointed as Chief Scientist at The Nature Conservancy',
        icon: <Award className="h-4 w-4" />
      }
    ],
    impact: {
      people: '5M+ reached',
      region: 'North America',
      focus: 'Climate Communication',
      metrics: {
        talks: '1000+ presentations',
        research: '125+ peer-reviewed papers',
        media: '500+ interviews'
      }
    }
  }
};

interface ClimateChampionsProps {
  onActionSelect: (action: Champion['relatedAction']) => void;
  dominantCategory: 'transport' | 'food' | 'waste' | 'home';
  userScore: number;
}

export const ClimateChampions: React.FC<ClimateChampionsProps> = ({
  onActionSelect,
  dominantCategory,
  userScore
}) => {
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [imageError, setImageError] = useState(false);
  const champion = champions[dominantCategory];
  const scoreMessage = getScoreMessage(userScore);
  const championImage = getChampionImage(champion.name);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load, using fallback');
    setImageError(true);
    const img = e.target as HTMLImageElement;
    const { fallback } = getChampionImage(champion.name);
    if (img.src !== fallback) {
      img.src = fallback;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="overflow-hidden bg-white border-0 shadow-lg rounded-3xl">
        <div className="p-12 lg:p-16">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-start gap-16">
            {/* Left Column - Champion Profile */}
            <div className="w-full lg:w-1/3">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-10">
                <img
                  src={imageError ? championImage.fallback : championImage.src}
                  alt={champion.name}
                  className="w-full aspect-square object-cover"
                  onError={handleImageError}
                  loading="eager"
                />
                <div className="absolute bottom-5 left-5 space-y-2">
                  <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm px-4 py-2 text-base">
                    <Globe className="h-4 w-4 mr-2 text-green-600" />
                    {champion.country}
                  </Badge>
                  <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm px-4 py-2 text-base">
                    <Award className="h-4 w-4 mr-2 text-green-600" />
                    {champion.role}
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-base text-gray-500">Impact</p>
                    <p className="text-lg font-semibold">{champion.impact.people}</p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500">Region</p>
                    <p className="text-lg font-semibold">{champion.impact.region}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Champion Info */}
            <div className="flex-1 min-w-0 space-y-10">
              <div>
                <h2 className="text-4xl font-serif mb-4">{champion.name}</h2>
                <p className="text-2xl text-gray-600">{champion.contribution}</p>
              </div>

              <blockquote className="text-2xl text-gray-600 italic bg-gray-50 rounded-2xl p-8">
                {champion.quote}
              </blockquote>

              {/* Key Achievement */}
              {champion.achievements[0] && (
                <div className="bg-green-50 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-3">
                    {champion.achievements[0].icon}
                    <span className="text-lg text-gray-500">{champion.achievements[0].year}</span>
                  </div>
                  <h4 className="text-2xl font-semibold">{champion.achievements[0].title}</h4>
                  <p className="text-lg text-gray-600">{champion.achievements[0].description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Section */}
          <div className="mt-16 pt-10 border-t">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-serif text-gray-900 mb-4">Join the Movement</h3>
              <p className="text-xl text-gray-600">{champion.relatedAction.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {champion.relatedAction.localActions.slice(0, 2).map((action, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-100 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h4 className="text-2xl font-semibold">{action.title}</h4>
                    <Badge className={cn(
                      "shrink-0 px-4 py-2 text-base font-medium rounded-full",
                      getDifficultyColor(action.difficulty)
                    )}>
                      {action.difficulty}
                    </Badge>
                  </div>
                  <p className="text-lg text-gray-600 mb-4">{action.description}</p>
                  <div className="flex items-center gap-3 text-lg text-green-600">
                    <Target className="h-5 w-5" />
                    <span>{action.impact}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-2xl shadow-md hover:shadow-lg text-xl font-semibold transition-all duration-300"
                onClick={() => onActionSelect(champion.relatedAction)}
              >
                Join {champion.name}'s Mission
                <ArrowUpRight className="h-5 w-5 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}; 