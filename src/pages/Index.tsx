
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/sections/Hero';
import Calculator from '@/components/Calculator';
import { Card, CardContent } from '@/components/ui/card';
import { LeafyGreen, Droplets, Wind, Trees } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <Hero />
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Carbon Footprint Calculator
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete all sections to get an accurate estimate of your annual carbon footprint.
                We'll show you how your lifestyle impacts the environment and suggest ways to reduce your carbon emissions.
              </p>
            </div>
            
            <Calculator />
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-b from-white to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Calculate Your Carbon Footprint?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding your impact is the first step toward making positive changes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card variant="glass" hover="lift" className="calculator-card">
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
            
            <Card variant="glass" hover="lift" className="calculator-card">
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
            
            <Card variant="glass" hover="lift" className="calculator-card">
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
            
            <Card variant="glass" hover="lift" className="calculator-card">
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
    </Layout>
  );
};

export default Index;
