import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Leaf, Shirt, Crown, Palette,
  Sparkles, Image, Settings2,
  CheckCircle2, CircleDot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarItem {
  id: string;
  name: string;
  description: string;
  type: 'outfit' | 'accessory' | 'background';
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  sustainabilityImpact: string;
}

interface EcoAvatarCustomizationProps {
  unlockedItems: string[];
  currentLevel: string;
  onSave: (selectedItems: { [key: string]: string }) => void;
}

const avatarItems: AvatarItem[] = [
  {
    id: 'outfit-1',
    name: 'Recycled Denim',
    description: 'Made from 100% recycled materials',
    type: 'outfit',
    icon: <Shirt className="h-6 w-6" />,
    rarity: 'common',
    unlocked: true,
    sustainabilityImpact: 'Reduces textile waste'
  },
  {
    id: 'accessory-1',
    name: 'Solar Panel Crown',
    description: 'Symbol of renewable energy leadership',
    type: 'accessory',
    icon: <Crown className="h-6 w-6" />,
    rarity: 'legendary',
    unlocked: false,
    sustainabilityImpact: 'Promotes clean energy'
  },
  {
    id: 'background-1',
    name: 'Thriving Forest',
    description: 'A lush ecosystem you helped protect',
    type: 'background',
    icon: <Image className="h-6 w-6" />,
    rarity: 'epic',
    unlocked: true,
    sustainabilityImpact: 'Represents forest conservation'
  },
  // Add more items...
];

export const EcoAvatarCustomization: React.FC<EcoAvatarCustomizationProps> = ({
  unlockedItems,
  currentLevel,
  onSave
}) => {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('outfits');
  const [previewMode, setPreviewMode] = useState(false);

  const handleItemSelect = (item: AvatarItem) => {
    if (!item.unlocked) return;
    
    setSelectedItems(prev => ({
      ...prev,
      [item.type]: item.id
    }));
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customize Your Eco-Avatar</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
          className="gap-2"
        >
          {previewMode ? (
            <>
              <Settings2 className="h-4 w-4" />
              Edit
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Preview
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Avatar Preview */}
        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-green-200">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Avatar Display - Replace with actual avatar rendering */}
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-white/50 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center">
                <Leaf className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Level {currentLevel} Eco-Avatar</p>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="outfits" className="flex-1">Outfits</TabsTrigger>
              <TabsTrigger value="accessories" className="flex-1">Accessories</TabsTrigger>
              <TabsTrigger value="backgrounds" className="flex-1">Backgrounds</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {['outfits', 'accessories', 'backgrounds'].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {avatarItems
                      .filter(item => item.type === tab.slice(0, -1))
                      .map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: item.unlocked ? 1.02 : 1 }}
                          className={cn(
                            "p-4 rounded-xl border-2 cursor-pointer transition-colors",
                            selectedItems[item.type] === item.id
                              ? "border-gray-500 bg-gray-50"
                              : item.unlocked
                              ? "border-gray-200 hover:border-gray-300"
                              : "border-gray-200 opacity-50 cursor-not-allowed"
                          )}
                          onClick={() => handleItemSelect(item)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              item.rarity === 'legendary' ? "bg-yellow-100" :
                              item.rarity === 'epic' ? "bg-purple-100" :
                              item.rarity === 'rare' ? "bg-blue-100" :
                              "bg-gray-100"
                            )}>
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{item.name}</h4>
                                {selectedItems[item.type] === item.id && (
                                  <CheckCircle2 className="h-4 w-4 text-gray-600" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <CircleDot className="h-4 w-4 text-green-600" />
                                <span className="text-xs text-green-600">{item.sustainabilityImpact}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedItems({})}>
              Reset
            </Button>
            <Button onClick={() => onSave(selectedItems)}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EcoAvatarCustomization; 