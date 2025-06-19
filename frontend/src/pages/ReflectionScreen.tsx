import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

const categories = [
  { label: 'All', value: 'all', color: 'bg-emerald-200 text-emerald-900' },
  { label: 'People Story', value: 'People Story', color: 'bg-green-200 text-green-900' },
  { label: 'Expert Opinion', value: 'Expert Opinion', color: 'bg-teal-200 text-teal-900' },
  { label: 'Research Insight', value: 'Research Insight', color: 'bg-lime-200 text-lime-900' },
];

const posts = [
  {
    category: 'People Story',
    title: "From Trash to Treasure",
    author: 'Zoya Khan',
    description: 'A Karachi artist turns beach plastic into vibrant murals.',
    image: '/images/cat.png',
    imageAlt: 'Young woman painting on a wall with ocean debris.',
    likes: 128,
    views: 1024,
    story: `Zoya Khan grew up near Karachi's Clifton Beach, where plastic waste was a daily sight. Instead of turning away, she began collecting discarded bottles, caps, and wrappers. Over months, she transformed these into vibrant murals on the sea wall, turning trash into public art. Her work not only beautifies the coastline but sparks conversations about waste and hope. "Every piece of plastic here tells a story," Zoya says. "If we can see beauty in what's thrown away, maybe we can change how we treat our planet." Her murals have inspired local cleanups and even school art projects, proving that one person's creativity can ripple through a whole community.`
  },
  {
    category: 'Expert Opinion',
    title: 'The Truth About Fast Fashion',
    author: 'Dr. Minal Farooq',
    description: 'Why our closet choices may matter more than our carbon offsets.',
    image: '/images/girl.png',
    imageAlt: 'Close-up of textile scraps and clothing tags.'
  },
  {
    category: 'Research Insight',
    title: 'Biking Once a Week Cuts City CO₂ by 37%',
    author: 'Zerrah Research Team',
    description: 'A meta-study on cycling culture in urban design.',
    image: '/images/cat.png',
    imageAlt: 'Birds-eye view of cyclists in a green-lane city.'
  },
  {
    category: 'People Story',
    title: "Nani's Garden, Reimagined",
    author: 'Mahnoor Tariq',
    description: "One woman's journey of restoring biodiversity in her backyard.",
    image: '/images/girl.png',
    imageAlt: 'An older woman harvesting herbs.'
  },
  {
    category: 'Expert Opinion',
    title: 'Local Food is Climate Action',
    author: 'Chef Adeel Rehman',
    description: "Farm-to-plate isn't just a trend — it's resistance.",
    image: '/images/cat.png',
    imageAlt: 'A chef at a local farmer\'s market with a tote bag.'
  },
  {
    category: 'Research Insight',
    title: 'Composting: The Overlooked Emissions Hero',
    author: 'University of Lahore x Zerrah',
    description: 'Why organic waste separation reduces methane leaks.',
    image: '/images/girl.png',
    imageAlt: 'A compost bin with animated micro-life zoom-in.'
  }
];

const categoryColor = {
  'People Story': 'bg-green-100 text-green-800',
  'Expert Opinion': 'bg-teal-100 text-teal-800',
  'Research Insight': 'bg-lime-100 text-lime-800',
};

const ReflectionScreen: React.FC = () => {
  const [selected, setSelected] = useState('all');
  const [modalPost, setModalPost] = useState<typeof posts[0] | null>(null);
  const filteredPosts = selected === 'all' ? posts : posts.filter(p => p.category === selected);

  return (
    <Layout>
      <div className="min-h-screen w-full flex flex-col items-center justify-start py-16 px-2 bg-gradient-to-br from-[#F3FDF8] to-[#FFFDF3]">
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold text-navy mb-4 text-center">Reflections</h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-10">
          Dive into real stories, expert takes, and research insights from the Zerrah community.
        </p>
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-150 border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base md:text-lg ${selected === cat.value ? cat.color + ' shadow' : 'bg-white text-gray-500 hover:bg-emerald-50'}`}
              onClick={() => setSelected(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
          {filteredPosts.map((post, idx) => (
            <div key={idx} className="relative group cursor-pointer" onClick={() => setModalPost(post)}>
              <Card variant="elevated" hover="lift" className="rounded-3xl overflow-hidden shadow-lg bg-white/90 border-0 transition-all duration-200">
                <div className="h-56 w-full overflow-hidden relative">
                  <img src={post.image} alt={post.imageAlt} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-4">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-1 text-gray-700 text-sm font-semibold shadow">
                        <Heart className="w-4 h-4 text-rose-500" /> {post.likes || 0}
                      </div>
                      <div className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-1 text-gray-700 text-sm font-semibold shadow">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A2 2 0 0 0 22 6.382V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v.382a2 2 0 0 0 1.447 1.342L8 10m7 0v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m10 0H6" /></svg> {post.views || 0}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${categoryColor[post.category as keyof typeof categoryColor]}`}>{post.category}</span>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h2>
                  <div className="text-sm text-gray-500 mb-2">By {post.author}</div>
                  <p className="text-base text-gray-700 mb-4">{post.description}</p>
                  <div className="flex items-center gap-4 mt-auto pt-2">
                    <button className="group flex items-center gap-1 text-gray-400 hover:text-emerald-600 transition"><Heart className="w-5 h-5" /><span className="sr-only">Like</span></button>
                    <button className="group flex items-center gap-1 text-gray-400 hover:text-emerald-600 transition"><MessageCircle className="w-5 h-5" /><span className="sr-only">Comment</span></button>
                    <button className="group flex items-center gap-1 text-gray-400 hover:text-emerald-600 transition ml-auto"><Bookmark className="w-5 h-5" /><span className="sr-only">Save</span></button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
        {/* Modal for full story */}
        {modalPost && (
          <Dialog open={!!modalPost} onOpenChange={() => setModalPost(null)}>
            <DialogContent className="max-w-2xl w-full rounded-3xl p-0 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 w-full h-64 md:h-auto bg-gray-100 flex items-center justify-center">
                  <img src={modalPost.image} alt={modalPost.imageAlt} className="object-cover w-full h-full" />
                </div>
                <div className="md:w-1/2 w-full p-8 flex flex-col">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${categoryColor[modalPost.category as keyof typeof categoryColor]}`}>{modalPost.category}</span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{modalPost.title}</h2>
                  <div className="text-sm text-gray-500 mb-4">By {modalPost.author}</div>
                  <p className="text-base text-gray-700 whitespace-pre-line mb-4">{modalPost.story || modalPost.description}</p>
                  <div className="flex items-center gap-4 mt-auto pt-2">
                    <div className="flex items-center gap-2 text-gray-500"><Heart className="w-5 h-5 text-rose-500" /> {modalPost.likes || 0}</div>
                    <div className="flex items-center gap-2 text-gray-500"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A2 2 0 0 0 22 6.382V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v.382a2 2 0 0 0 1.447 1.342L8 10m7 0v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m10 0H6" /></svg> {modalPost.views || 0}</div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {/* CTA */}
        <Button size="lg" className="rounded-full bg-emerald-600 text-white font-bold text-lg px-8 py-4 shadow hover:bg-emerald-700 transition-all duration-150">
          Explore All Reflections
        </Button>
      </div>
    </Layout>
  );
};

export default ReflectionScreen; 