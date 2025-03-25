
import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const Hero: React.FC = () => {
  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background to-secondary/30 py-20 md:py-28">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[10%] w-[60%] h-[80%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[5%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Card 
            variant="glass" 
            animation="fadeIn" 
            className="inline-flex items-center px-4 py-2 mb-6"
          >
            <span className="text-sm font-medium text-primary">Measure your impact on the planet</span>
          </Card>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-down">
            Calculate Your <span className="text-primary">Carbon Footprint</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-slide-down" style={{ animationDelay: "100ms" }}>
            Understanding your environmental impact is the first step toward 
            sustainable living. Our precision calculator provides you with the insights 
            you need to make better choices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-down" style={{ animationDelay: "200ms" }}>
            <Button size="lg" onClick={scrollToCalculator}>
              Start Calculating
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
          
          <div 
            className="animate-slide-down cursor-pointer mt-8"
            style={{ animationDelay: "300ms" }}
            onClick={scrollToCalculator}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
