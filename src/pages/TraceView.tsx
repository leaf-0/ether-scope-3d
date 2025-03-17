
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, Search, Share, Download, Info } from 'lucide-react';
import { RootState } from '@/store';
import { fetchTransactionTrace, clearTraceData } from '@/store/slices/transactionSlice';
import TransactionGraph from '@/components/transactions/TransactionGraph';
import { useTraceWebSocket } from '@/hooks/useTraceWebSocket';

const TraceView = () => {
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('graph');
  const { rootTransaction, nodes, edges, selectedNode, isLoading, error } = useSelector(
    (state: RootState) => state.transaction
  );

  // Connect to WebSocket for real-time trace updates
  const ws = useTraceWebSocket({
    url: `ws://localhost:5000/ws/trace/${hash}`,
    onOpen: () => {
      console.log('Connected to trace WebSocket');
    }
  });

  useEffect(() => {
    if (hash) {
      dispatch(fetchTransactionTrace(hash) as any);
    }

    return () => {
      dispatch(clearTraceData());
    };
  }, [hash, dispatch]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShareTrace = () => {
    const url = `${window.location.origin}/trace/${hash}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied to clipboard',
      description: 'You can now share this trace with others.',
    });
  };

  const handleDownloadReport = () => {
    // In a real implementation, this would call the backend API to generate and download a report
    toast({
      title: 'Generating report',
      description: 'Your report is being generated and will download shortly.',
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatValue = (value: string) => {
    const valueNum = parseFloat(value);
    return valueNum.toFixed(6) + ' ETH';
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Transaction Trace</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleShareTrace}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="default" size="sm" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <Info className="h-5 w-5" />
              <p>Error loading transaction trace: {error}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {rootTransaction && (
            <Card className="glass">
              <CardContent className="py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-400">Transaction Hash</h3>
                    <p className="font-mono text-sm truncate">{rootTransaction.hash}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-400">From</h3>
                    <p className="font-mono text-sm truncate">{rootTransaction.from}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-400">To</h3>
                    <p className="font-mono text-sm truncate">{rootTransaction.to}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-400">Value</h3>
                    <p className="text-sm">{formatValue(rootTransaction.value)}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-400">Timestamp</h3>
                    <p className="text-sm">{formatDate(rootTransaction.timestamp)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="graph">3D Graph</TabsTrigger>
              <TabsTrigger value="table">Transaction Table</TabsTrigger>
            </TabsList>
            
            <TabsContent value="graph" className="space-y-4">
              <div className="h-[600px]">
                <TransactionGraph className="w-full h-full" />
              </div>
              
              {selectedNode && nodes.find(node => node.id === selectedNode) && (
                <Card className="glass">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Node Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <h3 className="text-xs font-medium text-gray-400">Address</h3>
                          <p className="font-mono text-xs truncate">{selectedNode}</p>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xs font-medium text-gray-400">Type</h3>
                          <p className="text-xs capitalize">
                            {nodes.find(node => node.id === selectedNode)?.type || 'Unknown'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xs font-medium text-gray-400">Risk Score</h3>
                          <p className="text-xs">
                            {nodes.find(node => node.id === selectedNode)?.riskScore || 'N/A'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xs font-medium text-gray-400">Value</h3>
                          <p className="text-xs">
                            {formatValue(nodes.find(node => node.id === selectedNode)?.value || '0')}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/wallet/${selectedNode}`)}
                        >
                          View Wallet Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="table">
              <Card className="glass">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-3 text-xs font-medium text-gray-400">From</th>
                          <th className="text-left p-3 text-xs font-medium text-gray-400">To</th>
                          <th className="text-left p-3 text-xs font-medium text-gray-400">Value</th>
                          <th className="text-left p-3 text-xs font-medium text-gray-400">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {edges.map((edge, index) => (
                          <tr key={index} className="border-b border-white/10">
                            <td className="p-3 font-mono text-xs truncate">
                              {edge.from.substring(0, 10)}...
                            </td>
                            <td className="p-3 font-mono text-xs truncate">
                              {edge.to.substring(0, 10)}...
                            </td>
                            <td className="p-3 text-xs">{formatValue(edge.value)}</td>
                            <td className="p-3 text-xs">{formatDate(edge.timestamp)}</td>
                          </tr>
                        ))}
                        {edges.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-3 text-center text-gray-400">
                              No transaction data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default TraceView;
