import { motion } from 'framer-motion';
import { RefreshCw, MessageSquare, TrendingUp } from 'lucide-react';

const adaptiveFeatures = [
  {
    icon: RefreshCw,
    title: 'Adaptive System',
    description: 'Evolves with you as you progress',
    color: '#16626D'
  },
  {
    icon: MessageSquare,
    title: 'Feedback Design',
    description: 'Learns from your reflections and actions',
    color: '#E9839D'
  },
  {
    icon: TrendingUp,
    title: 'Scalability',
    description: 'Matches your pace and personality',
    color: '#87CEEB'
  }
];

export default function AdaptiveSystemSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Darker neutral background for contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #F5EFE4 0%, #E8DCC8 50%, #DECFB5 100%)'
        }}
        aria-hidden
      />

      <div className="max-w-7xl w-full relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            A System That Adapts With You
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            Change isn't linear. Zerrah evolves with you. As you reflect, log actions, or simply show up, 
            the system tunes itself — recommending steps that match your pace, personality, and progress.
          </p>
        </motion.div>

        {/* 3 horizontally aligned cards */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-8">
            {adaptiveFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg text-center relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    backgroundColor: `${feature.color}15`,
                    border: `2px solid ${feature.color}30`
                  }}
                >
                  <feature.icon className="w-10 h-10" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-xl text-[#1C1B19] mb-4">{feature.title}</h3>
                <p className="text-[#1C1B19]/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Soft glowing arrows connecting them */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            style={{ height: '300px' }}
            aria-hidden
          >
            <motion.path
              d="M 200 150 Q 400 100, 600 150"
              stroke="url(#gradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="6,6"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#16626D" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#E9839D" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#87CEEB" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Illustration: evolving plant/growing spark */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#16626D]/20 to-[#E9839D]/20 blur-2xl" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-16 h-16 text-[#16626D]" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

