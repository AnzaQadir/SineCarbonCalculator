
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Car, 
  Plane, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle,
  ThumbsUp,
  PlugZap,
  Flame,
  Wind,
  LifeBuoy,
  Bus,
  Train,
  Apple,
  Beef,
  Leaf
} from 'lucide-react';
import { useCalculator, CarType, FlightType, TransitType, DietType } from '@/hooks/useCalculator';
import ResultsDisplay from './ResultsDisplay';
import { cn } from '@/lib/utils';

const Calculator: React.FC = () => {
  const { state, results, updateCalculator, nextStep, prevStep, resetCalculator } = useCalculator();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const renderStepContent = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Home className="h-5 w-5 text-primary" />
                <CardTitle>Home Energy</CardTitle>
              </div>
              <CardDescription>
                Enter your average monthly usage for each energy source.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <PlugZap className="h-4 w-4 text-primary mr-2" />
                    <label htmlFor="electricity" className="text-sm font-medium">
                      Electricity (kWh/month)
                    </label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </div>
                  <input
                    id="electricity"
                    type="number"
                    min="0"
                    value={state.electricityKwh}
                    onChange={(e) => updateCalculator({ electricityKwh: Number(e.target.value) || 0 })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Average US household: 900 kWh/month
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Flame className="h-4 w-4 text-primary mr-2" />
                    <label htmlFor="naturalGas" className="text-sm font-medium">
                      Natural Gas (therms/month)
                    </label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </div>
                  <input
                    id="naturalGas"
                    type="number"
                    min="0"
                    value={state.naturalGasTherm}
                    onChange={(e) => updateCalculator({ naturalGasTherm: Number(e.target.value) || 0 })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Average US household: 50 therms/month
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Wind className="h-4 w-4 text-primary mr-2" />
                    <label htmlFor="heatingOil" className="text-sm font-medium">
                      Heating Oil (gallons/month)
                    </label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </div>
                  <input
                    id="heatingOil"
                    type="number"
                    min="0"
                    value={state.heatingOilGallons}
                    onChange={(e) => updateCalculator({ heatingOilGallons: Number(e.target.value) || 0 })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <LifeBuoy className="h-4 w-4 text-primary mr-2" />
                    <label htmlFor="propane" className="text-sm font-medium">
                      Propane (gallons/month)
                    </label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </div>
                  <input
                    id="propane"
                    type="number"
                    min="0"
                    value={state.propaneGallons}
                    onChange={(e) => updateCalculator({ propaneGallons: Number(e.target.value) || 0 })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </CardContent>
          </div>
        );

      case 2:
        return (
          <div className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Car className="h-5 w-5 text-primary" />
                <CardTitle>Transportation</CardTitle>
              </div>
              <CardDescription>
                Tell us about your transportation habits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="carType" className="block text-sm font-medium mb-2">
                    What type of car do you drive?
                  </label>
                  <select
                    id="carType"
                    value={state.carType}
                    onChange={(e) => updateCalculator({ carType: e.target.value as CarType })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="SMALL">Small Car (Compact)</option>
                    <option value="MEDIUM">Medium Car (Sedan)</option>
                    <option value="LARGE">Large Car (SUV/Truck)</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ELECTRIC">Electric</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Car className="h-4 w-4 text-primary mr-2" />
                    <label htmlFor="carMiles" className="text-sm font-medium">
                      Car Miles per Month
                    </label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </div>
                  <input
                    id="carMiles"
                    type="number"
                    min="0"
                    value={state.carMiles}
                    onChange={(e) => updateCalculator({ carMiles: Number(e.target.value) || 0 })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Average American drives about 1,000 miles per month
                  </p>
                </div>

                <div>
                  <label htmlFor="flightType" className="block text-sm font-medium mb-2">
                    What types of flights do you usually take?
                  </label>
                  <select
                    id="flightType"
                    value={state.flightType}
                    onChange={(e) => updateCalculator({ flightType: e.target.value as FlightType })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="SHORT">Mostly Short (&lt; 300 miles)</option>
                    <option value="MEDIUM">Mostly Medium (300-2300 miles)</option>
                    <option value="LONG">Mostly Long (&gt; 2300 miles)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Plane className="h-4 w-4 text-primary mr-2" />
                    <label htmlFor="flightMiles" className="text-sm font-medium">
                      Flight Miles per Year
                    </label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </div>
                  <input
                    id="flightMiles"
                    type="number"
                    min="0"
                    value={state.flightMiles}
                    onChange={(e) => updateCalculator({ flightMiles: Number(e.target.value) || 0 })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    A round-trip flight from NYC to LA is about 5,000 miles
                  </p>
                </div>

                <div>
                  <label htmlFor="transitType" className="block text-sm font-medium mb-2">
                    What public transit do you use most?
                  </label>
                  <select
                    id="transitType"
                    value={state.transitType}
                    onChange={(e) => updateCalculator({ transitType: e.target.value as TransitType })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="BUS">Bus</option>
                    <option value="SUBWAY">Subway/Metro</option>
                    <option value="TRAIN">Train</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Bus className="h-4 w-4 text-primary mr-2" />
                    <label htmlFor="transitMiles" className="text-sm font-medium">
                      Public Transit Miles per Month
                    </label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </div>
                  <input
                    id="transitMiles"
                    type="number"
                    min="0"
                    value={state.transitMiles}
                    onChange={(e) => updateCalculator({ transitMiles: Number(e.target.value) || 0 })}
                    className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </CardContent>
          </div>
        );

      case 3:
        return (
          <div className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <CardTitle>Food & Diet</CardTitle>
              </div>
              <CardDescription>
                Your diet has a significant impact on your carbon footprint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all hover:border-primary",
                    state.dietType === 'MEAT_HEAVY' && "border-primary bg-primary/5"
                  )}
                  onClick={() => updateCalculator({ dietType: 'MEAT_HEAVY' })}
                >
                  <div className="flex items-center mb-2">
                    <Beef className="h-6 w-6 text-primary mr-2" />
                    <h3 className="font-medium">Meat Heavy</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Red meat and dairy multiple times per day
                  </p>
                </div>
                
                <div 
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all hover:border-primary",
                    state.dietType === 'AVERAGE' && "border-primary bg-primary/5"
                  )}
                  onClick={() => updateCalculator({ dietType: 'AVERAGE' })}
                >
                  <div className="flex items-center mb-2">
                    <ThumbsUp className="h-6 w-6 text-primary mr-2" />
                    <h3 className="font-medium">Average</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Meat several times per week
                  </p>
                </div>
                
                <div 
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all hover:border-primary",
                    state.dietType === 'VEGETARIAN' && "border-primary bg-primary/5"
                  )}
                  onClick={() => updateCalculator({ dietType: 'VEGETARIAN' })}
                >
                  <div className="flex items-center mb-2">
                    <Apple className="h-6 w-6 text-primary mr-2" />
                    <h3 className="font-medium">Vegetarian</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No meat, but includes dairy and eggs
                  </p>
                </div>
                
                <div 
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all hover:border-primary",
                    state.dietType === 'VEGAN' && "border-primary bg-primary/5"
                  )}
                  onClick={() => updateCalculator({ dietType: 'VEGAN' })}
                >
                  <div className="flex items-center mb-2">
                    <Leaf className="h-6 w-6 text-primary mr-2" />
                    <h3 className="font-medium">Vegan</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No animal products whatsoever
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Did you know?
                </h4>
                <p className="text-sm text-muted-foreground">
                  The production of food accounts for 26% of global greenhouse gas emissions. 
                  Beef and lamb have the highest carbon footprint, while fruits, vegetables, 
                  and grains have much lower impacts.
                </p>
              </div>
            </CardContent>
          </div>
        );

      case 4:
        return (
          <div className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Trash2 className="h-5 w-5 text-primary" />
                <CardTitle>Waste</CardTitle>
              </div>
              <CardDescription>
                Tell us about your waste and recycling habits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <Trash2 className="h-4 w-4 text-primary mr-2" />
                  <label htmlFor="wasteLbs" className="text-sm font-medium">
                    Pounds of trash per month
                  </label>
                  <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                </div>
                <input
                  id="wasteLbs"
                  type="number"
                  min="0"
                  value={state.wasteLbs}
                  onChange={(e) => updateCalculator({ wasteLbs: Number(e.target.value) || 0 })}
                  className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Average person produces about 30-40 lbs per month
                </p>
              </div>

              <div>
                <label htmlFor="recyclingPercentage" className="block text-sm font-medium mb-2">
                  What percentage of your waste do you recycle? ({state.recyclingPercentage}%)
                </label>
                <input
                  id="recyclingPercentage"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={state.recyclingPercentage}
                  onChange={(e) => updateCalculator({ recyclingPercentage: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Recycling Tips
                </h4>
                <p className="text-sm text-muted-foreground">
                  Recycling helps reduce the amount of waste that ends up in landfills, 
                  where it produces methane - a potent greenhouse gas. Aim to recycle paper, 
                  plastics, glass, and metals whenever possible.
                </p>
              </div>
            </CardContent>
          </div>
        );

      case 5:
        return <ResultsDisplay results={results} onReset={resetCalculator} />;
      
      default:
        return null;
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <React.Fragment key={step}>
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                state.step === step ? "bg-primary text-white" : 
                  state.step > step ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              )}
            >
              {state.step > step ? (
                <ThumbsUp className="h-4 w-4" />
              ) : (
                <span>{step}</span>
              )}
            </div>
            {step < 5 && (
              <div 
                className={cn(
                  "h-[2px] w-10",
                  state.step > step ? "bg-primary" : "bg-secondary"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div 
      id="calculator" 
      className={cn(
        "w-full max-w-3xl mx-auto transition-opacity duration-500 py-10",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {state.step < 5 && renderStepIndicator()}
      
      <Card variant="elevated" className={state.step === 5 ? 'w-full' : ''}>
        {renderStepContent()}
        
        {state.step < 5 && (
          <CardFooter className="flex justify-between border-t border-border/20 p-6">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={state.step === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button onClick={nextStep}>
              {state.step === 4 ? 'Calculate Results' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Calculator;
