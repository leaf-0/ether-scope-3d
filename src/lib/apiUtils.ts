
import { getMockWalletDetails } from './api';
import { Transaction } from '@/store/slices/walletSlice';

// Define utility types
export interface GraphNode {
  id: string;
  type: 'wallet' | 'transaction' | 'contract';
  riskScore: number;
  value: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  value: string;
  timestamp: string;
}

export interface IpGeoData {
  ip: string;
  lat: number;
  lon: number;
  country: string;
  city: string;
  lastSeen: string;
}

// Transform wallet transactions into graph format
export const transformTransactionsToGraph = (
  address: string,
  transactions: Transaction[]
): { nodes: GraphNode[], edges: GraphEdge[] } => {
  const nodes: GraphNode[] = [
    {
      id: address,
      type: 'wallet',
      riskScore: 20, // Default risk score for the main wallet
      value: '0', // Value will be calculated
    }
  ];
  
  const edges: GraphEdge[] = [];
  const addedNodeIds = new Set<string>([address]);
  let totalValue = 0;
  
  // Process each transaction
  transactions.forEach(tx => {
    // Add transaction nodes if not already added
    if (!addedNodeIds.has(tx.hash)) {
      nodes.push({
        id: tx.hash,
        type: 'transaction',
        riskScore: Math.random() * 100, // Random risk score for demo
        value: tx.value,
      });
      addedNodeIds.add(tx.hash);
    }
    
    // Add counterparty wallet nodes if not already added
    const counterparty = tx.from === address ? tx.to : tx.from;
    if (!addedNodeIds.has(counterparty)) {
      nodes.push({
        id: counterparty,
        type: 'wallet',
        riskScore: Math.random() * 100, // Random risk score for demo
        value: tx.value,
      });
      addedNodeIds.add(counterparty);
    }
    
    // Add edges
    edges.push({
      from: tx.from,
      to: tx.to,
      value: tx.value,
      timestamp: tx.timestamp,
    });
    
    // Calculate total value
    totalValue += parseFloat(tx.value);
  });
  
  // Update main wallet node value
  const mainWalletNode = nodes.find(node => node.id === address);
  if (mainWalletNode) {
    mainWalletNode.value = totalValue.toString();
  }
  
  return { nodes, edges };
};

// Fetch wallet graph data
export const fetchWalletGraphData = async (address: string) => {
  try {
    // For now, use mock data from the API
    const walletData = getMockWalletDetails(address);
    
    // Transform transactions into graph format
    const graphData = transformTransactionsToGraph(
      address,
      walletData.recentTransactions || []
    );
    
    return graphData;
  } catch (error) {
    console.error('Error fetching wallet graph data:', error);
    throw error;
  }
};

// Simulate IP geo data for a wallet
export const getWalletIpData = (address: string): IpGeoData[] => {
  // In a real app, this would come from an API
  // For demo purposes, generate random IP locations
  const numLocations = Math.floor(Math.random() * 5) + 1;
  
  return Array.from({ length: numLocations }, (_, i) => ({
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    lat: (Math.random() * 180) - 90,
    lon: (Math.random() * 360) - 180,
    country: ['United States', 'Germany', 'Japan', 'Brazil', 'Australia', 'Russia', 'China', 'South Africa'][
      Math.floor(Math.random() * 8)
    ],
    city: ['New York', 'Berlin', 'Tokyo', 'São Paulo', 'Sydney', 'Moscow', 'Beijing', 'Cape Town'][
      Math.floor(Math.random() * 8)
    ],
    lastSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
  }));
};
