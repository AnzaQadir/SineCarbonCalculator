"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactMetricAndEquivalenceService = void 0;
// Constants for calculations
const CONSTANTS = {
    // Regional grid factors (kg CO2e per kWh)
    GRID_KG_PER_KWH: {
        Pakistan: 0.45,
        USA: 0.38,
        UK: 0.18,
        Germany: 0.32,
        UAE: 0.56,
        India: 0.67,
        default: 0.45
    },
    // Tree sequestration by biome (kg CO2 per year per mature tree)
    TREE_KG_PER_YEAR: {
        temperate: 21,
        mediterranean: 19,
        arid: 16,
        tropical: 20,
        default: 16
    },
    // Home energy constants
    HOME_KWH_PER_M2_YR: 70,
    HOME_AREAS: {
        '1': 35, '2': 60, '3': 85, '4': 110, '5': 135, '6': 160, '7+': 185
    },
    // Efficiency multipliers
    EFFICIENCY_MULTIPLIERS: {
        'A': 0.75, // Energy Efficient
        'B': 0.90, // Mixed Efficiency
        'C': 1.00 // Standard
    },
    // Renewable energy shares
    RENEWABLE_SHARES: {
        'A': 0.90, // Renewable Energy
        'B': 0.50, // Mixed Sources
        'C': 0.00 // Traditional Grid
    },
    // Transport factors (kg CO2e per km)
    TRANSPORT_FACTORS: {
        EV: 0.18, // Will be multiplied by grid factor
        HYBRID: 0.14,
        STANDARD: 0.20,
        LARGE: 0.26,
        LUXURY: 0.26,
        PUBLIC_TRANSIT: 0.08,
        ACTIVE: 0
    },
    // Flight emissions (kg CO2e per one-way flight)
    FLIGHT_EMISSIONS: {
        short: 250,
        medium: 500,
        long: 1000
    },
    // Food diet baselines (kg CO2e per year)
    FOOD_DIET_BASELINES: {
        'VEGAN': 1000,
        'VEGETARIAN': 1300,
        'FLEXITARIAN': 2000,
        'MEAT_MODERATE': 3000,
        'MEAT_HEAVY': 4500
    },
    // Food sourcing multipliers
    FOOD_SOURCING_MULTIPLIERS: {
        'A': 0.95, // Local & Seasonal
        'B': 1.00, // Mixed Sources
        'C': 1.10 // Mostly Imported
    },
    // Dining out multipliers
    DINING_MULTIPLIERS: {
        'A': 1.00, // <1 a month
        'B': 1.05, // 1-4 times a month
        'C': 1.10, // 5-10 times a month
        'D': 1.15 // >10 times a month
    },
    // Plant meal delta (kg CO2e per meal swapped from meat)
    PLANT_MEAL_DELTA: 1.7,
    // Expected plant meals per week by diet
    EXPECTED_PLANT_MEALS: {
        'VEGAN': 21,
        'VEGETARIAN': 18,
        'FLEXITARIAN': 10,
        'MEAT_MODERATE': 6,
        'MEAT_HEAVY': 3
    },
    // Clothing constants
    CLOTHING_ITEMS_PER_YEAR: {
        'A': 5, // Minimal Wardrobe
        'B': 15, // Balanced Collection
        'C': 40 // Extensive Wardrobe
    },
    CLOTHING_FREQUENCY_MULTIPLIERS: {
        'A': 0.85, // Infrequent Shopper
        'B': 1.00, // Seasonal Shopper
        'C': 1.30, // Frequent Shopper
        'D': 1.30 // Very Frequent Shopper
    },
    CLOTHING_QUALITY_MULTIPLIERS: {
        'A': 0.85, // Long-lasting Items
        'B': 1.00, // Mixed Quality
        'C': 1.25 // Fast Fashion
    },
    CLOTHING_SUSTAINABLE_MULTIPLIERS: {
        'A': 0.80, // Sustainable Brands
        'B': 0.90, // Mixed Approach
        'C': 1.00 // Conventional Shopping
    },
    CLOTHING_KG_PER_ITEM: 25,
    // Waste constants
    WASTE_DENSITY: 0.12, // kg per liter
    LANDFILL_FACTOR: 0.45, // kg CO2e per kg waste
    // Diversion rates
    WASTE_DIVERSION_RATES: {
        preWaste: {
            'avoid': 0.60,
            'oftenReuse': 0.35,
            'sometimesReuse': 0.15,
            'throwAway': 0
        },
        packaging: {
            'minimal': 0.15,
            'avoidWhenConvenient': 0.05,
            'convenience': 0
        }
    },
    // Repair savings (kg CO2e per year)
    REPAIR_SAVINGS: {
        'A': 80, // Always Repair
        'B': 30, // Sometimes Repair
        'C': 10, // Usually Replace
        'D': 0 // Always Replace
    },
    // Equivalence constants
    EQUIVALENCE_FACTORS: {
        TSHIRT_KG: 2.5,
        COFFEE_KG: 0.28, // latte default
        COFFEE_BLACK_KG: 0.05,
        BURGER_KG: 3.0,
        FLIGHT_KG: 500 // medium-haul default
    }
};
// Reference policies for impact avoided calculations
const REFERENCE_POLICIES = {
    conventional: {
        home: {
            homeSize: '4', // Larger home
            homeEfficiency: 'C', // Standard efficiency (matches UserResponses)
            energyManagement: 'C' // Traditional grid (matches UserResponses)
        },
        transport: {
            primaryTransportMode: 'C', // Personal vehicle (matches UserResponses)
            carProfile: 'D', // Large vehicle (higher emissions)
            weeklyKm: '300', // More driving (matches UserResponses)
            longDistanceTravel: 'C' // Frequent flyer (matches UserResponses)
        },
        food: {
            dietType: 'MEAT_HEAVY', // Higher meat consumption
            plateProfile: 'C', // Mostly imported (matches UserResponses)
            monthlyDiningOut: 'C', // 5-10 times a month (matches UserResponses)
            plantBasedMealsPerWeek: '3' // Fewer plant-based meals (matches UserResponses)
        },
        clothing: {
            wardrobeImpact: 'C', // Extensive wardrobe (matches UserResponses)
            mindfulUpgrades: 'C', // Conventional shopping (matches UserResponses)
            durability: 'C', // Fast fashion (matches UserResponses)
            consumptionFrequency: 'C', // Frequent shopper (matches UserResponses)
            brandLoyalty: 'C' // Style and fit (matches UserResponses)
        },
        waste: {
            prevention: 'D', // Always throw away (matches UserResponses)
            smartShopping: 'C', // Convenience packaging (matches UserResponses)
            dailyWaste: 'D', // Full bin (matches UserResponses)
            repairOrReplace: 'D' // Always replace (matches UserResponses)
        }
    }
};
class ImpactMetricAndEquivalenceService {
    getGridKgPerKwh(country) {
        if (country && CONSTANTS.GRID_KG_PER_KWH[country]) {
            return CONSTANTS.GRID_KG_PER_KWH[country];
        }
        return CONSTANTS.GRID_KG_PER_KWH.default;
    }
    getTreeKgPerYear(country) {
        // Infer biome from country if needed
        const biomeMap = {
            Pakistan: 'arid',
            USA: 'temperate',
            UK: 'temperate',
            Germany: 'temperate',
            UAE: 'arid',
            India: 'tropical'
        };
        const biome = country ? biomeMap[country] : 'default';
        return CONSTANTS.TREE_KG_PER_YEAR[biome] || CONSTANTS.TREE_KG_PER_YEAR.default;
    }
    calculateHomeEmissions(responses, gridKgPerKwh) {
        if (responses.homeSize && responses.homeEfficiency && responses.energyManagement) {
            const area = CONSTANTS.HOME_AREAS[responses.homeSize] || 85;
            const efficiency = CONSTANTS.EFFICIENCY_MULTIPLIERS[responses.homeEfficiency] || 1.0;
            const renewableShare = CONSTANTS.RENEWABLE_SHARES[responses.energyManagement] || 0.0;
            return area * CONSTANTS.HOME_KWH_PER_M2_YR * efficiency * gridKgPerKwh * (1 - renewableShare);
        }
        return 0;
    }
    calculateTransportEmissions(responses, gridKgPerKwh) {
        let emissions = 0;
        // Surface transport
        if (responses.primaryTransportMode && responses.weeklyKm) {
            const weeklyKm = parseFloat(responses.weeklyKm) || 0;
            const annualKm = weeklyKm * 52;
            if (responses.primaryTransportMode === 'A') { // Active transport
                emissions += annualKm * CONSTANTS.TRANSPORT_FACTORS.ACTIVE;
            }
            else if (responses.primaryTransportMode === 'B') { // Public transit
                emissions += annualKm * CONSTANTS.TRANSPORT_FACTORS.PUBLIC_TRANSIT;
            }
            else if (responses.primaryTransportMode === 'C') { // Personal vehicle
                if (responses.carProfile) {
                    let carFactor = CONSTANTS.TRANSPORT_FACTORS.STANDARD;
                    if (responses.carProfile === 'A')
                        carFactor = CONSTANTS.TRANSPORT_FACTORS.EV * gridKgPerKwh;
                    else if (responses.carProfile === 'B')
                        carFactor = CONSTANTS.TRANSPORT_FACTORS.HYBRID;
                    else if (responses.carProfile === 'D')
                        carFactor = CONSTANTS.TRANSPORT_FACTORS.LARGE;
                    else if (responses.carProfile === 'E')
                        carFactor = CONSTANTS.TRANSPORT_FACTORS.LUXURY;
                    emissions += annualKm * carFactor;
                }
            }
        }
        // Long distance travel
        if (responses.longDistanceTravel) {
            let flightsPerYear = 0;
            if (responses.longDistanceTravel === 'A')
                flightsPerYear = 0; // Rail and bus
            else if (responses.longDistanceTravel === 'B')
                flightsPerYear = 2; // Mix
            else if (responses.longDistanceTravel === 'C')
                flightsPerYear = 6; // Frequent flyer
            emissions += flightsPerYear * CONSTANTS.FLIGHT_EMISSIONS.medium;
        }
        return emissions;
    }
    calculateFoodEmissions(responses) {
        if (!responses.dietType)
            return 0;
        const dietBase = CONSTANTS.FOOD_DIET_BASELINES[responses.dietType] || 2000;
        const sourcingMultiplier = responses.plateProfile ?
            CONSTANTS.FOOD_SOURCING_MULTIPLIERS[responses.plateProfile] || 1.0 : 1.0;
        const diningMultiplier = responses.monthlyDiningOut ?
            CONSTANTS.DINING_MULTIPLIERS[responses.monthlyDiningOut] || 1.0 : 1.0;
        let emissions = dietBase * sourcingMultiplier * diningMultiplier;
        // Plant meal adjustments
        if (responses.plantBasedMealsPerWeek) {
            const actualPlantMeals = parseInt(responses.plantBasedMealsPerWeek) || 0;
            const expectedPlantMeals = CONSTANTS.EXPECTED_PLANT_MEALS[responses.dietType] || 10;
            const plantMealDelta = (actualPlantMeals - expectedPlantMeals) * CONSTANTS.PLANT_MEAL_DELTA * 52;
            emissions += plantMealDelta;
        }
        return Math.max(0, emissions);
    }
    calculateClothingEmissions(responses) {
        if (!responses.clothing)
            return 0;
        const approach = responses.clothing.wardrobeImpact || 'B';
        const frequency = responses.clothing.consumptionFrequency || 'B';
        const quality = responses.clothing.durability || 'B';
        const sustainable = responses.clothing.mindfulUpgrades || 'B';
        const itemsPerYear = CONSTANTS.CLOTHING_ITEMS_PER_YEAR[approach] || 15;
        const frequencyMultiplier = CONSTANTS.CLOTHING_FREQUENCY_MULTIPLIERS[frequency] || 1.0;
        const qualityMultiplier = CONSTANTS.CLOTHING_QUALITY_MULTIPLIERS[quality] || 1.0;
        const sustainableMultiplier = CONSTANTS.CLOTHING_SUSTAINABLE_MULTIPLIERS[sustainable] || 1.0;
        return (itemsPerYear * frequencyMultiplier) * (CONSTANTS.CLOTHING_KG_PER_ITEM * qualityMultiplier * sustainableMultiplier);
    }
    calculateWasteEmissions(responses) {
        if (!responses.waste)
            return 0;
        // Daily bin volume
        let dailyLiters = 10; // Default to half full
        if (responses.waste.dailyWaste === 'A')
            dailyLiters = 5; // Almost empty
        else if (responses.waste.dailyWaste === 'C')
            dailyLiters = 15; // Mostly full
        else if (responses.waste.dailyWaste === 'D')
            dailyLiters = 20; // Full
        // Diversion rate
        const preWasteRate = responses.waste.prevention ?
            CONSTANTS.WASTE_DIVERSION_RATES.preWaste[responses.waste.prevention] || 0 : 0;
        const packagingRate = responses.waste.smartShopping ?
            CONSTANTS.WASTE_DIVERSION_RATES.packaging[responses.waste.smartShopping] || 0 : 0;
        const diversionRate = Math.min(0.95, preWasteRate + packagingRate);
        // Repair savings
        const repairSavings = responses.waste.repairOrReplace ?
            CONSTANTS.REPAIR_SAVINGS[responses.waste.repairOrReplace] || 0 : 0;
        const wasteKg = Math.max(0, (dailyLiters * CONSTANTS.WASTE_DENSITY * 365) * (1 - diversionRate) * CONSTANTS.LANDFILL_FACTOR - repairSavings);
        return wasteKg;
    }
    convertToEquivalences(emissionsKg, constants) {
        return {
            km: emissionsKg / constants.carKgPerKm,
            tshirts: emissionsKg / CONSTANTS.EQUIVALENCE_FACTORS.TSHIRT_KG,
            coffeeCups: emissionsKg / constants.coffeeKgPerCup,
            burgers: emissionsKg / CONSTANTS.EQUIVALENCE_FACTORS.BURGER_KG,
            flights: emissionsKg / CONSTANTS.EQUIVALENCE_FACTORS.FLIGHT_KG
        };
    }
    convertToAvoidedEquivalences(emissionsKg, constants) {
        const baseEquivalences = this.convertToEquivalences(emissionsKg, constants);
        return {
            ...baseEquivalences,
            treeYears: emissionsKg / constants.treeKgPerYear
        };
    }
    roundValues(data, rounding = 'clean') {
        if (typeof data === 'number') {
            return rounding === 'clean' ? Math.round(data) : Math.round(data * 10) / 10;
        }
        if (typeof data === 'object' && data !== null) {
            const rounded = {};
            for (const [key, value] of Object.entries(data)) {
                rounded[key] = this.roundValues(value, rounding);
            }
            return rounded;
        }
        return data;
    }
    calculateImpactMetricAndEquivalence(responses, categoryEmissionsKg, referencePolicy = 'conventional', cohortAveragesKg, rounding = 'clean', copyLocale = 'en') {
        const gridKgPerKwh = this.getGridKgPerKwh(responses.country);
        const treeKgPerYear = this.getTreeKgPerYear(responses.country);
        // Calculate or use provided emissions
        const homeEmissions = categoryEmissionsKg?.home ?? this.calculateHomeEmissions(responses, gridKgPerKwh);
        const transportEmissions = categoryEmissionsKg?.transport ?? this.calculateTransportEmissions(responses, gridKgPerKwh);
        const foodEmissions = categoryEmissionsKg?.food ?? this.calculateFoodEmissions(responses);
        const clothingEmissions = categoryEmissionsKg?.clothing ?? this.calculateClothingEmissions(responses);
        const wasteEmissions = categoryEmissionsKg?.waste ?? this.calculateWasteEmissions(responses);
        const totalEmissions = homeEmissions + transportEmissions + foodEmissions + clothingEmissions + wasteEmissions;
        const householdSize = Math.max(1, parseInt(responses.householdSize || '1'));
        const perPersonEmissions = totalEmissions / householdSize;
        // Calculate car kg per km for equivalences
        let carKgPerKm = CONSTANTS.TRANSPORT_FACTORS.STANDARD;
        if (responses.carProfile === 'A')
            carKgPerKm = CONSTANTS.TRANSPORT_FACTORS.EV * gridKgPerKwh;
        else if (responses.carProfile === 'B')
            carKgPerKm = CONSTANTS.TRANSPORT_FACTORS.HYBRID;
        else if (responses.carProfile === 'D')
            carKgPerKm = CONSTANTS.TRANSPORT_FACTORS.LARGE;
        else if (responses.carProfile === 'E')
            carKgPerKm = CONSTANTS.TRANSPORT_FACTORS.LUXURY;
        // Calculate coffee kg per cup
        const coffeeKgPerCup = (responses.monthlyDiningOut === 'A') ?
            CONSTANTS.EQUIVALENCE_FACTORS.COFFEE_BLACK_KG : CONSTANTS.EQUIVALENCE_FACTORS.COFFEE_KG;
        const constants = {
            gridKgPerKwh,
            carKgPerKm,
            coffeeKgPerCup,
            burgerKgPerBurger: CONSTANTS.EQUIVALENCE_FACTORS.BURGER_KG,
            tshirtKgPerItem: CONSTANTS.EQUIVALENCE_FACTORS.TSHIRT_KG,
            treeKgPerYear,
            flightKgPerFlight: CONSTANTS.EQUIVALENCE_FACTORS.FLIGHT_KG
        };
        // Calculate impact equivalences
        const impactEquivalences = {
            home: this.convertToEquivalences(homeEmissions, constants),
            transport: this.convertToEquivalences(transportEmissions, constants),
            food: this.convertToEquivalences(foodEmissions, constants),
            clothing: this.convertToEquivalences(clothingEmissions, constants),
            waste: this.convertToEquivalences(wasteEmissions, constants),
            total: this.convertToEquivalences(totalEmissions, constants)
        };
        // Calculate reference emissions for impact avoided
        let referenceEmissions;
        if (referencePolicy === 'cohort' && cohortAveragesKg) {
            referenceEmissions = cohortAveragesKg;
        }
        else {
            // Use conventional reference
            const conventionalResponses = REFERENCE_POLICIES.conventional;
            referenceEmissions = {
                home: this.calculateHomeEmissions(conventionalResponses, gridKgPerKwh),
                transport: this.calculateTransportEmissions(conventionalResponses, gridKgPerKwh),
                food: this.calculateFoodEmissions(conventionalResponses),
                clothing: this.calculateClothingEmissions(conventionalResponses),
                waste: this.calculateWasteEmissions(conventionalResponses)
            };
        }
        // Calculate avoided emissions
        const avoidedEmissions = {
            home: Math.max(0, (referenceEmissions.home || 0) - homeEmissions),
            transport: Math.max(0, (referenceEmissions.transport || 0) - transportEmissions),
            food: Math.max(0, (referenceEmissions.food || 0) - foodEmissions),
            clothing: Math.max(0, (referenceEmissions.clothing || 0) - clothingEmissions),
            waste: Math.max(0, (referenceEmissions.waste || 0) - wasteEmissions)
        };
        const totalAvoided = avoidedEmissions.home + avoidedEmissions.transport +
            avoidedEmissions.food + avoidedEmissions.clothing + avoidedEmissions.waste;
        // Calculate avoided equivalences
        const avoidedEquivalences = {
            home: this.convertToAvoidedEquivalences(avoidedEmissions.home, constants),
            transport: this.convertToAvoidedEquivalences(avoidedEmissions.transport, constants),
            food: this.convertToAvoidedEquivalences(avoidedEmissions.food, constants),
            clothing: this.convertToAvoidedEquivalences(avoidedEmissions.clothing, constants),
            waste: this.convertToAvoidedEquivalences(avoidedEmissions.waste, constants),
            total: this.convertToAvoidedEquivalences(totalAvoided, constants)
        };
        // Prepare response
        const response = {
            emissionsKg: {
                home: homeEmissions,
                transport: transportEmissions,
                food: foodEmissions,
                clothing: clothingEmissions,
                waste: wasteEmissions,
                total: totalEmissions,
                perPerson: perPersonEmissions
            },
            equivalences: {
                impact: impactEquivalences,
                avoided: avoidedEquivalences
            },
            metadata: {
                constantsUsed: constants,
                referencePolicy,
                notes: [
                    "Equivalences are approximate based on your answers and regional averages.",
                    "Flights shown as medium-haul equivalents (≈500 kg CO2 per one-way).",
                    "Trees shown as tree-years (~kg CO2 absorbed by a mature tree in one year)."
                ]
            }
        };
        // Apply rounding
        return this.roundValues(response, rounding);
    }
}
exports.ImpactMetricAndEquivalenceService = ImpactMetricAndEquivalenceService;
