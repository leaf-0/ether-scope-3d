
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
  accentColor?: 'blue' | 'purple' | 'pink' | 'green';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
  className,
  accentColor = 'blue'
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    // Trigger animation when component mounts
    setIsAnimated(true);
    
    // Set up counter animation
    let start = 0;
    const end = typeof value === 'number' ? value : 0;
    const duration = 1500;
    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  // Define accent color styles
  const accentStyles = {
    blue: 'from-neon-blue/20 to-neon-blue/5 neon-border',
    purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple',
    pink: 'from-neon-pink/20 to-neon-pink/5 neon-border-pink',
    green: 'from-neon-green/20 to-neon-green/5 neon-border-green'
  };
  
  const iconStyles = {
    blue: 'text-neon-blue',
    purple: 'text-neon-purple',
    pink: 'text-neon-pink',
    green: 'text-neon-green'
  };

  return (
    <div 
      className={cn(
        `glass-card relative p-6 hover-scale transition-all duration-500 ease-apple 
        bg-gradient-to-br ${accentStyles[accentColor]}
        overflow-hidden rounded-xl`,
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4">
        <div className={cn("text-3xl opacity-80", iconStyles[accentColor])}>
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-gray-300 mb-1">{title}</h3>
        <div className="flex items-baseline mt-2">
          <p className={cn(
            "text-3xl font-semibold transition-all",
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            iconStyles[accentColor]
          )}>
            {value}
          </p>
          
          {change !== undefined && (
            <span className={`ml-2 text-xs font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </span>
          )}
        </div>
        
        {description && (
          <p className="mt-2 text-xs text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
