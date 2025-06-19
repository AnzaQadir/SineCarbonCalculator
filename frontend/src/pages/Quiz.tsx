import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Calculator from '@/components/Calculator';
import { useCalculator } from '@/hooks/useCalculator';

const Quiz = () => {
  const { state, updateCalculator } = useCalculator();
  const [currentStep, setCurrentStep] = useState(0);

  const handleCalculate = () => {
    // Handle calculation completion
    console.log('Calculating results...');
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

  return (
    <Layout>
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Lifestyle Persona Snapshot
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Answer a few quick questions about your lifestyle to discover your unique persona and get personalized climate action tips.
              </p>
            </div>
            <Calculator 
              state={{
                ...state,
                householdSize: state.householdSize.toString(),
                electricityKwh: state.electricityKwh.toString(),
                naturalGasTherm: state.naturalGasTherm.toString(),
                heatingOilGallons: state.heatingOilGallons.toString(),
                propaneGallons: state.propaneGallons.toString(),
                annualMileage: state.annualMileage.toString(),
                costPerMile: state.costPerMile.toString(),
                plantBasedMealsPerWeek: state.plantBasedMealsPerWeek.toString(),
              }}
              onUpdate={(updates) => {
                const processedUpdates = {
                  ...updates,
                  householdSize: updates.householdSize ? Number(updates.householdSize) : state.householdSize,
                  electricityKwh: updates.electricityKwh ? Number(updates.electricityKwh) : state.electricityKwh,
                  naturalGasTherm: updates.naturalGasTherm ? Number(updates.naturalGasTherm) : state.naturalGasTherm,
                  heatingOilGallons: updates.heatingOilGallons ? Number(updates.heatingOilGallons) : state.heatingOilGallons,
                  propaneGallons: updates.propaneGallons ? Number(updates.propaneGallons) : state.propaneGallons,
                  annualMileage: updates.annualMileage ? Number(updates.annualMileage) : state.annualMileage,
                  costPerMile: updates.costPerMile ? Number(updates.costPerMile) : state.costPerMile,
                  plantBasedMealsPerWeek: updates.plantBasedMealsPerWeek ? Number(updates.plantBasedMealsPerWeek) : state.plantBasedMealsPerWeek,
                };
                updateCalculator(processedUpdates);
              }}
              onCalculate={handleCalculate}
              onBack={handleBack}
              onNext={handleNext}
              onStepChange={handleStepChange}
              currentStep={currentStep}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Quiz; 