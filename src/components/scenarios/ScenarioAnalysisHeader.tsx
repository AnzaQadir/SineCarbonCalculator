
import React from 'react';

interface ScenarioAnalysisHeaderProps {
  className?: string;
}

const ScenarioAnalysisHeader: React.FC<ScenarioAnalysisHeaderProps> = () => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        "What If" Scenario Analysis
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Explore how different lifestyle changes could impact your carbon footprint.
        Toggle between scenarios to see the potential environmental benefits of each change.
      </p>
    </div>
  );
};

export default ScenarioAnalysisHeader;
