
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  size = 'md',
  animated = true,
  showLabel = true,
  className
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setProgress(score);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setProgress(score);
    }
  }, [score, animated]);
  
  // Calculate color based on risk score
  const getColor = () => {
    if (score < 30) return 'bg-gradient-to-r from-green-500 to-green-300';
    if (score < 70) return 'bg-gradient-to-r from-yellow-500 to-amber-300';
    return 'bg-gradient-to-r from-red-600 to-rose-400';
  };
  
  // Get risk category
  const getRiskCategory = () => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };
  
  // Get indicator styles based on size
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: 'h-1.5',
          label: 'text-xs',
          padding: 'py-1'
        };
      case 'lg':
        return {
          height: 'h-3',
          label: 'text-sm',
          padding: 'py-2'
        };
      case 'md':
      default:
        return {
          height: 'h-2',
          label: 'text-xs',
          padding: 'py-1.5'
        };
    }
  };
  
  const styles = getSizeStyles();

  return (
    <div className={`${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className={`${styles.label} text-gray-400`}>Risk Score</span>
          <div className="flex items-center">
            <span className={`${styles.label} font-medium`}>{score}/100</span>
            <span className={`ml-2 ${styles.label} font-medium ${
              score < 30 ? 'text-green-400' : (score < 70 ? 'text-amber-400' : 'text-rose-400')
            }`}>
              {getRiskCategory()}
            </span>
          </div>
        </div>
      )}
      
      <div className="relative">
        <Progress 
          value={progress} 
          max={100}
          className={`${styles.height} bg-gray-800 ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
          indicatorClassName={`${getColor()} ${styles.height}`}
        />
        
        {/* Risk markers */}
        <div className="absolute top-full w-full flex justify-between mt-1">
          <span className={`${styles.label} text-green-400`}>Safe</span>
          <span className={`${styles.label} text-amber-400`}>Caution</span>
          <span className={`${styles.label} text-rose-400`}>High Risk</span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
