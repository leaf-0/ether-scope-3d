
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface TransactionDetailsProps {
  selectedNodeId?: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ selectedNodeId }) => {
  const { rootTransaction, nodes } = useSelector((state: RootState) => state.transaction);
  
  const selectedNode = selectedNodeId 
    ? nodes.find(node => node.id === selectedNodeId) 
    : null;
  
  // If no node is selected, show transaction details
  if (!selectedNode) {
    if (!rootTransaction) {
      return (
        <Card className="glass">
          <CardContent className="p-6 text-center text-gray-400">
            No transaction or node selected
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Root transaction information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Transaction Hash</h3>
              <p className="font-mono text-xs break-all mt-1">{rootTransaction.hash}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Timestamp</h3>
              <p className="text-xs mt-1">
                {new Date(rootTransaction.timestamp).toLocaleString()}
                <span className="text-gray-500 ml-2">
                  ({formatDistanceToNow(new Date(rootTransaction.timestamp), { addSuffix: true })})
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">From</h3>
              <p className="font-mono text-xs break-all mt-1">{rootTransaction.from}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">To</h3>
              <p className="font-mono text-xs break-all mt-1">{rootTransaction.to}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Value</h3>
              <p className="text-xs mt-1">{rootTransaction.value} ETH</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show selected node details
  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Node Details</CardTitle>
            <CardDescription>
              Selected node information
            </CardDescription>
          </div>
          <Badge variant={
            selectedNode.riskScore < 30 ? "success" : 
            selectedNode.riskScore < 70 ? "warning" : "destructive"
          }>
            Risk Score: {selectedNode.riskScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Address</h3>
            <p className="font-mono text-xs break-all mt-1">{selectedNode.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Type</h3>
            <p className="text-xs mt-1 capitalize">{selectedNode.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Value</h3>
            <p className="text-xs mt-1">{selectedNode.value} ETH</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
