import { useState } from 'react';

/**
 * ImageWithSkeleton - progressive image loading using the blur-up technique.
 * Fallback to lightweight transitions on low-end mobile devices.
 * Handles empty/broken sources gracefully.
 */
export default function ImageWithSkeleton({
  src,
  srcSet,
  sizes,
  placeholderSrc,
  alt = "",
  className = "",
  style = {},
  loading = "lazy",
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // Reset states during render if the source changes
  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }

  const [isLowEnd] = useState(() => {
    if (typeof navigator === "undefined") return false;

    const lowMemory =
      navigator.deviceMemory &&
      navigator.deviceMemory < 4;

    const lowCores =
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency < 4;

    return Boolean(lowMemory || lowCores);
  });

  // Guard against empty src or errors to prevent empty browser requests
  if (!src || src.trim() === "" || hasError) {
    return (
      <div 
        className={`relative w-full h-full min-h-[150px] bg-zinc-950/40 flex items-center justify-center border border-zinc-900 ${className}`} 
        style={style}
        role="img"
        aria-label={alt || "Image not available"}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-light select-none">
          {hasError ? "Image Unavailable" : "No Image"}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950/20">
      {/* Premium Shimmer Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-[length:200%_100%] animate-[shimmer_1.6s_infinite_linear] z-0" />
      )}

      {/* Progressive Blur-up Placeholder */}
      {placeholderSrc && placeholderSrc.trim() !== '' && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1000ms] z-10 pointer-events-none ${
            isLoaded ? "opacity-0" : "opacity-100"
          } ${
            isLowEnd
              ? "blur-[3px] scale-100"
              : "blur-[16px] scale-105"
          }`}
          style={{ willChange: 'opacity, filter' }}
        />
      )}

      {/* Main Image */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-[800ms] ease-out ${className} ${
          isLoaded
            ? "opacity-100 scale-100"
            : "opacity-0 scale-[1.02]"
        }`}
        style={{
          ...style,
          willChange: 'opacity, transform'
        }}
        {...props}
      />
    </div>
  );
}