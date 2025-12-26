interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <span className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}>
      <span className="text-foreground">IMPROV</span>
      <span className="relative text-primary">
        É
        {/* Accent stroke emphasis */}
        <span 
          className="absolute -top-1 left-1/2 w-3 h-0.5 bg-primary transform -translate-x-1/2 rotate-12 opacity-60"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <span className="font-bold text-primary text-2xl">É</span>
      <span 
        className="absolute -top-0.5 left-1/2 w-4 h-0.5 bg-primary transform -translate-x-1/2 rotate-12"
        aria-hidden="true"
      />
    </div>
  );
}
