import logoSrc from "@assets/Component 1.png";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  textColor?: string;
}

export function Logo({ 
  className = "", 
  size = 'md', 
  withText = true,
  textColor = "text-primary"
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img src={logoSrc} alt="Material Plus Logo" className={sizeClasses[size]} />
      {withText && (
        <span className={`${textColor} font-montserrat font-bold text-xl ml-2`}>
          Material Plus
        </span>
      )}
    </div>
  );
}

export default Logo;
