import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/sections/Hero';
import Calculator from '@/components/Calculator';
import ScenarioAnalysis from '@/components/scenarios/ScenarioAnalysis';
import { Card, CardContent } from '@/components/ui/card';
import { LeafyGreen, Droplets, Wind, Trees, FileText, BarChart4, Map, Users } from 'lucide-react';
import { useCalculator } from '@/hooks/useCalculator';
import { Button } from '@/components/ui/button';
import ResultsDisplay from '@/components/ResultsDisplay';

const Index = () => {
  const { state, updateCalculator } = useCalculator();
  const [currentStep, setCurrentStep] = useState(0);
  const [showingScenarios, setShowingScenarios] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);

  const handleCalculate = (results) => {
    setCalculationResults(results);
    setShowingScenarios(true);
    const scenarioElement = document.getElementById('scenario-analysis');
    if (scenarioElement) {
      scenarioElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const scrollToScenarioAnalysis = () => {
    const scenarioElement = document.getElementById('scenario-analysis');
    if (scenarioElement) {
      scenarioElement.scrollIntoView({ behavior: 'smooth' });
      setShowingScenarios(true);
    }
  };

  return (
    <Layout>
      <Hero />
      
      <section className="py-20 bg-white" id="calculator">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Carbon Footprint Calculator
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete all sections to get an accurate estimate of your annual carbon footprint.
                We'll show you how your lifestyle impacts the environment and suggest personalized ways to reduce your carbon emissions.
              </p>
            </div>
            
            {!calculationResults ? (
              <Calculator 
                state={state}
                onUpdate={updateCalculator}
                onCalculate={handleCalculate}
                onBack={handleBack}
                onNext={handleNext}
                onStepChange={handleStepChange}
                currentStep={currentStep}
              />
            ) : (
              <ResultsDisplay
                score={calculationResults.score}
                emissions={calculationResults.emissions}
                categoryEmissions={calculationResults.categoryEmissions}
                recommendations={calculationResults.recommendations}
                isVisible={true}
                onReset={() => {
                  setCalculationResults(null);
                  setCurrentStep(0);
                }}
                state={state}
              />
            )}

            {currentStep === 5 && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={scrollToScenarioAnalysis} 
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <BarChart4 className="h-5 w-5" />
                  Run Scenario Analysis
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <ScenarioAnalysis className="bg-secondary/30" />
      
      <section className="py-20 bg-gradient-to-b from-white to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Calculate Your Carbon Footprint?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding your impact is the first step toward making positive changes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="calculator-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <LeafyGreen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Awareness</h3>
                <p className="text-muted-foreground">
                  Gain a clear understanding of how your lifestyle affects the planet.
                </p>
              </CardContent>
            </Card>
            
            <Card className="calculator-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Reduce Impact</h3>
                <p className="text-muted-foreground">
                  Identify areas where you can make changes to reduce your carbon emissions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="calculator-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Wind className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  Measure your progress over time as you adopt more sustainable habits.
                </p>
              </CardContent>
            </Card>
            
            <Card className="calculator-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Trees className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Take Action</h3>
                <p className="text-muted-foreground">
                  Learn about offset options and find ways to contribute to climate solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Approach</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've designed our calculator with these principles in mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="calculator-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Scientific Rigor</h3>
                <p className="text-muted-foreground">
                  Our calculations are based on peer-reviewed methodologies and data from respected sources like the EPA and IPCC.
                </p>
              </CardContent>
            </Card>
            
            <Card className="calculator-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Personalized Insights</h3>
                <p className="text-muted-foreground">
                  We provide tailored recommendations based on your unique footprint profile and lifestyle patterns.
                </p>
              </CardContent>
            </Card>
            
            <Card className="calculator-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Localized Data</h3>
                <p className="text-muted-foreground">
                  Our calculations consider regional factors like electricity grid mix and available transportation options.
                </p>
              </CardContent>
            </Card>
            
            <Card className="calculator-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Ecosystem Integration</h3>
                <p className="text-muted-foreground">
                  We connect you with resources, partners, and tools to make sustainable living more accessible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
