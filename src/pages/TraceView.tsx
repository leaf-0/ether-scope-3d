
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, Share, Download, Info } from 'lucide-react';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
import { fetchTransactionTrace, clearTraceData } from '@/store/slices/transactionSlice';
import WebGLErrorBoundary from '@/components/recovery/WebGLErrorBoundary';
import TransactionGraph from '@/components/transactions/TransactionGraph';
import SpiderMap from '@/components/transactions/SpiderMap';
import TransactionDetails from '@/components/transactions/TransactionDetails';
import { useTraceWebSocket } from '@/hooks/useTraceWebSocket';
import PageNavigation from '@/components/ui/page-navigation';

const TraceView = () => {
  const { hash } = useParams<{ hash: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { 
    rootTransaction, nodes, edges, selectedNode, isLoading, error 
  } = useSelector((state: RootState) => state.transaction);

  // Add pagination state for related transactions
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Connect to WebSocket for real-time trace updates
  useTraceWebSocket({
    url: `ws://localhost:5000/ws/trace/${hash}`,
    onOpen: () => {
      console.log('Connected to trace WebSocket');
    },
    onMessage: (data) => {
      console.log('Received trace update', data);
    },
    onClose: () => {
      console.log('Disconnected from trace WebSocket');
    },
    onError: (error) => {
      console.error('Trace WebSocket error', error);
    }
  });

  useEffect(() => {
    if (hash) {
      dispatch(fetchTransactionTrace(hash));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearTraceData());
    };
  }, [hash, dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Transaction Trace",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [activeTab, setActiveTab] = useState('graph');

  // Calculate related transactions pagination
  const relatedTransactions = edges.map(edge => ({
    from: edge.from,
    to: edge.to,
    value: edge.value,
    timestamp: edge.timestamp
  }));
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRelatedTransactions = relatedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(relatedTransactions.length / itemsPerPage);
  
  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!hash) {
    return (
      <div className="container max-w-7xl mx-auto py-6 space-y-6">
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Info className="h-12 w-12 text-neon-blue mb-4" />
            <h2 className="text-xl font-semibold">No Transaction Specified</h2>
            <p className="text-gray-400 mt-2">Please provide a transaction hash to trace.</p>
            <Button 
              variant="default" 
              className="mt-6" 
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Card className="glass overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="flex justify-between items-center">
            <span>Transaction Trace</span>
            {rootTransaction && (
              <span className="text-sm font-mono text-gray-400">
                {hash.substring(0, 8)}...{hash.substring(hash.length - 8)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        
        <Tabs defaultValue="graph" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <CardContent className="pt-0">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="graph">3D Graph</TabsTrigger>
              <TabsTrigger value="spider">Spider Map</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="graph" className="m-0">
                <WebGLErrorBoundary>
                  <div className="h-[600px]">
                    <TransactionGraph className="w-full h-full" />
                  </div>
                </WebGLErrorBoundary>
              </TabsContent>
              
              <TabsContent value="spider" className="m-0">
                <WebGLErrorBoundary>
                  <div className="h-[600px]">
                    <SpiderMap className="w-full h-full" />
                  </div>
                </WebGLErrorBoundary>
              </TabsContent>
              
              <TabsContent value="details" className="m-0">
                <TransactionDetails 
                  selectedNodeId={selectedNode} 
                />
                
                {relatedTransactions.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Related Transactions</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {currentRelatedTransactions.map((tx, index) => (
                        <Card key={index} className="glass overflow-hidden">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-400">From</p>
                                <p className="font-mono text-sm truncate">{tx.from}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">To</p>
                                <p className="font-mono text-sm truncate">{tx.to}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Value</p>
                                <p className="text-sm">{tx.value} ETH</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Date</p>
                                <p className="text-sm">{new Date(tx.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <PageNavigation 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="mt-4"
                    />
                  </div>
                )}
              </TabsContent>
            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default TraceView;
