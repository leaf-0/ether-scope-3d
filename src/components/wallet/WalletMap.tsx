
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Globe from '@/components/dashboard/Globe';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { IpLocation } from '@/store/slices/walletSlice';

interface WalletMapProps {
  className?: string;
}

interface LocationPoint {
  lat: number;
  lon: number;
  size: number;
  intensity: number;
  color?: string;
}

interface FlowLine {
  from: LocationPoint;
  to: LocationPoint;
  value: number;
  color?: string;
}

const WalletMap: React.FC<WalletMapProps> = ({ className }) => {
  const { ipLocations, address } = useSelector((state: RootState) => state.wallet);
  const [selectedLocation, setSelectedLocation] = useState<IpLocation | null>(null);
  const [globeLocations, setGlobeLocations] = useState<LocationPoint[]>([]);
  const [globeFlows, setGlobeFlows] = useState<FlowLine[]>([]);

  // Transform IP locations data for the Globe component
  useEffect(() => {
    if (ipLocations.length > 0) {
      // Create globe locations
      const locations: LocationPoint[] = ipLocations.map(loc => ({
        lat: loc.lat,
        lon: loc.lon,
        size: 0.08,
        intensity: 0.9,
        color: '#9b87f5'
      }));
      
      setGlobeLocations(locations);
      
      // Create flows between locations
      if (locations.length > 1) {
        const flows: FlowLine[] = [];
        
        // Connect all locations with lines
        for (let i = 0; i < locations.length - 1; i++) {
          flows.push({
            from: locations[i],
            to: locations[i + 1],
            value: 0.5,
            color: '#ff00ff'
          });
        }
        
        setGlobeFlows(flows);
      }
    }
  }, [ipLocations]);

  return (
    <Card className={`glass overflow-hidden ${className}`}>
      <CardHeader className="pb-0">
        <CardTitle>IP Geolocation</CardTitle>
        <CardDescription>Known connection locations for this wallet</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] relative">
          <Globe 
            size={2}
            color="#1e1e45"
            wireframe={false}
            locations={globeLocations}
            flows={globeFlows}
          />
          
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 max-h-32 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">Connection Locations</h4>
            <div className="space-y-2">
              {ipLocations.length > 0 ? (
                ipLocations.map((loc, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between text-xs hover:bg-white/10 p-1 rounded cursor-pointer"
                    onClick={() => setSelectedLocation(loc === selectedLocation ? null : loc)}
                  >
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 bg-gray-800/50 px-1">
                        {loc.ip}
                      </Badge>
                      <span>
                        {loc.city}, {loc.country}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      {formatDistanceToNow(new Date(loc.lastActive), { addSuffix: true })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-xs">No location data available</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletMap;
