import React from 'react';
import Layout from '@/components/Layout';

const ReflectionScreen: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-foam to-sand">
        <h1 className="text-4xl font-serif font-bold text-navy mb-4">Reflections</h1>
        <p className="text-lg text-muted-foreground text-center max-w-xl">
          This is the Reflections page. Here you'll soon be able to explore user stories, testimonials, and more!
        </p>
      </div>
    </Layout>
  );
};

export default ReflectionScreen; 