export default function BrandLogo({ 
  className = '', 
  isDark = true,
  monogram = "AZ",
  title = "MOHAMED AZAB",
  subtitle = "PHOTOGRAPHY"
}) {
  // Rose Gold / Copper Metallic Gradient
  const textGradientStyle = {
    background: 'linear-gradient(135deg, #b56c52 0%, #f8d0c1 40%, #cd856c 60%, #e7ab96 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div className={`flex flex-col items-center justify-center select-none group ${className}`}>
      
      {/* 1. Monogram MA / AZ */}
      <div 
        className="relative flex items-center justify-center text-5xl md:text-6xl mb-1"
        style={{ 
          fontFamily: '"Playfair Display", "Cinzel", serif',
          filter: isDark ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))' : 'drop-shadow(0px 1px 2px rgba(0,0,0,0.15))'
        }}
      >
        <div className="flex items-center">
          {monogram.split('').map((char, i) => (
            <span 
              key={i} 
              className={`relative z-${10-i} ${i > 0 ? '-ml-2 md:-ml-4' : ''} transform -skew-x-6 transition-transform duration-500 group-hover:scale-105 ${i > 0 ? 'delay-75' : ''}`} 
              style={textGradientStyle}
            >
              {char}
            </span>
          ))}
        </div>
        
        {/* Swoosh Effect over Monogram */}
        <div 
          className="absolute top-[55%] left-[-15%] w-[130%] h-[3px] rounded-[100%] transition-transform duration-500 group-hover:scale-x-110"
          style={{
            background: 'linear-gradient(90deg, transparent, #e7ab96, #f8d0c1, #b56c52, transparent)',
            transform: 'rotate(-12deg)',
            boxShadow: isDark ? '0 3px 5px rgba(0,0,0,0.5)' : 'none',
            zIndex: 5
          }}
        />
        {/* Highlight Reflection */}
        <div 
          className="absolute top-[54%] left-1/4 w-1/4 h-[1px] bg-white opacity-40 rounded-full"
          style={{ transform: 'rotate(-12deg)', zIndex: 6 }}
        />
      </div>
      
      {/* 2. Brand Name */}
      <div 
        className="text-base md:text-xl tracking-[0.25em] md:tracking-[0.3em] font-serif uppercase font-medium mt-2 leading-none text-center"
        style={textGradientStyle}
      >
        {title}
      </div>
      
      {/* 3. Subtitle / Photography */}
      <div className="flex items-center justify-center gap-3 mt-3 w-full opacity-90">
        <span className="w-8 md:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#b56c52]"></span>
        <span 
          className="text-[0.5rem] md:text-[0.6rem] tracking-[0.45em] uppercase font-light"
          style={{ color: '#cd856c' }}
        >
          {subtitle}
        </span>
        <span className="w-8 md:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#b56c52]"></span>
      </div>

    </div>
  );
}
