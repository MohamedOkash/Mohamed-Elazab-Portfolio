import { motion } from 'framer-motion';

// Premium Bezier curves matching modern luxury web design
const EASE_PREMIUM = [0.16, 1, 0.3, 1];

const variants = {
  'fade-up': {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: EASE_PREMIUM }
    }
  },
  'mask-up': {
    hidden: { y: '50%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: EASE_PREMIUM }
    }
  },
  'image-reveal': {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      scale: 1,
      transition: { duration: 1.2, ease: EASE_PREMIUM }
    }
  }
};

/**
 * Reveal animation wrapper.
 * Uses Framer Motion's intersection observer under the hood.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {'fade-up'|'mask-up'|'image-reveal'} [props.type='fade-up']
 * @param {number} [props.delay=0] - Delay in milliseconds.
 * @param {string} [props.className=""]
 */
export const Reveal = ({ children, type = 'fade-up', delay = 0, className = "" }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8%' }}
      variants={variants[type] || variants['fade-up']}
      transition={{ delay: delay / 1000 }}
      style={{ willChange: 'transform, opacity, clip-path' }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;

