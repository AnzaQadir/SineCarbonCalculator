import { Leaf, Droplet, Shirt, Wind } from 'lucide-react';

export const impactMappings = {
  homeEnergy: {
    RENEWABLE: {
      title: "Green Energy Home ⚡️",
      impact: "You reduce your household CO₂ by up to 50% with renewables!",
      details: "Based on your answer to the home energy question.",
      icon: Leaf,
      iconClass: "h-6 w-6 text-green-600",
    },
    EFFICIENT: {
      title: "Efficiency Expert 🏡",
      impact: "Your energy upgrades save you money and emissions every year.",
      details: "Based on your answer to the home energy question.",
      icon: Leaf,
      iconClass: "h-6 w-6 text-emerald-400",
    },
    STANDARD: {
      title: "Standard Home",
      impact: "Consider switching to renewables or upgrading appliances for big savings!",
      details: "Based on your answer to the home energy question.",
      icon: Leaf,
      iconClass: "h-6 w-6 text-gray-400",
    },
  },
  waste: {
    RECYCLER: {
      title: "Recycling Pro ♻️",
      impact: "You divert hundreds of kg of waste from landfill each year!",
      details: "Based on your answer to the waste question.",
      icon: Leaf,
      iconClass: "h-6 w-6 text-purple-500",
    },
    COMPOSTER: {
      title: "Compost Champion 🌱",
      impact: "You reduce methane emissions and enrich the soil by composting!",
      details: "Based on your answer to the waste question.",
      icon: Leaf,
      iconClass: "h-6 w-6 text-yellow-500",
    },
    MINIMALIST: {
      title: "Waste Minimalist 🗑️",
      impact: "You keep your waste footprint small—great job!",
      details: "Based on your answer to the waste question.",
      icon: Leaf,
      iconClass: "h-6 w-6 text-blue-400",
    },
    STANDARD: {
      title: "Room to Improve",
      impact: "Try recycling or composting to make a big difference!",
      details: "Based on your answer to the waste question.",
      icon: Leaf,
      iconClass: "h-6 w-6 text-gray-400",
    },
  },
}; 