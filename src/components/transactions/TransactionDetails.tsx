
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface TransactionDetailsProps {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  gasUsed?: string;
  status?: 'success' | 'failed' | 'pending';
  methodName?: string;
  contractInteraction?: boolean;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  hash,
  from,
  to,
  value,
  timestamp,
  gasUsed,
  status = 'success',
  methodName,
  contractInteraction = false,
}) => {
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatValue = (val: string) => {
    const valueNum = parseFloat(val);
    return valueNum.toFixed(6) + ' ETH';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Transaction Details</CardTitle>
          <Badge className={getStatusColor(status)} variant="outline">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-400">Transaction Hash</h3>
              <div className="flex items-center space-x-2">
                <p className="font-mono text-sm truncate">{truncateAddress(hash)}</p>
                <a
                  href={`https://etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-blue hover:text-opacity-80 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-400">Timestamp</h3>
              <p className="text-sm">{formatDate(timestamp)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-400">From</h3>
              <div className="flex items-center space-x-2">
                <p className="font-mono text-sm truncate">{truncateAddress(from)}</p>
                <a
                  href={`https://etherscan.io/address/${from}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-blue hover:text-opacity-80 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-400">To</h3>
              <div className="flex items-center space-x-2">
                <p className="font-mono text-sm truncate">{truncateAddress(to)}</p>
                <a
                  href={`https://etherscan.io/address/${to}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-blue hover:text-opacity-80 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-400">Value</h3>
              <p className="text-sm">{formatValue(value)}</p>
            </div>

            {gasUsed && (
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-gray-400">Gas Used</h3>
                <p className="text-sm">{gasUsed}</p>
              </div>
            )}

            {methodName && contractInteraction && (
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-gray-400">Contract Method</h3>
                <p className="text-sm font-mono">{methodName}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
