import { motion, useScroll } from 'framer-motion';

export default function ProgressBarTop() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-transparent">
      <motion.div
        className="h-1 bg-[color:var(--accent)]"
        style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
      />
    </div>
  );
}


