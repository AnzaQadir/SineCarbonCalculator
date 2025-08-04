"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighlightsService = void 0;
class HighlightsService {
    static determinePersonalityType(user) {
        if (!user.personalityTraits) {
            return { decisionStyle: 'intuitive', actionStyle: 'experimenter', archetype: 'Explorer' };
        }
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
        // Determine dominant decision style
        const maxDecision = Math.max(...Object.values(decisionCounts));
        let decisionStyle = 'intuitive';
        for (const [style, count] of Object.entries(decisionCounts)) {
            if (count === maxDecision) {
                decisionStyle = style;
                break;
            }
        }
        // Determine dominant action style
        const maxAction = Math.max(...Object.values(actionCounts));
        let actionStyle = 'experimenter';
        for (const [style, count] of Object.entries(actionCounts)) {
            if (count === maxAction) {
                actionStyle = style;
                break;
            }
        }
        // Determine archetype based on decision/action matrix
        const archetype = this.getArchetypeFromMatrix(decisionStyle, actionStyle);
        return { decisionStyle, actionStyle, archetype };
    }
    static getArchetypeFromMatrix(decisionStyle, actionStyle) {
        const matrix = {
            analyst: {
                planner: 'Strategist',
                experimenter: 'Trailblazer',
                collaborator: 'Coordinator'
            },
            intuitive: {
                planner: 'Visionary',
                experimenter: 'Explorer',
                collaborator: 'Catalyst'
            },
            connector: {
                planner: 'Builder',
                experimenter: 'Networker',
                collaborator: 'Steward'
            }
        };
        return matrix[decisionStyle]?.[actionStyle] || 'Explorer';
    }
    static findPowerHabit(user) {
        const habits = [
            {
                key: 'energyManagement',
                value: user.energyManagement,
                label: 'energy management',
                description: 'You actively track and optimize your home energy use.',
                cta: 'Track This'
            },
            {
                key: 'waste.smartShopping',
                value: user.waste?.smartShopping,
                label: 'conscious shopping',
                description: 'You choose zero-waste and refill options when shopping.',
                cta: 'Share This'
            },
            {
                key: 'clothing.wardrobeImpact',
                value: user.clothing?.wardrobeImpact,
                label: 'sustainable fashion',
                description: 'You choose ethical and sustainable clothing options.',
                cta: 'Celebrate This'
            },
            {
                key: 'primaryTransportMode',
                value: user.primaryTransportMode,
                label: 'low-carbon transport',
                description: 'You walk, bike, or take public transit regularly.',
                cta: 'Track This'
            },
            {
                key: 'dietType',
                value: user.dietType,
                label: 'plant-based eating',
                description: 'You choose planet-friendly meal options.',
                cta: 'Share This'
            }
        ];
        // Find the strongest habit (A grade)
        const topHabit = habits.find(h => h.value === 'A') || habits.find(h => h.value === 'VEGAN') || habits.find(h => h.value === 'VEGETARIAN');
        return {
            id: 'power-habit',
            title: this.HIGHLIGHT_CATEGORIES.powerHabit.title,
            icon: this.HIGHLIGHT_CATEGORIES.powerHabit.icon,
            category: this.HIGHLIGHT_CATEGORIES.powerHabit.category,
            summary: `You're already doing this.`,
            subtext: topHabit ? `${topHabit.description} That's quiet climate leadership in action.` : 'You have sustainable habits that make a difference.',
            cta: topHabit?.cta
        };
    }
    static findPowerMove(user, personality) {
        const { archetype } = personality;
        // Identify areas for improvement
        const weakAreas = [];
        if (user.dietType === 'MEAT_HEAVY' || user.dietType === 'MEAT_MODERATE')
            weakAreas.push('diet');
        if (user.waste?.dailyWaste === 'D' || user.waste?.dailyWaste === 'C')
            weakAreas.push('waste');
        if (user.primaryTransportMode === 'D' || user.primaryTransportMode === 'C')
            weakAreas.push('transport');
        if (user.clothing?.consumptionFrequency === 'D' || user.clothing?.consumptionFrequency === 'C')
            weakAreas.push('clothing');
        const powerMoves = {
            Strategist: {
                diet: 'Try a 5-day food diary to spot what\'s working (and what\'s getting tossed). A system will help you improve without stress.',
                waste: 'Create a simple waste tracking system for one week. Data will show you exactly where to focus.',
                transport: 'Map out your weekly routes and identify 3 trips you can convert to walking, biking, or public transit.',
                clothing: 'Audit your wardrobe and create a 30-day capsule wardrobe challenge.'
            },
            Trailblazer: {
                diet: 'Experiment with one new plant-based recipe each week and track which ones you love.',
                waste: 'Test a zero-waste alternative for one common item you use daily.',
                transport: 'Try a new transportation mode this week — bike to one errand or take public transit somewhere new.',
                clothing: 'Try a clothing swap with friends or visit a thrift store for your next purchase.'
            },
            Coordinator: {
                diet: 'Host a plant-based potluck with friends to discover new recipes together.',
                waste: 'Create a shared composting system with neighbors or start a repair café in your community.',
                transport: 'Start a carpool group for regular trips or organize a walking group for local errands.',
                clothing: 'Organize a clothing swap party with friends or colleagues.'
            }
        };
        const primaryWeakArea = weakAreas[0] || 'general';
        const move = powerMoves[archetype]?.[primaryWeakArea] ||
            'Try one small sustainable action this week. Every step counts.';
        return {
            id: 'power-move',
            title: this.HIGHLIGHT_CATEGORIES.powerMove.title,
            icon: this.HIGHLIGHT_CATEGORIES.powerMove.icon,
            category: this.HIGHLIGHT_CATEGORIES.powerMove.category,
            summary: 'One small shift = big impact.',
            subtext: move,
            cta: 'Try This Habit'
        };
    }
    static findGoFurther(user, personality) {
        const { archetype } = personality;
        // Count high sustainability areas
        const highAreas = [];
        if (user.energyManagement === 'A')
            highAreas.push('energy');
        if (user.waste?.smartShopping === 'A')
            highAreas.push('shopping');
        if (user.clothing?.wardrobeImpact === 'A')
            highAreas.push('fashion');
        if (user.primaryTransportMode === 'A')
            highAreas.push('transport');
        if (user.dietType === 'VEGAN' || user.dietType === 'VEGETARIAN')
            highAreas.push('diet');
        const nextLevelActions = {
            Strategist: 'Ready to level up? You\'ve nailed the basics. Next up: create a comprehensive sustainability system.',
            Trailblazer: 'Ready to level up? You\'ve mastered the fundamentals. Next up: experiment with advanced techniques.',
            Coordinator: 'Ready to level up? You\'ve built strong foundations. Next up: expand your community impact.'
        };
        const action = nextLevelActions[archetype] || 'Ready to level up? You\'re doing great. Keep building on your strengths.';
        return {
            id: 'go-further',
            title: this.HIGHLIGHT_CATEGORIES.goFurther.title,
            icon: this.HIGHLIGHT_CATEGORIES.goFurther.icon,
            category: this.HIGHLIGHT_CATEGORIES.goFurther.category,
            summary: action,
            subtext: 'You\'ve got this. Small steps lead to big changes.',
            cta: 'Level Up'
        };
    }
    static getDecisionStyleHighlight(personality) {
        const { decisionStyle } = personality;
        const decisionStyles = {
            analyst: {
                summary: 'You\'re an Analyst.',
                subtext: 'You make decisions with insight and care. Planning is your love language.'
            },
            intuitive: {
                summary: 'You\'re an Intuitive.',
                subtext: 'You trust your instincts and feel your way forward. Your gut is your guide.'
            },
            connector: {
                summary: 'You\'re a Connector.',
                subtext: 'You consider relationships and community in your decisions. People matter to you.'
            }
        };
        const style = decisionStyles[decisionStyle] || decisionStyles.intuitive;
        return {
            id: 'decision-style',
            title: this.HIGHLIGHT_CATEGORIES.decisionStyle.title,
            icon: this.HIGHLIGHT_CATEGORIES.decisionStyle.icon,
            category: this.HIGHLIGHT_CATEGORIES.decisionStyle.category,
            summary: style.summary,
            subtext: style.subtext
        };
    }
    static getActionStyleHighlight(personality) {
        const { actionStyle } = personality;
        const actionStyles = {
            planner: {
                summary: 'You\'re a Planner.',
                subtext: 'You thrive on structure and rhythm. Tiny habits, done often, are your superpower.'
            },
            experimenter: {
                summary: 'You\'re an Experimenter.',
                subtext: 'You learn by doing and adapt quickly. Trial and error is your path to success.'
            },
            collaborator: {
                summary: 'You\'re a Collaborator.',
                subtext: 'You shine when working with others. Together, you achieve more than alone.'
            }
        };
        const style = actionStyles[actionStyle] || actionStyles.experimenter;
        return {
            id: 'action-style',
            title: this.HIGHLIGHT_CATEGORIES.actionStyle.title,
            icon: this.HIGHLIGHT_CATEGORIES.actionStyle.icon,
            category: this.HIGHLIGHT_CATEGORIES.actionStyle.category,
            summary: style.summary,
            subtext: style.subtext
        };
    }
    static getSparkHighlight(personality) {
        const { archetype } = personality;
        const archetypeInfo = this.PERSONALITY_ARCHETYPES[archetype] || this.PERSONALITY_ARCHETYPES.Explorer;
        return {
            id: 'spark',
            title: this.HIGHLIGHT_CATEGORIES.spark.title,
            icon: this.HIGHLIGHT_CATEGORIES.spark.icon,
            category: this.HIGHLIGHT_CATEGORIES.spark.category,
            summary: `You're a ${archetype}.`,
            subtext: archetypeInfo.description
        };
    }
    static generateHighlights(user) {
        const personality = this.determinePersonalityType(user);
        const highlights = [
            this.findPowerHabit(user),
            this.findPowerMove(user, personality),
            this.findGoFurther(user, personality),
            this.getDecisionStyleHighlight(personality),
            this.getActionStyleHighlight(personality),
            this.getSparkHighlight(personality)
        ];
        return {
            highlights,
            personalityInsights: {
                decisionStyle: personality.decisionStyle,
                actionStyle: personality.actionStyle,
                spark: personality.archetype
            }
        };
    }
}
exports.HighlightsService = HighlightsService;
HighlightsService.HIGHLIGHT_CATEGORIES = {
    powerHabit: {
        title: "Your Power Habit",
        icon: "💡",
        category: "achievement"
    },
    powerMove: {
        title: "Your Power Move",
        icon: "⚡",
        category: "action"
    },
    goFurther: {
        title: "Go Further",
        icon: "🌱",
        category: "next-level"
    },
    decisionStyle: {
        title: "Decision Style",
        icon: "🧠",
        category: "personality"
    },
    actionStyle: {
        title: "Action Style",
        icon: "➡️",
        category: "personality"
    },
    spark: {
        title: "Your Spark",
        icon: "✨",
        category: "personality"
    }
};
HighlightsService.PERSONALITY_ARCHETYPES = {
    Strategist: {
        description: "You build systems from small wins. Others learn from your rhythm — keep showing how structure = sustainability.",
        strengths: ["analytical thinking", "systematic approach", "data-driven decisions"]
    },
    Trailblazer: {
        description: "You experiment and discover what works. Your curiosity leads to innovative solutions.",
        strengths: ["adaptability", "experimentation", "quick learning"]
    },
    Coordinator: {
        description: "You bring people together for common goals. Your collaborative spirit amplifies impact.",
        strengths: ["collaboration", "community building", "relationship focus"]
    },
    Visionary: {
        description: "You see the big picture and inspire others. Your vision creates lasting change.",
        strengths: ["big-picture thinking", "inspiration", "future-focused"]
    },
    Explorer: {
        description: "You discover new paths and share your findings. Your exploration opens doors for others.",
        strengths: ["curiosity", "discovery", "knowledge sharing"]
    },
    Catalyst: {
        description: "You spark enthusiasm and drive action. Your energy is contagious and motivating.",
        strengths: ["motivation", "enthusiasm", "action-oriented"]
    },
    Builder: {
        description: "You create lasting systems and structures. Your foundation supports sustainable growth.",
        strengths: ["system building", "foundation creation", "lasting impact"]
    },
    Networker: {
        description: "You connect dots and share resources. Your network amplifies collective impact.",
        strengths: ["networking", "resource sharing", "connection building"]
    },
    Steward: {
        description: "You protect and nurture what matters. Your care creates lasting positive change.",
        strengths: ["caretaking", "protection", "nurturing"]
    }
};
