import { ReactLenis } from 'lenis/react';

// Import Lenis styles to avoid visual layout shifts
import 'lenis/dist/lenis.css';

/**
 * Wraps children with Lenis Smooth Scrolling provider.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export const SmoothScroll = ({ children }) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,           // Scroll interpolation speed (inertia)
        duration: 1.1,        // Animation duration
        smoothTouch: false,   // Disable on touch devices to respect native scroll momentum
        wheelMultiplier: 1.0, // Wheel scroll multiplier
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
