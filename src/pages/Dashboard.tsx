import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink, ChevronsRight, AlertTriangle, FileSearch, Wallet } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import Globe from '@/components/dashboard/Globe';
import { useWebSocket } from '@/lib/websocket';
import { formatTimeAgo, formatAddress } from '@/lib/formatters';
import { useAppDispatch } from '@/store/hooks';

interface Activity {
  id: string;
  type: 'transaction' | 'alert' | 'wallet';
  title: string;
  description: string;
  address: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high';
}

interface IpLocation {
  lat: number;
  lon: number;
  address: string;
  size: number;
  intensity: number;
}

interface FlowData {
  from: {
    lat: number;
    lon: number;
    address: string;
  };
  to: {
    lat: number;
    lon: number;
    address: string;
  };
  value: number;
  risk: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [ipLocations, setIpLocations] = useState<IpLocation[]>([]);
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [stats, setStats] = useState({
    monitoredWallets: 1254,
    suspiciousFlows: 48,
    activeInvestigations: 23
  });
  
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
    
    const mockLocations = Array.from({ length: 25 }, () => ({
      lat: (Math.random() * 180) - 90,
      lon: (Math.random() * 360) - 180,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      size: Math.random() * 0.1 + 0.05,
      intensity: Math.random()
    }));
    
    setIpLocations(mockLocations);
    
    const mockFlows = Array.from({ length: 15 }, () => {
      const fromIndex = Math.floor(Math.random() * mockLocations.length);
      let toIndex = Math.floor(Math.random() * mockLocations.length);
      
      while (toIndex === fromIndex) {
        toIndex = Math.floor(Math.random() * mockLocations.length);
      }
      
      return {
        from: {
          lat: mockLocations[fromIndex].lat,
          lon: mockLocations[fromIndex].lon,
          address: mockLocations[fromIndex].address
        },
        to: {
          lat: mockLocations[toIndex].lat,
          lon: mockLocations[toIndex].lon,
          address: mockLocations[toIndex].address
        },
        value: Math.random(),
        risk: Math.random() * 100
      };
    });
    
    setFlows(mockFlows);
    
    const interval = setInterval(() => {
      setStats(prev => ({
        monitoredWallets: prev.monitoredWallets + (Math.random() > 0.7 ? 1 : 0),
        suspiciousFlows: prev.suspiciousFlows + (Math.random() > 0.8 ? 1 : 0),
        activeInvestigations: prev.activeInvestigations + (Math.random() > 0.9 ? 1 : 0)
      }));
      
      if (Math.random() > 0.7) {
        const types = ['transaction', 'alert', 'wallet'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        const severity = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'high' : 'medium') : 'low';
        
        const newActivity: Activity = {
          id: Date.now().toString(),
          type,
          title: type === 'transaction' 
            ? 'New Transaction Detected' 
            : type === 'alert' 
              ? 'Suspicious Activity Alert' 
              : 'Wallet Update',
          description: type === 'transaction'
            ? `${(Math.random() * 100).toFixed(2)} ETH transferred between wallets`
            : type === 'alert'
              ? 'Unusual transaction pattern identified'
              : 'New wallet added to monitoring list',
          address: `0x${Math.random().toString(16).substr(2, 40)}`,
          timestamp: new Date(),
          severity: type === 'alert' ? severity as 'low' | 'medium' | 'high' : undefined
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
        
        if (type === 'alert' && severity === 'high') {
          toast({
            title: 'High Risk Activity Detected',
            description: newActivity.description,
            variant: 'destructive',
          });
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [toast]);

  const globeLocations = ipLocations.map(loc => ({
    lat: loc.lat,
    lon: loc.lon,
    size: loc.size,
    intensity: loc.intensity,
    color: Math.random() > 0.3 ? '#9b87f5' : '#00ffff'
  }));
  
  const globeFlows = flows.map(flow => ({
    from: {
      lat: flow.from.lat,
      lon: flow.from.lon,
      size: 0.05,
      intensity: 0.8
    },
    to: {
      lat: flow.to.lat,
      lon: flow.to.lon,
      size: 0.05,
      intensity: 0.8
    },
    value: flow.value,
    color: flow.risk > 70 ? '#ff00ff' : flow.risk > 40 ? '#ffff00' : '#00ffff'
  }));

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
              <Globe 
                size={2}
                color="#1e1e45"
                wireframe={false}
                locations={globeLocations}
                flows={globeFlows}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <StatsCard 
            title="Monitored Wallets" 
            value={stats.monitoredWallets} 
            change={12}
            trend="up"
            icon={<Wallet className="h-6 w-6" />}
            color="blue"
          />
          
          <StatsCard 
            title="Suspicious Flows" 
            value={stats.suspiciousFlows} 
            change={7}
            trend="up"
            icon={<AlertTriangle className="h-6 w-6" />}
            color="amber"
          />
          
          <StatsCard 
            title="Active Investigations" 
            value={stats.activeInvestigations} 
            change={-3}
            trend="down"
            icon={<FileSearch className="h-6 w-6" />}
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
                      {activity.type === 'wallet' && <Wallet className="h-5 w-5 text-green-400" />}
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
                        <span className="text-xs font-mono text-gray-500">{formatAddress(activity.address)}</span>
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
