import React from 'react';

const ReflectionScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-foam to-sand">
      <h1 className="text-4xl font-serif font-bold text-navy mb-4">Reflections</h1>
      <p className="text-lg text-muted-foreground text-center max-w-xl">
        This is the Reflections page. Here you'll soon be able to explore user stories, testimonials, and more!
      </p>
    </div>
  );
};

export default ReflectionScreen; 