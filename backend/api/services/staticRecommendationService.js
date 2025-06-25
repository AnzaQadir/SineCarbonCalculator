"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticRecommendations = getStaticRecommendations;
const STATIC_RECOMMENDATIONS = {
    "Sustainability Slayer": {
        week1: {
            theme: "Wear Your Impact",
            actions: [
                {
                    title: "Inventory Your Closet",
                    description: "Count and assess your wardrobe to avoid unnecessary purchases.",
                    impact: "Reduces fast fashion waste by up to 15kg CO₂",
                    analogy: "Like skipping a 40 km car ride"
                },
                {
                    title: "Buy One Secondhand Item",
                    description: "Replace one fast fashion item with a thrifted piece.",
                    impact: "Saves 25kg CO₂",
                    analogy: "As if your clothes planted a tree"
                }
            ]
        }
    },
    "Planet's Main Character": {
        week1: {
            theme: "Lead the Food Shift",
            actions: [
                {
                    title: "Try a Plant-Based Breakfast",
                    description: "Start your day with plant-powered energy.",
                    impact: "Saves 2.5kg CO₂/day",
                    analogy: "Like skipping a short Uber ride"
                },
                {
                    title: "Host a Meatless Monday Challenge",
                    description: "Get 3 friends to join you and share tips.",
                    impact: "Multiplies savings by x4",
                    analogy: "Turns your table into a mini forest"
                }
            ]
        }
    },
    "Sustainability Soft Launch": {
        week1: {
            theme: "Begin with the Basics",
            actions: [
                {
                    title: "Turn Off Unused Lights",
                    description: "Get into the habit of flipping the switch.",
                    impact: "Saves 1.5kg CO₂/day",
                    analogy: "Like avoiding a phone charge 50x"
                },
                {
                    title: "Shorten Your Showers",
                    description: "Try keeping showers under 5 minutes.",
                    impact: "Saves 40L water/day",
                    analogy: "Enough to hydrate 10 trees"
                }
            ]
        }
    },
    "Kind of Conscious": {
        week1: {
            theme: "Minimize with Intention",
            actions: [
                {
                    title: "Carry a Tote + Bottle",
                    description: "Avoid single-use plastics this week.",
                    impact: "Avoids 10–15 items/week",
                    analogy: "Like pulling 100 plastic forks from the ocean"
                },
                {
                    title: "Buy Nothing Day",
                    description: "Spend 1 day not buying anything new.",
                    impact: "Prevents ~12kg CO₂",
                    analogy: "Like skipping a short-haul flight meal"
                }
            ]
        }
    },
    "Eco in Progress": {
        week1: {
            theme: "Start Where You Are",
            actions: [
                {
                    title: "Use Leftovers for 1 Meal",
                    description: "Turn extras into something new.",
                    impact: "Saves 0.5kg food/day",
                    analogy: "Like rescuing a meal from the trash"
                },
                {
                    title: "Walk Instead of Ride (Once)",
                    description: "Skip one car trip this week.",
                    impact: "Avoids ~7kg CO₂",
                    analogy: "As if you made your shoes grow roots"
                }
            ]
        }
    },
    "Doing Nothing": {
        week1: {
            theme: "Wake-Up Week",
            actions: [
                {
                    title: "Turn Off Devices Overnight",
                    description: "Start by shutting down your laptop and router at night.",
                    impact: "Saves 1.2kg CO₂/night",
                    analogy: "Like giving your planet 8 hours of sleep too"
                },
                {
                    title: "Use a Reusable Bottle",
                    description: "Say no to 1 plastic bottle/day.",
                    impact: "Reduces plastic waste by 365 bottles/year",
                    analogy: "Enough to keep a beach clean for a week"
                }
            ]
        }
    },
    "Climate Snoozer": {
        week1: {
            theme: "First Steps to Awareness",
            actions: [
                {
                    title: "Track Your Trash for 1 Day",
                    description: "Write down what you throw away.",
                    impact: "Creates a baseline for improvement",
                    analogy: "Like finally seeing the map before the journey"
                },
                {
                    title: "Try Streaming in SD",
                    description: "Lower video quality on background TV or YouTube.",
                    impact: "Saves 3.5kg CO₂/month",
                    analogy: "Like turning down the thermostat for your internet"
                }
            ]
        }
    }
};
function getStaticRecommendations(userProfile) {
    // Try to use the most specific personality key
    const keys = [
        userProfile.ecoPersonality,
        userProfile.personality,
        userProfile.personalityType
    ];
    for (const key of keys) {
        if (key && STATIC_RECOMMENDATIONS[key]) {
            return STATIC_RECOMMENDATIONS[key];
        }
    }
    // Fallback: return "Eco in Progress"
    return STATIC_RECOMMENDATIONS["Eco in Progress"];
}
