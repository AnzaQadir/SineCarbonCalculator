"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalityService = void 0;
const ecoPersonality_1 = require("../types/ecoPersonality");
class PersonalityService {
    constructor() {
        this.CATEGORY_WEIGHTS = {
            homeEnergy: 0.167, // 16.67%
            transport: 0.167, // 16.67%
            food: 0.167, // 16.67%
            waste: 0.167, // 16.67%
            clothing: 0.167, // 16.67%
            airQuality: 0.165 // 16.5% (to make total 100%)
        };
        this.QUESTION_OPTIONS = {
            A: 10,
            B: 6.66,
            C: 3.33,
            D: 0,
            E: 0
        };
        this.DIET_SCORES = {
            VEGAN: 10,
            VEGETARIAN: 8,
            FLEXITARIAN: 6,
            MEAT_MODERATE: 3,
            MEAT_HEAVY: 0
        };
        this.FOOD_SOURCE_SCORES = {
            A: 10, // Local & Seasonal
            B: 6.66, // Mixed Sources
            C: 3.33 // Mostly Imported
        };
        this.CARBON_VALUES = {
            transport: {
                primaryTransportMode: {
                    A: 200, // Active transport
                    B: 1000, // Public transit
                    C: 2000, // Personal vehicle
                    D: 3000 // Frequent flyer
                },
                carProfile: {
                    A: 100, // Electric vehicle
                    B: 500, // Hybrid vehicle
                    C: 1000, // Standard vehicle
                    D: 1500, // Large vehicle
                    E: 2000 // Luxury vehicle
                },
                longDistanceTravel: {
                    A: 300, // Rail and bus
                    B: 500, // Balanced
                    C: 1500 // Frequent flyer
                }
            },
            food: {
                dietType: {
                    VEGAN: 1000,
                    VEGETARIAN: 1500,
                    FLEXITARIAN: 2500,
                    MEAT_MODERATE: 3500,
                    MEAT_HEAVY: 4500
                },
                plateProfile: {
                    A: 100, // Local & Seasonal
                    B: 250, // Mixed Sources
                    C: 400 // Mostly Imported
                },
                monthlyDiningOut: {
                    A: 100, // <1 a month
                    B: 200, // 1-4 times a month
                    C: 400, // 5-10 times a month
                    D: 600 // >10 times a month
                }
            },
            clothing: {
                wardrobeImpact: {
                    A: 300, // Minimal wardrobe
                    B: 800, // Balanced collection
                    C: 1500 // Extensive wardrobe
                },
                mindfulUpgrades: {
                    A: 200, // Sustainable brands
                    B: 500, // Mixed approach
                    C: 1000 // Conventional shopping
                },
                durability: {
                    A: 200, // Long-lasting items
                    B: 500, // Mixed quality
                    C: 1000 // Fast fashion
                },
                consumptionFrequency: {
                    A: 200, // Infrequent shopper
                    B: 600, // Seasonal shopper
                    C: 1200, // Frequent shopper
                    D: 2000 // Very frequent shopper
                },
                brandLoyalty: {
                    A: 300, // Brand conscious
                    B: 800, // Flexible shopper
                    C: 1300, // Variety seeker
                    D: 100 // Brand loyal
                }
            },
            homeEnergy: {
                homeSize: {
                    '1': 800,
                    '2': 1000,
                    '3': 1300,
                    '4': 1600,
                    '5': 1900,
                    '6': 2200,
                    '7+': 2500
                },
                homeEfficiency: {
                    A: 500, // Energy efficient
                    B: 1000, // Mixed efficiency
                    C: 1500 // Standard home
                },
                energyManagement: {
                    A: 400, // Renewable energy
                    B: 800, // Mixed sources
                    C: 1200 // Traditional grid
                }
            },
            waste: {
                prevention: {
                    A: 50, // Zero waste champion
                    B: 200, // Consistent reuser
                    C: 500, // Occasional reuser
                    D: 1000 // Basic disposer
                },
                smartShopping: {
                    A: 100, // Conscious consumer
                    B: 400, // Balanced shopper
                    C: 1000 // Convenience shopper
                },
                dailyWaste: {
                    A: 100, // Minimal waste
                    B: 300, // Moderate waste
                    C: 600, // Regular waste
                    D: 1000 // High waste
                },
                management: {
                    A: 100, // Advanced management
                    B: 300, // Basic management
                    C: 600 // Limited management
                },
                repairOrReplace: {
                    A: 100, // Always repair
                    B: 300, // Sometimes repair
                    C: 600 // Usually replace
                }
            },
            airQuality: {
                outdoorAirQuality: {
                    A: 100, // Fresh and clean
                    B: 200, // Generally clear
                    C: 400, // Sometimes polluted
                    D: 600, // Not sure
                    E: 800 // Mostly polluted
                },
                aqiMonitoring: {
                    A: 100, // Active monitoring
                    B: 200, // Basic awareness
                    C: 400, // No monitoring
                    D: 600 // Never thought about it
                },
                indoorAirQuality: {
                    A: 100, // Air purifiers & plants
                    B: 300, // Natural ventilation
                    C: 600, // Basic management
                    D: 800 // Not considered
                },
                airQualityCommuting: {
                    A: 100, // Air quality conscious
                    B: 300, // Sometimes considerate
                    C: 600, // Not considered
                    D: 800 // Never thought about it
                },
                airQualityImpact: {
                    A: 100, // Low impact
                    B: 300, // Moderate impact
                    C: 600, // High impact
                    D: 800 // Very high impact
                }
            }
        };
    }
    calculateQuestionScore(value, totalOptions) {
        if (!value)
            return 0;
        // Handle special cases for diet and food source
        if (value in this.DIET_SCORES) {
            return this.DIET_SCORES[value];
        }
        if (value in this.FOOD_SOURCE_SCORES) {
            return this.FOOD_SOURCE_SCORES[value];
        }
        // Handle standard A, B, C, D options
        const optionIndex = Object.keys(this.QUESTION_OPTIONS).indexOf(value);
        if (optionIndex === -1)
            return 0;
        return this.QUESTION_OPTIONS[value];
    }
    calculateCategoryScore(category, responses) {
        const subScores = {};
        let totalScore = 0;
        const questions = Object.keys(responses).filter(key => responses[key] !== undefined);
        const totalQuestions = questions.length;
        // Calculate sub-scores for each metric in the category
        questions.forEach(metric => {
            const value = responses[metric];
            if (!value)
                return;
            const score = this.calculateQuestionScore(value, 4); // Assuming 4 options as default
            subScores[metric] = score;
            totalScore += score;
        });
        // Calculate maximum possible score (all A options)
        const maxPossibleScore = totalQuestions * 10; // Each question can score up to 10 points
        const percentage = totalQuestions > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
        // Apply category weight to the score
        const weightedScore = (percentage * this.CATEGORY_WEIGHTS[category]);
        // Debug log
        console.log(`Category ${category} calculation:`, {
            totalScore,
            maxPossibleScore,
            percentage,
            weightedScore,
            questions,
            subScores
        });
        return {
            score: weightedScore || 0, // Ensure we never return undefined
            weight: this.CATEGORY_WEIGHTS[category],
            subScores,
            totalQuestions,
            percentage,
            maxPossibleScore
        };
    }
    calculatePersonalityScores(responses) {
        // Group responses by category for scoring
        const categoryResponses = {
            homeEnergy: {
                homeSize: responses.homeSize,
                homeEfficiency: responses.homeEfficiency,
                energyManagement: responses.energyManagement
            },
            transport: {
                primaryTransportMode: responses.primaryTransportMode,
                carProfile: responses.carProfile,
                longDistanceTravel: responses.longDistanceTravel
            },
            food: {
                dietType: responses.dietType,
                plateProfile: responses.plateProfile,
                monthlyDiningOut: responses.monthlyDiningOut
            },
            waste: responses.waste || {},
            clothing: responses.clothing || {},
            airQuality: responses.airQuality || {}
        };
        // Calculate category scores
        const categoryScores = Object.entries(categoryResponses).reduce((acc, [category, categoryResponses]) => {
            if (!categoryResponses)
                return acc;
            acc[category] = this.calculateCategoryScore(category, categoryResponses);
            return acc;
        }, {});
        // Calculate final score - sum up all category scores
        let finalScore = 0;
        Object.entries(categoryScores).forEach(([category, score]) => {
            if (score && typeof score.score === 'number') {
                finalScore += score.score;
            }
        });
        // Determine personality type based on final score
        const personalityType = this.determinePersonalityType(finalScore);
        return {
            personalityType,
            categoryScores,
            finalScore
        };
    }
    determinePersonalityType(score) {
        if (score >= 80)
            return 'Sustainability Slayer';
        if (score >= 65)
            return "Planet's Main Character";
        if (score >= 50)
            return 'Sustainability Soft Launch';
        if (score >= 35)
            return 'Kind of Conscious, Kind of Confused';
        if (score >= 20)
            return 'Eco in Progress';
        if (score >= 5)
            return 'Doing Nothing for the Planet';
        return 'Certified Climate Snoozer';
    }
    calculateCarbonEmissions(responses) {
        let totalEmissions = 0;
        // Transport emissions
        if (responses.primaryTransportMode) {
            totalEmissions += this.CARBON_VALUES.transport.primaryTransportMode[responses.primaryTransportMode] || 0;
        }
        if (responses.carProfile) {
            totalEmissions += this.CARBON_VALUES.transport.carProfile[responses.carProfile] || 0;
        }
        if (responses.longDistanceTravel) {
            totalEmissions += this.CARBON_VALUES.transport.longDistanceTravel[responses.longDistanceTravel] || 0;
        }
        // Food emissions
        if (responses.dietType) {
            totalEmissions += this.CARBON_VALUES.food.dietType[responses.dietType] || 0;
        }
        if (responses.plateProfile) {
            totalEmissions += this.CARBON_VALUES.food.plateProfile[responses.plateProfile] || 0;
        }
        if (responses.monthlyDiningOut) {
            totalEmissions += this.CARBON_VALUES.food.monthlyDiningOut[responses.monthlyDiningOut] || 0;
        }
        // Clothing emissions
        if (responses.clothing) {
            if (responses.clothing.wardrobeImpact) {
                totalEmissions += this.CARBON_VALUES.clothing.wardrobeImpact[responses.clothing.wardrobeImpact] || 0;
            }
            if (responses.clothing.mindfulUpgrades) {
                totalEmissions += this.CARBON_VALUES.clothing.mindfulUpgrades[responses.clothing.mindfulUpgrades] || 0;
            }
            if (responses.clothing.durability) {
                totalEmissions += this.CARBON_VALUES.clothing.durability[responses.clothing.durability] || 0;
            }
            if (responses.clothing.consumptionFrequency) {
                totalEmissions += this.CARBON_VALUES.clothing.consumptionFrequency[responses.clothing.consumptionFrequency] || 0;
            }
            if (responses.clothing.brandLoyalty) {
                totalEmissions += this.CARBON_VALUES.clothing.brandLoyalty[responses.clothing.brandLoyalty] || 0;
            }
        }
        // Home emissions
        if (responses.homeSize) {
            totalEmissions += this.CARBON_VALUES.homeEnergy.homeSize[responses.homeSize] || 0;
        }
        if (responses.homeEfficiency) {
            totalEmissions += this.CARBON_VALUES.homeEnergy.homeEfficiency[responses.homeEfficiency] || 0;
        }
        if (responses.energyManagement) {
            totalEmissions += this.CARBON_VALUES.homeEnergy.energyManagement[responses.energyManagement] || 0;
        }
        // Waste emissions
        if (responses.waste) {
            if (responses.waste.smartShopping) {
                totalEmissions += this.CARBON_VALUES.waste.smartShopping[responses.waste.smartShopping] || 0;
            }
            if (responses.waste.management) {
                totalEmissions += this.CARBON_VALUES.waste.management[responses.waste.management] || 0;
            }
            if (responses.waste.prevention) {
                totalEmissions += this.CARBON_VALUES.waste.prevention[responses.waste.prevention] || 0;
            }
            if (responses.waste.repairOrReplace) {
                totalEmissions += this.CARBON_VALUES.waste.repairOrReplace[responses.waste.repairOrReplace] || 0;
            }
        }
        // Air Quality emissions
        if (responses.airQuality) {
            if (responses.airQuality.outdoorAirQuality) {
                totalEmissions += this.CARBON_VALUES.airQuality.outdoorAirQuality[responses.airQuality.outdoorAirQuality] || 0;
            }
            if (responses.airQuality.aqiMonitoring) {
                totalEmissions += this.CARBON_VALUES.airQuality.aqiMonitoring[responses.airQuality.aqiMonitoring] || 0;
            }
            if (responses.airQuality.indoorAirQuality) {
                totalEmissions += this.CARBON_VALUES.airQuality.indoorAirQuality[responses.airQuality.indoorAirQuality] || 0;
            }
            if (responses.airQuality.airQualityCommuting) {
                totalEmissions += this.CARBON_VALUES.airQuality.airQualityCommuting[responses.airQuality.airQualityCommuting] || 0;
            }
            if (responses.airQuality.airQualityImpact) {
                totalEmissions += this.CARBON_VALUES.airQuality.airQualityImpact[responses.airQuality.airQualityImpact] || 0;
            }
        }
        return totalEmissions;
    }
    calculateImpactMetrics(responses) {
        const totalEmissions = this.calculateCarbonEmissions(responses);
        const baseEmissions = 16000; // Base emissions to compare against
        const carbonReduced = Math.max(0, baseEmissions - totalEmissions);
        const treesPlanted = Math.round(carbonReduced / 100); // 1 tree absorbs ~100 kg CO2 per year
        return {
            treesPlanted,
            carbonReduced: carbonReduced.toFixed(1),
            communityImpact: Math.round((carbonReduced / baseEmissions) * 100)
        };
    }
    generateImpactHighlights(impactMetrics, dominantCategory, categoryScores) {
        const topCategoryScore = categoryScores[dominantCategory]?.percentage || 0;
        return `You saved **${impactMetrics.carbonReduced} tons of CO₂** — equal to planting **${impactMetrics.treesPlanted} trees** 🌳.\n**Top Category:** ${dominantCategory} (${topCategoryScore}%) — your habits here made a real dent.`;
    }
    generateStoryHighlights(personality, dominantCategory, opportunities) {
        const templates = {
            "Sustainability Slayer": `You are a **Sustainability Slayer** — consistent, impactful, and quietly leading the change.\nYou scored highest in ${dominantCategory}, but there's still untapped potential in ${opportunities[0]} and ${opportunities[1]}.\nYour eco-journey is one of mastery in motion.`,
            "Planet's Main Character": `You are the **Planet's Main Character** — bold, intentional, and always the one to start the movement.\nYou led in ${dominantCategory}, but the plot thickens in ${opportunities[0]}.\nReady for your next starring role?`,
            "Sustainability Soft Launch": `You are a **Sustainability Soft Launch** — curious, open, and starting strong.\nYou've grown roots in ${dominantCategory}, now branch into ${opportunities[0]}.\nSustainability looks good on you.`,
            "Kind of Conscious, Kind of Confused": `You are **Kind of Conscious...** — a work in progress, with moments of brilliance.\nYou did well in ${dominantCategory}, and your next win lies in ${opportunities[0]}.\nNo pressure. Just progress.`,
            "Eco in Progress": `You are an **Eco in Progress** — gentle but intentional.\nYour care shows in ${dominantCategory}, but ${opportunities[0]} and ${opportunities[1]} are areas to grow into.\nKeep blooming.`,
            "Doing Nothing for the Planet": `You've gone from 'Doing Nothing' to **Showing Up**.\nEvery action counts. Start with ${opportunities[0]}, and let your impact grow.\nThis is your Eco Reset.`,
            "Certified Climate Snoozer": `You were a **Climate Snoozer** — but not anymore.\nYou've woken up to the impact of your actions.\nStart with ${opportunities[0]}, and the world will feel the shift.`
        };
        return templates[personality] || templates["Eco in Progress"];
    }
    generatePowerMoves(personality, impactMetrics, badge) {
        const trees = impactMetrics.treesPlanted;
        const co2 = impactMetrics.carbonReduced;
        const nextBadge = "Carbon Strategist"; // You can make this dynamic if you have a badge engine
        const templates = {
            "Sustainability Slayer": [
                `✅ <b>Your Slayer Signature:</b><br>You've mastered sustainable fashion. <b>${trees} trees' worth of CO₂ saved?</b> Iconic.`,
                `🔥 <b>Next Move:</b><br>Challenge a friend to a zero-waste week. Sustainability spreads faster with community.`,
                `🌐 <b>Amplify Your Impact:</b><br>If just 3 friends follow your lead, that's <b>${trees * 3} more trees planted</b> and <b>${(Number(co2) * 0.25).toFixed(1)} tons of CO₂</b> gone.`,
                `🌳 <b>Next Move:</b><br>Plant a tree. It's a small act, but it adds up.`,
                `🌍 <b>Global Impact:</b><br>Your actions are making a difference. Keep it up!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
            ],
            "Planet's Main Character": [
                `🌍 <b>Global Impact:</b><br>You're making a significant impact on the planet. Keep it up!`,
                `🌳 <b>Next Move:</b><br>Plant a tree. It's a small act, but it adds up.`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
            ],
            "Sustainability Soft Launch": [
                `🌳 <b>Next Move:</b><br>Plant a tree. It's a small act, but it adds up.`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
            ],
            "Kind of Conscious, Kind of Confused": [
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
            ],
            "Eco in Progress": [
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
            ],
            "Doing Nothing for the Planet": [
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
            ],
            "Certified Climate Snoozer": [
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
                `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
            ]
        };
        return templates[personality] || templates["Eco in Progress"];
    }
    analyzeBehavioralPatterns(responses) {
        const habitTags = {};
        const goodHabits = [];
        const stretchAreas = [];

        // Transport Analysis
        if (responses.primaryTransportMode === 'A') {
            habitTags.lowCarbonTransport = true;
            goodHabits.push('lowCarbonTransport');
        } else if (responses.primaryTransportMode === 'D') {
            stretchAreas.push('transport');
        }

        if (responses.carProfile === 'A' || responses.carProfile === 'B') {
            habitTags.efficientVehicle = true;
            goodHabits.push('efficientVehicle');
        }

        // Clothing Analysis
        if (responses.clothing?.wardrobeImpact === 'A') {
            habitTags.ethicalFashion = true;
            goodHabits.push('ethicalFashion');
        } else if (responses.clothing?.consumptionFrequency === 'D') {
            stretchAreas.push('clothing');
        }

        // Waste Analysis
        if (responses.waste?.repairOrReplace === 'A') {
            habitTags.circularMindset = true;
            goodHabits.push('circularMindset');
        }

        if (responses.waste?.prevention === 'A' || responses.waste?.prevention === 'B') {
            habitTags.wasteAware = true;
            goodHabits.push('wasteAware');
        } else if (responses.waste?.prevention === 'D') {
            stretchAreas.push('waste');
        }

        // Air Quality Analysis
        if (responses.airQuality?.aqiMonitoring === 'A' || responses.airQuality?.aqiMonitoring === 'B') {
            habitTags.airAware = true;
            goodHabits.push('airAware');
        }

        // Energy Analysis
        if (responses.homeEfficiency === 'A') {
            habitTags.energyEfficient = true;
            goodHabits.push('energyEfficient');
        } else if (responses.energyManagement === 'C') {
            stretchAreas.push('energy');
        }

        // Diet Analysis
        if (responses.dietType === 'VEGAN' || responses.dietType === 'VEGETARIAN') {
            habitTags.plantBasedDiet = true;
            goodHabits.push('plantBasedDiet');
        } else if (responses.dietType === 'MEAT_HEAVY') {
            stretchAreas.push('diet');
        }

        return { goodHabits, stretchAreas, habitTags };
    }

    determinePersonalityArchetype(personalityTraits) {
        const decisionCategories = ['analyst', 'intuitive', 'connector'];
        const actionCategories = ['planner', 'experimenter', 'collaborator'];

        const decisionCounts = { analyst: 0, intuitive: 0, connector: 0 };
        const actionCounts = { planner: 0, experimenter: 0, collaborator: 0 };

        Object.entries(personalityTraits).forEach(([key, value]) => {
            if (key.startsWith('decisionMaking') && decisionCategories.includes(value)) {
                decisionCounts[value] += 1;
            }
            if (key.startsWith('actionTaking') && actionCategories.includes(value)) {
                actionCounts[value] += 1;
            }
        });

        // Helper to pick dominant or random
        const pickDominant = (counts, cats) => {
            const max = Math.max(...cats.map(c => counts[c]));
            if (max === 0) {
                // All neutral – pick random category
                return cats[Math.floor(Math.random() * cats.length)];
            }
            const winners = cats.filter(c => counts[c] === max);
            winners.sort();
            return winners[0];
        };

        const decisionStyle = pickDominant(decisionCounts, decisionCategories);
        const actionStyle = pickDominant(actionCounts, actionCategories);

        // Matrix mapping
        const matrix = {
            analyst: {
                planner: { 
                    type: 'Strategist', 
                    desc: 'You like to know the plan before you start. You analyze data, create systems, and build sustainable habits through careful planning and measurement.' 
                },
                experimenter: { 
                    type: 'Trailblazer', 
                    desc: 'You jump in and see what sticks. You test new approaches, measure results, and optimize based on what works best for your lifestyle.' 
                },
                collaborator: { 
                    type: 'Coordinator', 
                    desc: 'You bring people together for a common goal. You analyze group dynamics, create shared systems, and coordinate collective climate action.' 
                }
            },
            intuitive: {
                planner: { 
                    type: 'Visionary', 
                    desc: 'You see the big picture and sketch out a brighter future. You plan with intuition, create inspiring visions, and build sustainable systems that feel right.' 
                },
                experimenter: { 
                    type: 'Explorer', 
                    desc: 'You learn by doing, then share what works. You trust your instincts, try new things, and discover sustainable solutions through hands-on experience.' 
                },
                collaborator: { 
                    type: 'Catalyst', 
                    desc: 'You spark enthusiasm in others. You intuitively understand what motivates people and create contagious energy for climate action.' 
                }
            },
            connector: {
                planner: { 
                    type: 'Builder', 
                    desc: 'You break big goals into steps. You connect ideas, build bridges between people, and create sustainable systems that grow over time.' 
                },
                experimenter: { 
                    type: 'Networker', 
                    desc: 'You connect dots and share resources. You build relationships, share knowledge, and create networks that amplify climate impact.' 
                },
                collaborator: { 
                    type: 'Steward', 
                    desc: 'You stick with habits that protect what matters. You nurture relationships, maintain sustainable practices, and care for your community and environment.' 
                }
            }
        };

        const resultEntry = matrix[decisionStyle][actionStyle];
        
        return {
            archetype: resultEntry.type,
            decision: decisionStyle.charAt(0).toUpperCase() + decisionStyle.slice(1),
            action: actionStyle.charAt(0).toUpperCase() + actionStyle.slice(1),
            description: resultEntry.desc
        };
    }

    generatePowerMovesBasedOnBehavior(personality, behavioralPatterns, responses) {
        const { goodHabits, stretchAreas, habitTags } = behavioralPatterns;
        const { archetype } = personality;

        // Power Habit Generation
        let powerHabit = '';
        if (goodHabits.length >= 2) {
            const habitDescriptions = {
                lowCarbonTransport: 'You already commute sustainably',
                ethicalFashion: 'You shop thoughtfully and choose sustainable clothing',
                circularMindset: 'You repair and reuse before replacing',
                wasteAware: 'You prevent waste and manage resources wisely',
                airAware: 'You monitor air quality and make informed decisions',
                energyEfficient: 'You prioritize energy efficiency in your home',
                plantBasedDiet: 'You choose plant-based meals regularly'
            };

            const selectedHabit = goodHabits[0]; // Pick the first good habit to highlight
            powerHabit = `${habitDescriptions[selectedHabit] || 'You already practice sustainable habits'} — that's the quiet kind of climate leadership we love.`;
        } else {
            powerHabit = "You're taking steps toward sustainability — every small action counts and builds momentum.";
        }

        // Power Move Generation based on personality and stretch areas
        let powerMove = '';
        let stretchCTA = '';

        const personalityPowerMoves = {
            Strategist: {
                energy: 'Create a 7-day energy tracking system. Monitor one appliance or routine for a week, then optimize based on your data.',
                transport: 'Map out your weekly routes and identify 3 trips you can convert to walking, biking, or public transit.',
                diet: 'Plan your meals for the week to reduce food waste and incorporate 2 more plant-based meals.',
                clothing: 'Audit your wardrobe and create a 30-day capsule wardrobe challenge.',
                waste: 'Set up a waste tracking system for one week to identify your biggest waste sources.'
            },
            Trailblazer: {
                energy: 'Test a new energy-saving hack each week — like unplugging chargers or adjusting your thermostat.',
                transport: 'Try a new transportation mode this week — bike to one errand or take public transit somewhere new.',
                diet: 'Experiment with one new plant-based recipe each week and track which ones you love.',
                clothing: 'Try a clothing swap with friends or visit a thrift store for your next purchase.',
                waste: 'Test a zero-waste alternative for one common item you use daily.'
            },
            Coordinator: {
                energy: 'Organize a "Switch-Off Sunday" with your housemates where you unplug and unwind together.',
                transport: 'Start a carpool group for regular trips or organize a walking group for local errands.',
                diet: 'Host a plant-based potluck with friends to discover new recipes together.',
                clothing: 'Organize a clothing swap party with friends or colleagues.',
                waste: 'Create a shared composting system with neighbors or start a repair café in your community.'
            },
            Visionary: {
                energy: 'Design your ideal sustainable home energy system and start with one small upgrade.',
                transport: 'Envision your ideal sustainable transportation system and take one step toward it this week.',
                diet: 'Imagine your perfect sustainable diet and gradually shift toward it, one meal at a time.',
                clothing: 'Create a vision board for your sustainable wardrobe and start building it piece by piece.',
                waste: 'Design your ideal zero-waste lifestyle and implement one aspect this month.'
            },
            Explorer: {
                energy: 'Discover a new energy-saving technique and share what you learn with friends.',
                transport: 'Explore a new route or transportation option and document your experience.',
                diet: 'Try a new plant-based ingredient or cuisine and share your discoveries.',
                clothing: 'Explore sustainable fashion brands or second-hand shopping in your area.',
                waste: 'Discover a new zero-waste product or technique and test it out.'
            },
            Catalyst: {
                energy: 'Inspire your household to join a 7-day energy challenge with daily check-ins.',
                transport: 'Start a conversation about sustainable transportation options in your community.',
                diet: 'Share your plant-based journey and inspire others to try meatless Mondays.',
                clothing: 'Lead a discussion about sustainable fashion choices with friends or colleagues.',
                waste: 'Spark interest in zero-waste living by sharing your experiences and tips.'
            },
            Builder: {
                energy: 'Build a simple energy monitoring system for your home, starting with one room.',
                transport: 'Create a sustainable transportation plan for your regular routes.',
                diet: 'Build a meal planning system that reduces waste and incorporates more plants.',
                clothing: 'Build a sustainable wardrobe system, starting with a capsule collection.',
                waste: 'Build a waste reduction system for your household, starting with one category.'
            },
            Networker: {
                energy: 'Connect with others who are interested in energy efficiency and share tips.',
                transport: 'Join or start a sustainable transportation group in your community.',
                diet: 'Connect with local farmers or join a community-supported agriculture program.',
                clothing: 'Network with sustainable fashion enthusiasts and share shopping recommendations.',
                waste: 'Connect with local zero-waste groups or start one in your community.'
            },
            Steward: {
                energy: 'Establish a daily energy stewardship routine, like turning off lights when leaving rooms.',
                transport: 'Develop a sustainable transportation routine that becomes second nature.',
                diet: 'Create a sustainable eating routine that honors both your health and the planet.',
                clothing: 'Develop a mindful clothing routine that extends the life of your garments.',
                waste: 'Establish daily waste reduction habits that become automatic over time.'
            }
        };

        // Select the most relevant stretch area and generate appropriate power move
        if (stretchAreas.length > 0) {
            const primaryStretchArea = stretchAreas[0];
            const personalityMoves = personalityPowerMoves[archetype];
            
            if (personalityMoves && personalityMoves[primaryStretchArea]) {
                powerMove = personalityMoves[primaryStretchArea];
            } else {
                // Fallback for areas not covered by personality-specific moves
                const fallbackMoves = {
                    energy: 'Try creating a simple energy tracking system for one week to understand your usage patterns.',
                    transport: 'Experiment with one sustainable transportation option this week.',
                    diet: 'Try incorporating one more plant-based meal into your weekly routine.',
                    clothing: 'Visit a thrift store or clothing swap for your next purchase.',
                    waste: 'Start tracking your waste for one week to identify reduction opportunities.'
                };
                powerMove = fallbackMoves[primaryStretchArea] || 'Choose one small sustainable action to try this week.';
            }
        } else {
            // If no clear stretch areas, suggest a general improvement
            powerMove = `Try creating a 7-day visual tracker to improve one small habit. ${archetype}s like you thrive on small systems.`;
        }

        // Stretch CTA Generation
        const stretchCTAs = {
            Strategist: 'Want to go further? Create a detailed sustainability plan for the next 30 days and track your progress.',
            Trailblazer: 'Want to go further? Challenge yourself to try 3 new sustainable practices this month.',
            Coordinator: 'Want to go further? Organize a sustainability challenge with 3 friends or family members.',
            Visionary: 'Want to go further? Design your ideal sustainable lifestyle and take one step toward it.',
            Explorer: 'Want to go further? Discover and share 3 new sustainable practices with your community.',
            Catalyst: 'Want to go further? Inspire 3 people to join you on your sustainability journey.',
            Builder: 'Want to go further? Build a sustainable system that others can follow and adapt.',
            Networker: 'Want to go further? Connect with 3 new people who share your sustainability interests.',
            Steward: 'Want to go further? Establish a sustainable routine that becomes a lasting habit.'
        };

        stretchCTA = stretchCTAs[archetype] || 'Want to go further? Choose one area to focus on and build sustainable habits over time.';

        return { powerHabit, powerMove, stretchCTA };
    }

    generateComprehensivePowerMoves(responses) {
        // Analyze behavioral patterns
        const behavioralPatterns = this.analyzeBehavioralPatterns(responses);
        
        // Determine personality archetype if personality traits are available
        let personality = {
            archetype: 'Builder',
            decision: 'Connector',
            action: 'Experimenter',
            description: 'You break big goals into steps. You co-create small experiments with others and build lasting systems that grow over time.'
        };

        if (responses.personalityTraits) {
            personality = this.determinePersonalityArchetype(responses.personalityTraits);
        }

        // Generate power moves based on behavior and personality
        const powerMoves = this.generatePowerMovesBasedOnBehavior(personality, behavioralPatterns, responses);

        return {
            personality,
            powerMoves,
            tone: 'supportive, intelligent, honest, warm'
        };
    }

    async calculatePersonality(responses) {
        console.log('Calculating personality for responses:', responses);
        
        const scores = this.calculatePersonalityScores(responses);
        console.log('Calculated scores:', scores);
        
        const impactMetrics = this.calculateImpactMetrics(responses);
        console.log('Calculated impact metrics:', impactMetrics);
        
        const personalityType = scores.personalityType;
        console.log('Determined personality type:', personalityType);
        
        const personalityInfo = ecoPersonality_1.EcoPersonalityTypes[personalityType];
        console.log('Retrieved personality info:', personalityInfo);

        // Generate comprehensive power moves using new system
        const comprehensivePowerMoves = this.generateComprehensivePowerMoves(responses);
        console.log('Generated comprehensive power moves:', comprehensivePowerMoves);

        // Legacy power moves for backward compatibility
        const legacyPowerMoves = this.generatePowerMoves(personalityType, impactMetrics, 'Carbon Strategist');
        console.log('Generated legacy power moves:', legacyPowerMoves);

        const response = {
            personalityType,
            description: personalityInfo.description,
            strengths: personalityInfo.strengths,
            nextSteps: personalityInfo.nextSteps,
            categoryScores: scores.categoryScores,
            impactMetrics,
            finalScore: scores.finalScore,
            powerMoves: legacyPowerMoves, // Keep legacy for backward compatibility
            comprehensivePowerMoves, // New comprehensive power moves structure
            // Return personalityTraits if present in input
            ...(responses.personalityTraits ? { personalityTraits: responses.personalityTraits } : {})
        };
        
        console.log('Final response:', response);
        return response;
    }
    calculateSubCategory(dominantCategory, categoryScores) {
        const score = categoryScores[dominantCategory]?.score || 0;
        switch (dominantCategory) {
            case 'homeEnergy':
                return score >= 70 ? 'Energy Efficiency Expert' : 'Eco Homebody';
            case 'transport':
                return score >= 70 ? 'Green Mobility Champion' : 'Green Traveler';
            case 'food':
                return score >= 70 ? 'Sustainable Food Pioneer' : 'Conscious Consumer';
            case 'waste':
                return score >= 70 ? 'Zero Waste Champion' : 'Zero Waste Warrior';
            default:
                return 'Eco Explorer';
        }
    }
}
exports.PersonalityService = PersonalityService;
