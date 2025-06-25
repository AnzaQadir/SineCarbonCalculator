"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalityService = void 0;
const ecoPersonality_1 = require("../types/ecoPersonality");
class PersonalityService {
    constructor() {
        this.CATEGORY_WEIGHTS = {
            homeEnergy: 0.2, // 20%
            transport: 0.2, // 20%
            food: 0.2, // 20%
            waste: 0.2, // 20%
            clothing: 0.2 // 20%
        };
        this.QUESTION_OPTIONS = {
            A: 10,
            B: 6.66,
            C: 3.33,
            D: 0,
            E: 0
        };
        this.DIET_SCORES = {
            PLANT_BASED: 10,
            VEGETARIAN: 6.66,
            FLEXITARIAN: 3.33,
            MODERATE_MEAT: 0
        };
        this.FOOD_SOURCE_SCORES = {
            LOCAL_SEASONAL: 10,
            MIXED: 6.66,
            CONVENTIONAL: 3.33
        };
        this.CARBON_VALUES = {
            transport: {
                dailyCommute: {
                    A: 200,
                    B: 1000,
                    C: 2000,
                    D: 3000
                },
                longDistanceTravel: {
                    A: 300,
                    B: 500,
                    C: 1500,
                    D: 3000,
                    E: 1800
                }
            },
            food: {
                dietType: {
                    A: 1000, // plant-based
                    B: 2500, // mixed
                    C: 4000 // meat-heavy
                },
                homeCooking: {
                    A: 100,
                    B: 300,
                    C: 600
                },
                localProduce: {
                    A: 100,
                    B: 250,
                    C: 400,
                    D: 600,
                    E: 700
                }
            },
            clothing: {
                wardrobeImpact: {
                    A: 300,
                    B: 800,
                    C: 1500
                },
                closetUpgrades: {
                    A: 200,
                    B: 500,
                    C: 1000
                },
                consumptionFrequency: {
                    A: 2000,
                    B: 1200,
                    C: 600,
                    D: 300
                },
                brandLoyalty: {
                    A: 300,
                    B: 800,
                    C: 1300,
                    D: 100
                }
            },
            home: {
                homeScale: {
                    '1': 800,
                    '2': 1000,
                    '3': 1300,
                    '4': 1600,
                    '5': 1900,
                    '6': 2200,
                    '7+': 2500
                },
                ecoUpgrades: {
                    A: 500,
                    B: 1500,
                    C: 2500
                },
                dailyEnergy: {
                    A: 400,
                    B: 1000,
                    C: 1800
                }
            },
            waste: {
                shoppingHabits: {
                    A: 100,
                    B: 400,
                    C: 1000
                },
                trashHandling: {
                    A: 100,
                    B: 400,
                    C: 200,
                    D: 1000
                },
                preventingWaste: {
                    A: 50,
                    B: 200,
                    C: 500,
                    D: 1000
                },
                repairOrReplace: {
                    true: 0,
                    false: 500
                }
            },
            airQuality: {
                perceivedAir: {
                    A: 100,
                    B: 200,
                    C: 400,
                    D: 600
                },
                aqiCheck: {
                    A: 100,
                    B: 200,
                    C: 400,
                    D: 600
                },
                indoorAir: {
                    A: 100,
                    B: 300,
                    C: 600,
                    D: 800
                },
                commuteChoices: {
                    A: 100,
                    B: 300,
                    C: 600,
                    D: 800
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
        // Calculate category scores
        const categoryScores = Object.entries(responses).reduce((acc, [category, categoryResponses]) => {
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
        if (responses.transport) {
            if (responses.transport.primary) {
                totalEmissions += this.CARBON_VALUES.transport.dailyCommute[responses.transport.primary] || 0;
            }
            if (responses.transport.longDistance) {
                totalEmissions += this.CARBON_VALUES.transport.longDistanceTravel[responses.transport.longDistance] || 0;
            }
        }
        // Food emissions
        if (responses.food) {
            if (responses.food.dietType) {
                const dietType = responses.food.dietType === 'PLANT_BASED' ? 'A' :
                    responses.food.dietType === 'VEGETARIAN' ? 'B' : 'C';
                totalEmissions += this.CARBON_VALUES.food.dietType[dietType] || 0;
            }
            if (responses.food.foodSource) {
                const foodSource = responses.food.foodSource === 'LOCAL_SEASONAL' ? 'A' :
                    responses.food.foodSource === 'MIXED' ? 'B' : 'C';
                totalEmissions += this.CARBON_VALUES.food.localProduce[foodSource] || 0;
            }
        }
        // Clothing emissions
        if (responses.clothing) {
            if (responses.clothing.wardrobeImpact) {
                totalEmissions += this.CARBON_VALUES.clothing.wardrobeImpact[responses.clothing.wardrobeImpact] || 0;
            }
            if (responses.clothing.mindfulUpgrades) {
                totalEmissions += this.CARBON_VALUES.clothing.closetUpgrades[responses.clothing.mindfulUpgrades] || 0;
            }
            if (responses.clothing.consumptionFrequency) {
                totalEmissions += this.CARBON_VALUES.clothing.consumptionFrequency[responses.clothing.consumptionFrequency] || 0;
            }
            if (responses.clothing.brandLoyalty) {
                totalEmissions += this.CARBON_VALUES.clothing.brandLoyalty[responses.clothing.brandLoyalty] || 0;
            }
        }
        // Home emissions
        if (responses.homeEnergy) {
            if (responses.homeEnergy.homeScale) {
                totalEmissions += this.CARBON_VALUES.home.homeScale[responses.homeEnergy.homeScale] || 0;
            }
            if (responses.homeEnergy.efficiency) {
                totalEmissions += this.CARBON_VALUES.home.ecoUpgrades[responses.homeEnergy.efficiency] || 0;
            }
            if (responses.homeEnergy.management) {
                totalEmissions += this.CARBON_VALUES.home.dailyEnergy[responses.homeEnergy.management] || 0;
            }
        }
        // Waste emissions
        if (responses.waste) {
            if (responses.waste.smartShopping) {
                totalEmissions += this.CARBON_VALUES.waste.shoppingHabits[responses.waste.smartShopping] || 0;
            }
            if (responses.waste.management) {
                totalEmissions += this.CARBON_VALUES.waste.trashHandling[responses.waste.management] || 0;
            }
            if (responses.waste.prevention) {
                totalEmissions += this.CARBON_VALUES.waste.preventingWaste[responses.waste.prevention] || 0;
            }
            if (responses.waste.repairOrReplace !== undefined) {
                totalEmissions += this.CARBON_VALUES.waste.repairOrReplace[responses.waste.repairOrReplace ? 'true' : 'false'] || 0;
            }
        }
        // Air Quality emissions
        if (responses.airQuality) {
            if (responses.airQuality.monitoring) {
                totalEmissions += this.CARBON_VALUES.airQuality.aqiCheck[responses.airQuality.monitoring] || 0;
            }
            if (responses.airQuality.impact) {
                totalEmissions += this.CARBON_VALUES.airQuality.indoorAir[responses.airQuality.impact] || 0;
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
                `🏅 <b>Badge on Deck:</b><br>Complete your next eco action to unlock "${nextBadge}."`
            ],
            "Planet's Main Character": [
                `✅ <b>Your Main Character Move:</b><br>Your leadership in sustainable food choices is inspiring. <b>${trees} trees' worth of CO₂ saved?</b> Star power!`,
                `🔥 <b>Next Move:</b><br>Host a plant-based dinner and share your story on social media.`,
                `🌐 <b>Amplify Your Impact:</b><br>If 3 friends join you, that's <b>${trees * 3} more trees planted</b> and <b>${(Number(co2) * 0.25).toFixed(1)} tons of CO₂</b> gone.`,
                `🏅 <b>Badge on Deck:</b><br>Lead your next event to unlock "${nextBadge}."`
            ],
            "Sustainability Soft Launch": [
                `✅ <b>Your Soft Launch Win:</b><br>You're making mindful swaps. <b>${trees} trees' worth of CO₂ saved?</b> Quietly powerful.`,
                `🔥 <b>Next Move:</b><br>Invite a friend to try a week of plant-based meals with you.`,
                `🌐 <b>Amplify Your Impact:</b><br>With 3 friends, that's <b>${trees * 3} more trees planted</b> and <b>${(Number(co2) * 0.25).toFixed(1)} tons of CO₂</b> gone.`,
                `🏅 <b>Badge on Deck:</b><br>Complete your next eco action to unlock "${nextBadge}."`
            ],
            "Kind of Conscious, Kind of Confused": [
                `✅ <b>Your Conscious Win:</b><br>You're making progress! <b>${trees} trees' worth of CO₂ saved?</b> Every bit counts.`,
                `🔥 <b>Next Move:</b><br>Try one new sustainable habit this week and share your experience.`,
                `🌐 <b>Amplify Your Impact:</b><br>If 3 friends follow, that's <b>${trees * 3} more trees planted</b> and <b>${(Number(co2) * 0.25).toFixed(1)} tons of CO₂</b> gone.`,
                `🏅 <b>Badge on Deck:</b><br>Keep going to unlock "${nextBadge}."`
            ],
            "Eco in Progress": [
                `✅ <b>Your Progress Move:</b><br>Small steps, big difference. <b>${trees} trees' worth of CO₂ saved?</b> Keep blooming.`,
                `🔥 <b>Next Move:</b><br>Encourage a friend to join you for a recycling challenge.`,
                `🌐 <b>Amplify Your Impact:</b><br>With 3 friends, that's <b>${trees * 3} more trees planted</b> and <b>${(Number(co2) * 0.25).toFixed(1)} tons of CO₂</b> gone.`,
                `🏅 <b>Badge on Deck:</b><br>Complete your next eco action to unlock "${nextBadge}."`
            ],
            "Doing Nothing for the Planet": [
                `✅ <b>Your First Step:</b><br>You've started your journey. <b>${trees} trees' worth of CO₂ saved?</b> Every action matters.`,
                `🔥 <b>Next Move:</b><br>Invite a friend to take their first eco action with you.`,
                `🌐 <b>Amplify Your Impact:</b><br>If 3 friends join, that's <b>${trees * 3} more trees planted</b> and <b>${(Number(co2) * 0.25).toFixed(1)} tons of CO₂</b> gone.`,
                `🏅 <b>Badge on Deck:</b><br>Take your next step to unlock "${nextBadge}."`
            ],
            "Certified Climate Snoozer": [
                `✅ <b>Your Wake-Up Call:</b><br>You're awake now! <b>${trees} trees' worth of CO₂ saved?</b> Welcome to the movement.`,
                `🔥 <b>Next Move:</b><br>Challenge a friend to join you in one green action this week.`,
                `🌐 <b>Amplify Your Impact:</b><br>If 3 friends join, that's <b>${trees * 3} more trees planted</b> and <b>${(Number(co2) * 0.25).toFixed(1)} tons of CO₂</b> gone.`,
                `🏅 <b>Badge on Deck:</b><br>Complete your next eco action to unlock "${nextBadge}."`
            ]
        };
        return templates[personality] || templates["Eco in Progress"];
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
        // Generate power moves
        const powerMoves = this.generatePowerMoves(personalityType, impactMetrics, 'Carbon Strategist');
        console.log('Generated power moves:', powerMoves);
        const response = {
            personalityType,
            description: personalityInfo.description,
            strengths: personalityInfo.strengths,
            nextSteps: personalityInfo.nextSteps,
            categoryScores: scores.categoryScores,
            impactMetrics,
            finalScore: scores.finalScore,
            powerMoves
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
