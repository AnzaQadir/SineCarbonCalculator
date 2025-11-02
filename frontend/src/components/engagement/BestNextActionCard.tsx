import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export interface BestNextAction {
  id: string;
  title: string;
  category: string;
  cta: string;
  previewImpact: {
    rupees: number;
    co2_kg: number;
    label?: string;
  };
  whyShown: string;
  source: string;
  learnMore?: {
    summary: string;
    url?: string;
  };
}

interface BestNextActionCardProps {
  action: BestNextAction;
  onActionDone: (actionId: string) => void;
  isCompleted?: boolean;
}

export const BestNextActionCard: React.FC<BestNextActionCardProps> = ({ 
  action, 
  onActionDone,
  isCompleted = false 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
        {/* Header Badge */}
        <div className="absolute top-4 right-4">
          <Badge 
            variant="secondary" 
            className="bg-green-500 text-white flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            {action.previewImpact.label || 'Next ₹ win'}
          </Badge>
        </div>

        <CardContent className="p-6 pt-8">
          {/* Title */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {action.title}
            </h3>
            
            {/* Impact Preview */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600 font-semibold">
                Save ₹{action.previewImpact.rupees}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-emerald-600 font-semibold">
                {action.previewImpact.co2_kg} kg CO₂
              </span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="mb-4">
            {isCompleted ? (
              <Button 
                disabled 
                className="w-full bg-green-100 text-green-700 hover:bg-green-100"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Done Today
              </Button>
            ) : (
              <Button 
                onClick={() => onActionDone(action.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {action.cta}
              </Button>
            )}
          </div>

          {/* Why Shown */}
          <div className="text-xs text-gray-500 mb-3">
            <span className="font-medium">Why shown:</span> {action.whyShown}
          </div>

          {/* Learn More (Collapsible) */}
          {action.learnMore && (
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="font-medium">Curious? Open details</span>
                {showDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-sm text-gray-600"
                >
                  <p className="mb-2">{action.learnMore.summary}</p>
                  {action.learnMore.url && (
                    <a
                      href={action.learnMore.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 inline-flex items-center gap-1"
                    >
                      Learn more <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Source Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-400">
            {action.source}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
