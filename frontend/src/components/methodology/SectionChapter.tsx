import { motion } from 'framer-motion';
import { renderMarkdownToHtml } from '@/utils/markdown';

type Props = {
  id: string;
  kicker?: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
};

export default function SectionChapter({ id, kicker, title, body, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="relative py-20">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-2xl border border-black/10 bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)] p-8 md:p-12"
        >
          {kicker && (
            <motion.p variants={fadeUp} className="text-sm uppercase tracking-wide text-[color:var(--ink)]/60">
              {kicker}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            id={`${id}-heading`}
            className="mt-1 font-serif tracking-tight text-[clamp(28px,4vw,48px)] text-[color:var(--ink)]"
          >
            {title}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-2 h-[3px] w-16 rounded-full bg-[color:var(--accent)]/80" aria-hidden />
          {(() => {
            const MARK = '<!--GRID_BREAK-->';
            const hasBody = typeof body === 'string' && body.trim().length > 0;
            if (hasBody && children && body!.includes(MARK)) {
              const [before, after] = body!.split(MARK);
              return (
                <>
                  <motion.div
                    variants={fadeUp}
                    className="mt-4 prose prose-neutral max-w-none text-[color:var(--ink)]/80"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(before) }}
                  />
                  <motion.div variants={fadeUp} className="mt-8 space-y-6">
                    {children}
                  </motion.div>
                  {after && (
                    <motion.div
                      variants={fadeUp}
                      className="mt-8 prose prose-neutral max-w-none text-[color:var(--ink)]/80"
                      dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(after) }}
                    />
                  )}
                </>
              );
            }
            if (hasBody) {
              return (
                <>
                  <motion.div
                    variants={fadeUp}
                    className="mt-4 prose prose-neutral max-w-none text-[color:var(--ink)]/80"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(body as string) }}
                  />
                  {children && (
                    <motion.div variants={fadeUp} className="mt-8 space-y-6">
                      {children}
                    </motion.div>
                  )}
                </>
              );
            }
            // No body: just render children
            if (children) {
              return (
                <motion.div variants={fadeUp} className="mt-2 space-y-6">
                  {children}
                </motion.div>
              );
            }
            return null;
          })()}
        </motion.div>
      </div>
    </section>
  );
}


