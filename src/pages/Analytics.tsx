
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, BarChart2, TrendingUp, Zap } from 'lucide-react';
import Globe from '@/components/dashboard/Globe';

const analyticsData = [
  { date: 'Jan', transactions: 65, volume: 400, gasUsed: 240 },
  { date: 'Feb', transactions: 59, volume: 300, gasUsed: 221 },
  { date: 'Mar', transactions: 80, volume: 600, gasUsed: 280 },
  { date: 'Apr', transactions: 81, volume: 400, gasUsed: 290 },
  { date: 'May', transactions: 56, volume: 500, gasUsed: 250 },
  { date: 'Jun', transactions: 55, volume: 400, gasUsed: 210 },
  { date: 'Jul', transactions: 40, volume: 220, gasUsed: 180 },
  { date: 'Aug', transactions: 94, volume: 760, gasUsed: 320 },
  { date: 'Sep', transactions: 65, volume: 550, gasUsed: 240 },
  { date: 'Oct', transactions: 71, volume: 530, gasUsed: 260 },
  { date: 'Nov', transactions: 83, volume: 640, gasUsed: 290 },
  { date: 'Dec', transactions: 79, volume: 610, gasUsed: 275 },
];

const hotspotData = [
  { id: 1, lat: 40.7128, lon: -74.0060, size: 0.08, intensity: 0.9, label: 'New York' },
  { id: 2, lat: 34.0522, lon: -118.2437, size: 0.07, intensity: 0.8, label: 'Los Angeles' },
  { id: 3, lat: 51.5074, lon: -0.1278, size: 0.08, intensity: 0.85, label: 'London' },
  { id: 4, lat: 35.6762, lon: 139.6503, size: 0.06, intensity: 0.7, label: 'Tokyo' },
  { id: 5, lat: 37.7749, lon: -122.4194, size: 0.05, intensity: 0.6, label: 'San Francisco' },
  { id: 6, lat: 1.3521, lon: 103.8198, size: 0.06, intensity: 0.7, label: 'Singapore' },
  { id: 7, lat: 55.7558, lon: 37.6173, size: 0.05, intensity: 0.65, label: 'Moscow' },
  { id: 8, lat: -33.8688, lon: 151.2093, size: 0.06, intensity: 0.75, label: 'Sydney' },
];

const flowData = [
  { from: hotspotData[0], to: hotspotData[2], value: 0.8 },
  { from: hotspotData[1], to: hotspotData[4], value: 0.7 },
  { from: hotspotData[2], to: hotspotData[5], value: 0.9 },
  { from: hotspotData[3], to: hotspotData[6], value: 0.6 },
  { from: hotspotData[0], to: hotspotData[7], value: 0.5 },
  { from: hotspotData[5], to: hotspotData[1], value: 0.85 },
];

const AnalyticsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  chartData, 
  dataKey,
  color
}: { 
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  chartData: any[];
  dataKey: string;
  color: string;
}) => {
  return (
    <Card className="bg-card/80 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="h-8 w-8 rounded-md bg-muted/60 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">{value}</div>
        <div className="h-[75px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-10 px-4 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground mb-8">Comprehensive blockchain network analytics</p>
        
        <Tabs defaultValue="overview" className="space-y-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Network Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transaction Metrics</TabsTrigger>
            <TabsTrigger value="geography">Geographical Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnalyticsCard 
                title="Total Transactions" 
                value="1.48M"
                description="Daily transaction count"
                icon={<Activity size={18} />}
                chartData={analyticsData.slice(-7)}
                dataKey="transactions"
                color="#9b87f5"
              />
              <AnalyticsCard 
                title="Network Volume" 
                value="$84.2M"
                description="Total ETH transferred"
                icon={<TrendingUp size={18} />}
                chartData={analyticsData.slice(-7)}
                dataKey="volume"
                color="#00D4FF"
              />
              <AnalyticsCard 
                title="Gas Used" 
                value="124.5 ETH"
                description="Total gas consumption"
                icon={<Zap size={18} />}
                chartData={analyticsData.slice(-7)}
                dataKey="gasUsed"
                color="#FF4D6A"
              />
              <AnalyticsCard 
                title="Active Users" 
                value="285.3K"
                description="Unique wallet addresses"
                icon={<BarChart2 size={18} />}
                chartData={analyticsData.slice(-7).map(d => ({ ...d, activeUsers: d.transactions * 3 }))}
                dataKey="activeUsers"
                color="#22c55e"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Transaction Volume Over Time</CardTitle>
                  <CardDescription>Monthly transaction trends for the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#888" 
                          tick={{ fill: '#888' }}
                        />
                        <YAxis stroke="#888" tick={{ fill: '#888' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#222', 
                            borderColor: '#444', 
                            color: '#fff' 
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="transactions" 
                          stroke="#9b87f5" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="volume" 
                          stroke="#00D4FF" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Resource Consumption</CardTitle>
                  <CardDescription>Gas used by month (in thousands)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#888" 
                          tick={{ fill: '#888' }}
                        />
                        <YAxis stroke="#888" tick={{ fill: '#888' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#222', 
                            borderColor: '#444',
                            color: '#fff' 
                          }} 
                        />
                        <Legend />
                        <Bar 
                          dataKey="gasUsed" 
                          fill="#FF4D6A" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-card/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Transaction Types Distribution</CardTitle>
                  <CardDescription>Breakdown of transaction categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: 'Transfers', count: 450 },
                          { type: 'Swaps', count: 320 },
                          { type: 'NFT Mints', count: 180 },
                          { type: 'Contract Deploy', count: 90 },
                          { type: 'Governance', count: 65 },
                          { type: 'Other', count: 120 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis type="number" stroke="#888" tick={{ fill: '#888' }} />
                        <YAxis 
                          dataKey="type" 
                          type="category" 
                          stroke="#888" 
                          tick={{ fill: '#888' }}
                          width={100}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#222', 
                            borderColor: '#444',
                            color: '#fff' 
                          }} 
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#00D4FF" 
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/80 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle>Gas Price Trends</CardTitle>
                    <CardDescription>Average gas price over time (Gwei)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { day: 'Mon', price: 25 },
                            { day: 'Tue', price: 32 },
                            { day: 'Wed', price: 28 },
                            { day: 'Thu', price: 40 },
                            { day: 'Fri', price: 35 },
                            { day: 'Sat', price: 22 },
                            { day: 'Sun', price: 18 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis 
                            dataKey="day" 
                            stroke="#888" 
                            tick={{ fill: '#888' }}
                          />
                          <YAxis stroke="#888" tick={{ fill: '#888' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#222', 
                              borderColor: '#444',
                              color: '#fff' 
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#FF4D6A" 
                            strokeWidth={2} 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/80 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle>Success Rate</CardTitle>
                    <CardDescription>Transaction success vs failure rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { day: 'Mon', success: 95, failed: 5 },
                            { day: 'Tue', success: 92, failed: 8 },
                            { day: 'Wed', success: 96, failed: 4 },
                            { day: 'Thu', success: 91, failed: 9 },
                            { day: 'Fri', success: 94, failed: 6 },
                            { day: 'Sat', success: 97, failed: 3 },
                            { day: 'Sun', success: 98, failed: 2 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis 
                            dataKey="day" 
                            stroke="#888" 
                            tick={{ fill: '#888' }}
                          />
                          <YAxis stroke="#888" tick={{ fill: '#888' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#222', 
                              borderColor: '#444',
                              color: '#fff' 
                            }} 
                          />
                          <Legend />
                          <Bar dataKey="success" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="failed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="geography" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-md overflow-hidden">
              <CardHeader>
                <CardTitle>Global Transaction Activity</CardTitle>
                <CardDescription>Live transaction hotspots and flows</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] w-full">
                  <Globe
                    size={2}
                    color="#00D4FF"
                    wireframe={true}
                    locations={hotspotData}
                    flows={flowData}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Regional Transaction Volume</CardTitle>
                  <CardDescription>Volume by geographic region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { region: 'North America', volume: 580 },
                          { region: 'Europe', volume: 520 },
                          { region: 'Asia', volume: 640 },
                          { region: 'South America', volume: 180 },
                          { region: 'Africa', volume: 120 },
                          { region: 'Oceania', volume: 90 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis type="number" stroke="#888" tick={{ fill: '#888' }} />
                        <YAxis 
                          dataKey="region" 
                          type="category" 
                          stroke="#888" 
                          tick={{ fill: '#888' }}
                          width={100}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#222', 
                            borderColor: '#444',
                            color: '#fff' 
                          }} 
                        />
                        <Bar 
                          dataKey="volume" 
                          fill="#9b87f5" 
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Activity Time Distribution</CardTitle>
                  <CardDescription>Transaction activity by time of day (UTC)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={Array.from({ length: 24 }, (_, i) => ({
                          hour: i,
                          activity: 20 + Math.sin(i / 24 * Math.PI * 2) * 15 + Math.random() * 10
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis 
                          dataKey="hour" 
                          stroke="#888" 
                          tick={{ fill: '#888' }}
                          tickFormatter={(hour) => `${hour}:00`}
                        />
                        <YAxis stroke="#888" tick={{ fill: '#888' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#222', 
                            borderColor: '#444',
                            color: '#fff' 
                          }}
                          labelFormatter={(hour) => `${hour}:00 UTC`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="activity" 
                          stroke="#00D4FF" 
                          strokeWidth={2} 
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
