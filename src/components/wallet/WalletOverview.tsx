
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, Coins, ExternalLink, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import RiskGauge from './RiskGauge';

interface WalletOverviewProps {
  className?: string;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({ className }) => {
  const { walletDetails, riskScore, firstSeen, tags, isLoading, error } = useSelector(
    (state: RootState) => state.wallet
  );

  if (isLoading) {
    return (
      <Card className={`glass ${className}`}>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-20 bg-gray-700/50 rounded"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`glass ${className}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <h3 className="text-lg font-medium">Error Loading Wallet</h3>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format the first seen date
  const firstSeenDate = firstSeen ? new Date(firstSeen) : null;
  const firstSeenFormatted = firstSeenDate 
    ? formatDistanceToNow(firstSeenDate, { addSuffix: true }) 
    : 'Unknown';

  return (
    <Card className={`glass overflow-hidden ${className}`}>
      <CardHeader className="pb-0">
        <CardTitle>Wallet Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Risk Assessment</h3>
              <div className="mt-2 h-32">
                <RiskGauge score={riskScore} size="lg" />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags && tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-800/50 text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No tags assigned</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Wallet Activity</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">First seen: {firstSeenFormatted}</span>
                </div>
                <div className="flex items-center">
                  <Coins className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">
                    Total transactions: {walletDetails?.transactions || 0}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400">External Links</h3>
              <div className="mt-2 space-y-2">
                {walletDetails?.address && (
                  <>
                    <a 
                      href={`https://etherscan.io/address/${walletDetails.address}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-neon-blue hover:underline text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Etherscan
                    </a>
                    <a 
                      href={`https://debank.com/profile/${walletDetails.address}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-neon-blue hover:underline text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on DeBank
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletOverview;
