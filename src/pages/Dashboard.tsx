
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Activity, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Database, 
  Globe as GlobeIcon
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import StatsCard from '@/components/dashboard/StatsCard';
import Globe from '@/components/dashboard/Globe';

interface RecentTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  riskScore: number;
}

const mockTransactions: RecentTransaction[] = [
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    value: '15.4',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    riskScore: 35
  },
  {
    hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    from: '0xabcdef1234567890abcdef1234567890abcdef12',
    to: '0x7890abcdef1234567890abcdef1234567890abcd',
    value: '42.1',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    riskScore: 80
  },
  {
    hash: '0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    from: '0x7890abcdef1234567890abcdef1234567890abcd',
    to: '0xef1234567890abcdef1234567890abcdef123456',
    value: '7.2',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    riskScore: 25
  },
  {
    hash: '0xe5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    from: '0x567890abcdef1234567890abcdef1234567890ab',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    value: '21.8',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    riskScore: 92
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate receiving a high-risk transaction notification
    const timer = setTimeout(() => {
      toast({
        title: "High-risk transaction detected",
        description: "New transaction with risk score of 92 identified.",
        variant: "destructive"
      });
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [toast]);
  
  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-risk-low';
    if (score < 70) return 'text-amber-400';
    return 'text-risk-high';
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-12 px-4">
        <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl font-bold text-white">
            <span className="tracking-tight">Ethereum Transaction Monitor</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time blockchain analysis and transaction monitoring
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="flex flex-col space-y-6 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            <StatsCard 
              title="Monitored Wallets" 
              value="247" 
              change={5} 
              icon={<Wallet />} 
              accentColor="blue"
            />
            
            <StatsCard 
              title="Active Transactions" 
              value="124" 
              change={-2} 
              icon={<Activity />} 
              accentColor="purple"
            />
            
            <StatsCard 
              title="Suspicious Flows" 
              value="18" 
              change={12} 
              icon={<AlertTriangle />} 
              accentColor="pink"
            />
            
            <StatsCard 
              title="Average Block Time" 
              value="12.4s" 
              icon={<Clock />} 
              accentColor="green"
            />
          </div>
          
          {/* Middle Column - Globe Visualization */}
          <div className="lg:col-span-2 animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
            <Card className="glass border border-white/10 h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Global Transaction Flow</CardTitle>
                    <CardDescription>Real-time visualization of transaction origins</CardDescription>
                  </div>
                  <GlobeIcon className="text-neon-blue h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Globe />
              </CardContent>
            </Card>
          </div>
          
          {/* Bottom Section - Recent Activity & Metrics */}
          <div className="lg:col-span-2 animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
            <Card className="glass border border-white/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest monitored transactions</CardDescription>
                  </div>
                  <Activity className="text-neon-blue h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((tx) => (
                    <Link 
                      key={tx.hash} 
                      to={`/trace/${tx.hash}`}
                      className="block hover:bg-white/5 rounded-lg p-3 transition-colors"
                    >
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <div className="font-mono text-sm truncate max-w-[120px] text-gray-400">
                            {truncateAddress(tx.from)}
                          </div>
                          <div className="text-sm text-gray-500">→</div>
                          <div className="font-mono text-sm truncate max-w-[120px] text-gray-400">
                            {truncateAddress(tx.to)}
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${getRiskColor(tx.riskScore)}`}>
                          {tx.riskScore}/100
                        </div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <div className="text-sm text-white font-medium">
                          {tx.value} ETH
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTimeAgo(tx.timestamp)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.5s' }}>
            <Card className="glass border border-white/10 h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Network Metrics</CardTitle>
                    <CardDescription>Current blockchain status</CardDescription>
                  </div>
                  <Database className="text-neon-blue h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-sm text-gray-400">Network Hash Rate</span>
                    <span className="text-sm font-medium">1.2 TH/s</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-sm text-gray-400">Gas Price (Gwei)</span>
                    <span className="text-sm font-medium">24.6</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-sm text-gray-400">Latest Block</span>
                    <span className="text-sm font-medium">#18,245,692</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-400">ETH Price</span>
                    <span className="text-sm font-medium">$3,457.21</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
