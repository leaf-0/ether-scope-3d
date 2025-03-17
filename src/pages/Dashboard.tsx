
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink, ChevronsRight, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import Globe from '@/components/dashboard/Globe';
import { useWebSocket } from '@/lib/websocket';

interface Activity {
  id: string;
  type: 'transaction' | 'alert' | 'wallet';
  title: string;
  description: string;
  address: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Connect to WebSocket for real-time updates
  const socket = useWebSocket({
    url: 'ws://localhost:5000/ws/activities',
    onMessage: (data) => {
      try {
        const activity = JSON.parse(data);
        if (activity && activity.type) {
          setActivities(prev => [activity, ...prev.slice(0, 19)]);
          
          if (activity.severity === 'high') {
            toast({
              title: 'High Risk Activity Detected',
              description: activity.description,
              variant: 'destructive',
            });
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    },
  });

  // Mock data for testing
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'transaction',
        title: 'Large Transaction Detected',
        description: '120 ETH transferred to exchange wallet',
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        timestamp: new Date(Date.now() - 5 * 60000),
      },
      {
        id: '2',
        type: 'alert',
        title: 'Suspicious Pattern Detected',
        description: 'Possible layering activity through multiple wallets',
        address: '0x3a2D5fC4A9e1249BD3C96534531eCb792FFE3fed',
        timestamp: new Date(Date.now() - 17 * 60000),
        severity: 'high',
      },
      {
        id: '3',
        type: 'wallet',
        title: 'New Wallet Added to Watchlist',
        description: 'Wallet associated with previous fraud cases',
        address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
        timestamp: new Date(Date.now() - 42 * 60000),
      },
    ];
    
    setActivities(mockActivities);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="glass overflow-hidden h-[350px]">
            <CardHeader className="pb-0">
              <CardTitle>Global Transaction Activity</CardTitle>
              <CardDescription>Real-time visualization of blockchain activity</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[300px]">
              <Globe />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <StatsCard 
            title="Monitored Wallets" 
            value="1,254" 
            change="+12"
            trend="up"
            icon="Wallet"
            color="blue"
          />
          
          <StatsCard 
            title="Suspicious Flows" 
            value="48" 
            change="+7"
            trend="up"
            icon="AlertTriangle"
            color="amber"
          />
          
          <StatsCard 
            title="Active Investigations" 
            value="23" 
            change="-3"
            trend="down"
            icon="FileSearch"
            color="green"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview">Activity Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-neon-blue">
                  View All <ChevronsRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-4 p-3 rounded-lg transition-colors hover:bg-white/5 cursor-pointer"
                    onClick={() => navigate(`/wallet/${activity.address}`)}
                  >
                    <div className={`rounded-full p-2 ${
                      activity.type === 'alert' 
                        ? 'bg-red-900/20' 
                        : activity.type === 'transaction' 
                          ? 'bg-blue-900/20' 
                          : 'bg-green-900/20'
                    }`}>
                      {activity.type === 'alert' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                      {activity.type === 'transaction' && <ExternalLink className="h-5 w-5 text-blue-400" />}
                      {activity.type === 'wallet' && <ExternalLink className="h-5 w-5 text-green-400" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-white truncate">{activity.title}</h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{activity.description}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs font-mono text-gray-500">{truncateAddress(activity.address)}</span>
                        {activity.severity === 'high' && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-sm text-[10px] bg-red-900/20 text-red-400">
                            HIGH RISK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-400">Alerts and notifications will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
