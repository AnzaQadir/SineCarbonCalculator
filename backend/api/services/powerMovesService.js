"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerMovesService = void 0;
class PowerMovesService {
    static calculateImpactMetric(user, category) {
        // Calculate a simple impact score based on user responses
        let score = 0;
        let totalPossible = 0;
        switch (category) {
            case 'Transport':
                if (user.primaryTransportMode === 'A')
                    score += 10;
                if (user.carProfile === 'A')
                    score += 10;
                if (user.longDistanceTravel === 'A')
                    score += 10;
                totalPossible = 30;
                break;
            case 'Food':
                if (user.dietType === 'VEGAN')
                    score += 10;
                else if (user.dietType === 'VEGETARIAN')
                    score += 8;
                else if (user.dietType === 'FLEXITARIAN')
                    score += 6;
                if (user.plantBasedMealsPerWeek && parseInt(user.plantBasedMealsPerWeek) >= 4)
                    score += 10;
                totalPossible = 20;
                break;
            case 'Waste':
                if (user.waste?.prevention === 'A')
                    score += 10;
                if (user.waste?.repairOrReplace === 'A')
                    score += 10;
                if (user.waste?.smartShopping === 'A')
                    score += 10;
                totalPossible = 30;
                break;
            case 'Clothing':
                if (user.clothing?.wardrobeImpact === 'A')
                    score += 10;
                if (user.clothing?.mindfulUpgrades === 'A')
                    score += 10;
                if (user.clothing?.brandLoyalty === 'A')
                    score += 10;
                totalPossible = 30;
                break;
            case 'Energy':
                if (user.homeEfficiency === 'A')
                    score += 10;
                if (user.energyManagement === 'A')
                    score += 10;
                totalPossible = 20;
                break;
            case 'Air Quality':
                if (user.airQuality?.aqiMonitoring === 'A')
                    score += 10;
                if (user.airQuality?.outdoorAirQuality === 'A')
                    score += 10;
                totalPossible = 20;
                break;
        }
        const percentage = Math.round((score / totalPossible) * 100);
        return `🐼 Guilt-Free Score: ${percentage}%`;
    }
    static determinePersonalityType(user) {
        if (!user.personalityTraits)
            return 'intuitive'; // Default fallback
        const decisionCounts = { analyst: 0, intuitive: 0, connector: 0 };
        const actionCounts = { planner: 0, experimenter: 0, collaborator: 0 };
        Object.entries(user.personalityTraits).forEach(([key, value]) => {
            if (key.startsWith('decisionMaking') && typeof value === 'string' && value in decisionCounts) {
                decisionCounts[value]++;
            }
            if (key.startsWith('actionTaking') && typeof value === 'string' && value in actionCounts) {
                actionCounts[value]++;
            }
        });
        // Return the dominant decision style
        const maxDecision = Math.max(...Object.values(decisionCounts));
        for (const [style, count] of Object.entries(decisionCounts)) {
            if (count === maxDecision)
                return style;
        }
        return 'intuitive'; // Default fallback
    }
    static detectPowerMoves(userResponse) {
        const powerMoves = [];
        const personalityType = this.determinePersonalityType(userResponse);
        // Check each rule and add matching power moves
        Object.entries(this.POWER_MOVE_RULES).forEach(([id, rule]) => {
            if (rule.trigger(userResponse)) {
                const powerMove = {
                    id,
                    category: rule.category,
                    badge: rule.badge,
                    affirmation: rule.affirmation,
                    nextMove: rule.nextMove,
                    impactMetric: this.calculateImpactMetric(userResponse, rule.category),
                    personaTieIn: rule.personalityTieIn?.[personalityType] ||
                        `This aligns with your ${personalityType} style.`
                };
                powerMoves.push(powerMove);
            }
        });
        // Sort by impact (we can add more sophisticated sorting later)
        powerMoves.sort((a, b) => {
            const aScore = parseInt(a.impactMetric?.match(/\d+/)?.[0] || '0');
            const bScore = parseInt(b.impactMetric?.match(/\d+/)?.[0] || '0');
            return bScore - aScore;
        });
        // Limit to top 3 power moves
        const topPowerMoves = powerMoves.slice(0, 3);
        return {
            powerMoves: topPowerMoves,
            totalCount: powerMoves.length,
            topMove: topPowerMoves.length > 0 ? topPowerMoves[0] : undefined
        };
    }
    static getPowerMoveById(id) {
        const rule = this.POWER_MOVE_RULES[id];
        if (!rule)
            return null;
        return {
            id,
            category: rule.category,
            badge: rule.badge,
            affirmation: rule.affirmation,
            nextMove: rule.nextMove
        };
    }
}
exports.PowerMovesService = PowerMovesService;
PowerMovesService.POWER_MOVE_RULES = {
    // Transport Rules
    lowCarbonCommute: {
        category: 'Transport',
        trigger: (user) => user.primaryTransportMode === 'A',
        badge: '🚲 Low-Carbon Commuter',
        affirmation: 'You already walk, bike, or take transit daily. That\'s powerful.',
        nextMove: 'Try logging your car-free days or exploring carbon-free weekends.',
        personalityTieIn: {
            analyst: 'That\'s exactly how a data-driven approach builds consistent impact.',
            intuitive: 'You\'re naturally choosing the path that feels right.',
            connector: 'You\'re setting an example others can follow.'
        }
    },
    efficientVehicle: {
        category: 'Transport',
        trigger: (user) => user.carProfile === 'A' || user.carProfile === 'B',
        badge: '⚡ Efficient Driver',
        affirmation: 'You choose fuel-efficient vehicles. Smart thinking.',
        nextMove: 'Consider carpooling for one trip this week.',
        personalityTieIn: {
            analyst: 'You\'ve calculated the most efficient option.',
            intuitive: 'You naturally gravitate toward sustainable choices.',
            connector: 'You\'re making choices that benefit everyone.'
        }
    },
    // Food Rules
    plantBasedHero: {
        category: 'Food',
        trigger: (user) => user.dietType === 'VEGAN' || user.dietType === 'VEGETARIAN',
        badge: '🥦 Plant-Based Pro',
        affirmation: 'You lean into planet-friendly meals. Every plate counts.',
        nextMove: 'Try one "Meatless Monday" for consistency.',
        personalityTieIn: {
            analyst: 'You\'ve researched the most impactful dietary choices.',
            intuitive: 'You naturally choose foods that feel good for the planet.',
            connector: 'You\'re inspiring others with your food choices.'
        }
    },
    flexitarianChampion: {
        category: 'Food',
        trigger: (user) => user.dietType === 'FLEXITARIAN' || (user.plantBasedMealsPerWeek && parseInt(user.plantBasedMealsPerWeek) >= 4),
        badge: '🌱 Flexitarian Champion',
        affirmation: 'You\'re balancing taste with impact. That\'s thoughtful.',
        nextMove: 'Try adding one more plant-based meal this week.',
        personalityTieIn: {
            analyst: 'You\'ve found the perfect balance of nutrition and impact.',
            intuitive: 'You trust your instincts about what feels right.',
            connector: 'You\'re showing others that small changes add up.'
        }
    },
    // Waste Rules
    repairChampion: {
        category: 'Waste',
        trigger: (user) => user.waste?.repairOrReplace === 'A',
        badge: '🧵 Repair Champion',
        affirmation: 'You fix before replacing. That\'s the circular mindset we love.',
        nextMove: 'Share your repair skills with a friend this month.',
        personalityTieIn: {
            analyst: 'You\'ve calculated the long-term value of repair.',
            intuitive: 'You naturally prefer fixing over discarding.',
            connector: 'You\'re building a community of repair enthusiasts.'
        }
    },
    wasteWarrior: {
        category: 'Waste',
        trigger: (user) => user.waste?.prevention === 'A' || user.waste?.prevention === 'B',
        badge: '♻️ Waste Warrior',
        affirmation: 'You prevent waste before it happens. That\'s proactive.',
        nextMove: 'Try a zero-waste challenge for one day this week.',
        personalityTieIn: {
            analyst: 'You\'ve analyzed your waste streams and optimized them.',
            intuitive: 'You naturally avoid unnecessary waste.',
            connector: 'You\'re leading by example in waste reduction.'
        }
    },
    // Clothing Rules
    ethicalFashionista: {
        category: 'Clothing',
        trigger: (user) => user.clothing?.wardrobeImpact === 'A' && user.clothing?.consumptionFrequency === 'A',
        badge: '👗 Ethical Fashionista',
        affirmation: 'You choose quality over quantity. That\'s sustainable style.',
        nextMove: 'Host a clothing swap with friends this month.',
        personalityTieIn: {
            analyst: 'You\'ve researched the most sustainable fashion choices.',
            intuitive: 'You naturally choose pieces that feel right.',
            connector: 'You\'re building a community of conscious consumers.'
        }
    },
    mindfulShopper: {
        category: 'Clothing',
        trigger: (user) => user.clothing?.brandLoyalty === 'A' || user.clothing?.mindfulUpgrades === 'A',
        badge: '🛍️ Mindful Shopper',
        affirmation: 'You shop with intention. That\'s powerful consumerism.',
        nextMove: 'Try thrifting for your next purchase.',
        personalityTieIn: {
            analyst: 'You\'ve researched brands that align with your values.',
            intuitive: 'You trust your instincts about which brands to support.',
            connector: 'You\'re influencing others with your shopping choices.'
        }
    },
    // Energy Rules
    energyEfficient: {
        category: 'Energy',
        trigger: (user) => user.homeEfficiency === 'A',
        badge: '💡 Energy Efficient',
        affirmation: 'You prioritize energy efficiency. That\'s smart home management.',
        nextMove: 'Try a "Switch-Off Sunday" this week.',
        personalityTieIn: {
            analyst: 'You\'ve optimized your home for maximum efficiency.',
            intuitive: 'You naturally gravitate toward energy-saving habits.',
            connector: 'You\'re showing others how to live efficiently.'
        }
    },
    renewableChampion: {
        category: 'Energy',
        trigger: (user) => user.energyManagement === 'A',
        badge: '☀️ Renewable Champion',
        affirmation: 'You choose clean energy. That\'s forward-thinking.',
        nextMove: 'Consider one small energy upgrade this month.',
        personalityTieIn: {
            analyst: 'You\'ve calculated the long-term benefits of renewable energy.',
            intuitive: 'You naturally choose the most sustainable energy options.',
            connector: 'You\'re inspiring others to make the switch.'
        }
    },
    // Air Quality Rules
    airQualityAware: {
        category: 'Air Quality',
        trigger: (user) => user.airQuality?.aqiMonitoring === 'A' || user.airQuality?.outdoorAirQuality === 'A',
        badge: '🌬️ Air Quality Aware',
        affirmation: 'You monitor and care about air quality. That\'s health-conscious.',
        nextMove: 'Try a car-free day when air quality is good.',
        personalityTieIn: {
            analyst: 'You\'ve researched the impact of air quality on health.',
            intuitive: 'You naturally choose activities that feel good for your lungs.',
            connector: 'You\'re helping others understand air quality importance.'
        }
    }
};
