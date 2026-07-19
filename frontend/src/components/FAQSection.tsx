import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';

const faqs = [
  {
    question: "Do I need prior trading experience?",
    answer: "No. Our curriculum is designed to take you from absolute beginner to advanced institutional concepts. We build your foundation first before moving into complex order flow."
  },
  {
    question: "What starting capital do I need?",
    answer: "You can start learning on a demo account with $0 risk. Once you're consistently profitable, we teach you how to pass Prop Firm challenges so you can trade with up to $200,000 of their capital, rather than risking your own savings."
  },
  {
    question: "Is this for Day Trading or Swing Trading?",
    answer: "The concepts we teach (liquidity, order flow, market structure) apply to all timeframes. You can adapt the edge to fit your lifestyle, whether you want to day trade the New York session or swing trade daily charts."
  },
  {
    question: "Do I have to pay a monthly subscription?",
    answer: "No. This is a one-time investment for lifetime access. You get all current modules, plus any future updates, live session recordings, and community access forever without recurring fees."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <AnimatedSection className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-muted-foreground">
          Everything you need to know before joining the academy.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/30"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`size-5 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
