import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useInView } from '@/hooks/use-in-view';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2 }: AnimatedCounterProps) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [hasTriggered, setHasTriggered] = useState(false);

  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (isInView && !hasTriggered) {
      springValue.set(value);
      setHasTriggered(true);
    }
  }, [isInView, hasTriggered, value, springValue]);

  const displayValue = useTransform(springValue, (current) => {
    // Format with commas and no decimal places
    const formatted = Math.floor(current).toLocaleString('en-US');
    return `${prefix}${formatted}${suffix}`;
  });

  return (
    <motion.span ref={ref}>
      {displayValue}
    </motion.span>
  );
}
