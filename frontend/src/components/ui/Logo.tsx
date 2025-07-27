interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizes[size]}`}>
        <svg viewBox="0 0 60 60" className="w-full h-full">
          {/* Cart base */}
          <rect x="8" y="35" width="44" height="12" fill="#FF6B35" rx="2" />

          {/* Cart counter */}
          <rect x="12" y="28" width="36" height="10" fill="#D97706" rx="1" />

          {/* Awning support */}
          <rect x="28" y="15" width="4" height="15" fill="#8B4513" />

          {/* Awning */}
          <path d="M5 20 L55 20 L52 12 L8 12 Z" fill="#4A7C59" />

          {/* Awning stripes */}
          <path
            d="M12 12 L12 20 M20 12 L20 20 M28 12 L28 20 M36 12 L36 20 M44 12 L44 20"
            stroke="#2D5016"
            strokeWidth="2"
          />

          {/* Scalloped edge */}
          <path
            d="M8 20 Q12 24 16 20 T24 20 T32 20 T40 20 T48 20 L52 20"
            stroke="#2D5016"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Food items */}
          <circle cx="20" cy="32" r="2.5" fill="#FCD34D" />
          <circle cx="30" cy="32" r="2.5" fill="#F87171" />
          <circle cx="40" cy="32" r="2.5" fill="#34D399" />

          {/* Wheels */}
          <circle cx="18" cy="47" r="6" fill="#059669" stroke="#065F46" strokeWidth="2" />
          <circle cx="42" cy="47" r="6" fill="#059669" stroke="#065F46" strokeWidth="2" />

          {/* Wheel spokes */}
          <path d="M18 41 L18 53 M12 47 L24 47" stroke="#065F46" strokeWidth="1.5" />
          <path d="M42 41 L42 53 M36 47 L48 47" stroke="#065F46" strokeWidth="1.5" />

          {/* Handle */}
          <rect x="4" y="30" width="8" height="3" fill="#8B4513" rx="1" />
        </svg>
      </div>
      {showText && (
        <span className={`font-poppins font-bold ${textSizes[size]}`}>
          <span className="text-[#FF6B35]">M</span>
          <span className="text-[#1F2937]">andipur</span>
        </span>
      )}
    </div>
  )
}
