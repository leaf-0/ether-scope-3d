
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clipboard, ExternalLink, AlertCircle } from 'lucide-react';
import { RootState } from '@/store';
import { fetchWalletDetails } from '@/store/slices/walletSlice';
import { useToast } from '@/components/ui/use-toast';

interface WalletCardProps {
  address: string;
  balance: string;
  riskScore: number;
  tags?: string[];
  firstSeen?: string;
  className?: string;
}

const WalletCard: React.FC<WalletCardProps> = ({
  address,
  balance,
  riskScore,
  tags = [],
  firstSeen,
  className
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({
      title: "Address copied to clipboard",
      duration: 2000
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Determine risk level and styling
  const getRiskColor = (score: number) => {
    if (score < 30) return 'neon-green';
    if (score < 70) return 'text-amber-400';
    return 'text-risk-high';
  };
  
  const getRiskBorderStyle = (score: number) => {
    if (score < 30) return 'border-neon-green shadow-[0_0_10px_rgba(76,255,76,0.3)]';
    if (score < 70) return 'border-amber-400 shadow-[0_0_10px_rgba(255,215,0,0.3)]';
    return 'border-risk-high shadow-[0_0_10px_rgba(255,0,68,0.3)]';
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className={`glass border border-white/10 overflow-hidden transform perspective-1000 ${className}`}>
      <div className={`absolute inset-x-0 top-0 h-1 ${getRiskBorderStyle(riskScore)}`} />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="rounded-md bg-dark-lighter p-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L18 6V12L12 16L6 12V6L12 2Z" fill="#00D4FF" fillOpacity="0.5" stroke="#00D4FF" strokeWidth="2" />
              </svg>
            </div>
            <span className="font-mono text-sm text-gray-300">{truncateAddress(address)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Clipboard className={`h-4 w-4 ${copied ? 'text-green-400' : 'text-gray-400'}`} />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="p-3 rounded-md bg-dark-lighter">
            <div className="text-xs text-gray-400 mb-1">Balance</div>
            <div className="font-medium text-white">{balance} ETH</div>
          </div>
          
          <div className="p-3 rounded-md bg-dark-lighter">
            <div className="text-xs text-gray-400 mb-1">Risk Score</div>
            <div className={`font-medium ${getRiskColor(riskScore)}`}>{riskScore}/100</div>
          </div>
        </div>
        
        <div className="p-3 rounded-md bg-dark-lighter mt-2">
          <div className="text-xs text-gray-400 mb-1">First Seen</div>
          <div className="font-medium text-white">{formatDate(firstSeen)}</div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className={`
              text-xs px-2 py-1 rounded-md 
              ${tag.includes('?') ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}
            `}
          >
            {tag.includes('?') && <AlertCircle className="inline h-3 w-3 mr-1" />}
            {tag}
          </span>
        ))}
      </CardFooter>
    </Card>
  );
};

export default WalletCard;
