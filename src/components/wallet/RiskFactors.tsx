
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Zap, PieChart, Layers } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { RiskFactor } from '@/store/slices/walletSlice';

interface RiskFactorsProps {
  className?: string;
}

const RiskFactorItem: React.FC<{ factor: RiskFactor }> = ({ factor }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'medium':
        return <PieChart className="h-4 w-4 text-amber-400" />;
      case 'low':
        return <Layers className="h-4 w-4 text-green-400" />;
      default:
        return <Zap className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {getImpactIcon(factor.impact)}
          <h4 className="text-sm font-medium ml-2">{factor.name}</h4>
        </div>
        <span className={`text-xs font-medium ${getImpactColor(factor.impact)}`}>
          {factor.impact.toUpperCase()}
        </span>
      </div>
      <Progress 
        value={factor.score} 
        className="h-1.5" 
        indicatorClassName={
          factor.impact === 'high' 
            ? 'bg-gradient-to-r from-red-500 to-red-400' 
            : factor.impact === 'medium' 
              ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
              : 'bg-gradient-to-r from-green-500 to-green-400'
        } 
      />
      <p className="text-xs text-gray-400">{factor.description}</p>
    </div>
  );
};

const RiskFactors: React.FC<RiskFactorsProps> = ({ className }) => {
  const { riskFactors, isLoading } = useSelector((state: RootState) => state.wallet);

  // Mock data if none is provided
  const mockFactors: RiskFactor[] = [
    {
      name: 'Exchange Volume',
      description: 'High transaction volume with known exchange addresses',
      score: 75,
      impact: 'medium'
    },
    {
      name: 'Mixer Interaction',
      description: 'Interactions with known cryptocurrency mixing services',
      score: 92,
      impact: 'high'
    },
    {
      name: 'Transaction Velocity',
      description: 'Rate of transactions over time compared to typical behavior',
      score: 45,
      impact: 'low'
    },
    {
      name: 'Sanctioned Entities',
      description: 'Connections to addresses on sanctions lists',
      score: 88,
      impact: 'high'
    }
  ];

  const factorsToDisplay = riskFactors && riskFactors.length > 0 ? riskFactors : mockFactors;

  if (isLoading) {
    return (
      <Card className={`glass ${className}`}>
        <CardHeader className="pb-0">
          <CardTitle>Risk Factors</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700/50 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-1/6"></div>
                </div>
                <div className="h-2 bg-gray-700/50 rounded"></div>
                <div className="h-3 bg-gray-700/50 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass ${className}`}>
      <CardHeader className="pb-0">
        <CardTitle>Risk Factors</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {factorsToDisplay.map((factor, index) => (
            <RiskFactorItem key={index} factor={factor} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskFactors;
