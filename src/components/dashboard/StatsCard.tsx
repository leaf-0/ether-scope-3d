
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, FileSearch, Wallet } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode | string;
  description?: string;
  className?: string;
  color?: 'blue' | 'purple' | 'pink' | 'green' | 'amber';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  description,
  className,
  color = 'blue'
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
    green: 'from-neon-green/20 to-neon-green/5 neon-border-green',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500'
  };
  
  const iconStyles = {
    blue: 'text-neon-blue',
    purple: 'text-neon-purple',
    pink: 'text-neon-pink',
    green: 'text-neon-green',
    amber: 'text-amber-400'
  };

  // Render the appropriate icon
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    if (typeof icon === 'string') {
      switch (icon) {
        case 'Wallet':
          return <Wallet className="h-6 w-6" />;
        case 'AlertTriangle':
          return <AlertTriangle className="h-6 w-6" />;
        case 'FileSearch':
          return <FileSearch className="h-6 w-6" />;
        default:
          return null;
      }
    }
    
    return null;
  };

  return (
    <div 
      className={cn(
        `glass-card relative p-6 hover:scale-105 transition-all duration-500 ease-apple 
        bg-gradient-to-br ${accentStyles[color]}
        overflow-hidden rounded-xl`,
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4">
        <div className={cn("text-3xl opacity-80", iconStyles[color])}>
          {renderIcon()}
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-gray-300 mb-1">{title}</h3>
        <div className="flex items-baseline mt-2">
          <p className={cn(
            "text-3xl font-semibold transition-all",
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            iconStyles[color]
          )}>
            {value}
          </p>
          
          {change !== undefined && (
            <span className={`ml-2 text-xs font-medium ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {Math.abs(change)}%
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
