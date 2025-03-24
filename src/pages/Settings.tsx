
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Bell, Eye, Lock, User, Database, Network } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    alerts: true,
    reports: false
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully"
    });
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Account Information</h3>
                    <p className="text-sm text-gray-400">Manage your personal information</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="ethereum_analyst" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="analyst@example.com" />
                  </div>
                </div>
                
                <Button className="mt-4" onClick={handleSaveSettings}>Save Changes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Notification Preferences</h3>
                    <p className="text-sm text-gray-400">Configure how you want to be notified</p>
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-400">Receive email alerts for suspicious activities</p>
                    </div>
                    <Switch 
                      checked={notifications.email} 
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">High Risk Alerts</h4>
                      <p className="text-sm text-gray-400">Get immediate notifications for high risk events</p>
                    </div>
                    <Switch 
                      checked={notifications.alerts} 
                      onCheckedChange={(checked) => setNotifications({...notifications, alerts: checked})} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Reports</h4>
                      <p className="text-sm text-gray-400">Receive weekly summary of blockchain activity</p>
                    </div>
                    <Switch 
                      checked={notifications.reports} 
                      onCheckedChange={(checked) => setNotifications({...notifications, reports: checked})} 
                    />
                  </div>
                </div>
                
                <Button className="mt-4" onClick={handleSaveSettings}>Save Preferences</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Security Settings</h3>
                    <p className="text-sm text-gray-400">Manage your account security</p>
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-400">Enable 2FA for additional account security</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <Button className="mt-4" onClick={handleSaveSettings}>Update Password</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">API Access</h3>
                    <p className="text-sm text-gray-400">Manage your API keys and access</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 border border-white/10 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">API Key</h4>
                      <p className="font-mono text-sm mt-1 text-gray-400">••••••••••••••••••••••••••••••</p>
                    </div>
                    <Button variant="outline" size="sm">Reveal</Button>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm">Regenerate Key</Button>
                    <Button variant="outline" size="sm">Copy Key</Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">API Rate Limits</h4>
                  <div className="bg-dark-lighter p-3 rounded-md">
                    <p className="text-sm">Current Plan: <span className="text-primary">Professional</span></p>
                    <p className="text-sm mt-1">Rate Limit: 100 requests/minute</p>
                    <p className="text-sm mt-1">Daily Quota: 10,000 requests</p>
                  </div>
                </div>
                
                <Button className="mt-4" variant="outline">Upgrade Plan</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
