
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, AlertCircle, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { RootState } from '@/store';
import { fetchWalletDetails } from '@/store/slices/walletSlice';
import WalletCard from '@/components/wallet/WalletCard';
import RiskGauge from '@/components/wallet/RiskGauge';
import TransactionTable from '@/components/transactions/TransactionTable';
import PageNavigation from '@/components/ui/page-navigation';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  gasUsed?: string;
  status?: string;
}

const WalletAnalysis = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showRiskDetails, setShowRiskDetails] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const walletState = useSelector((state: RootState) => state.wallet);
  const { isLoading, error, transactions, walletDetails, riskFactors } = walletState;
  
  useEffect(() => {
    if (address) {
      dispatch(fetchWalletDetails(address) as any);
    }
  }, [address, dispatch]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleDownloadReport = () => {
    toast({
      title: 'Generating report',
      description: 'Your wallet analysis report is being generated and will download shortly.',
    });
  };
  
  const mockTransactions: Transaction[] = [
    {
      hash: '0x8a008b8dbbc1d1e8e96e9d0b3fcb7648addf836a1f3c3bf0f9cc3bee3d1cf688',
      from: address || '0x0000000000000000000000000000000000000000',
      to: '0x7a16ff8270133f063aab6c9977183d9e72835428',
      value: '5.2',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      hash: '0x9723bcd079f487bcad3a50366b28c13f6d923683dc192657227f6c7bb88568f2',
      from: '0x2d7b6c95afeffa50c068867fa6e77f990efa4503',
      to: address || '0x0000000000000000000000000000000000000000',
      value: '12.8',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      hash: '0x1ab341b6b8c346d1f36d803e9dc078497d8ae6c47f5080654bc7b2e8ea75f91a',
      from: address || '0x0000000000000000000000000000000000000000',
      to: '0xb4d3c5c50f82eda8921d57bffc8febf9111c3ae3',
      value: '0.15',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  const mockRiskFactors = [
    { 
      name: 'Mixing Service Interaction',
      description: 'Transactions with known cryptocurrency mixing services detected',
      score: 75,
      impact: 'high' as const
    },
    { 
      name: 'Age of Wallet',
      description: 'Wallet was created less than 30 days ago',
      score: 60,
      impact: 'medium' as const
    },
    { 
      name: 'Transaction Patterns',
      description: 'Unusual transaction frequency and amounts',
      score: 45,
      impact: 'medium' as const
    },
  ];
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = (transactions && transactions.length > 0 ? transactions : mockTransactions)
    .slice(indexOfFirstItem, indexOfLastItem);
    
  const totalTransactions = (transactions && transactions.length > 0 ? transactions : mockTransactions).length;
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      
      const tableElement = document.getElementById('transaction-table');
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neon-blue border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-400">Loading wallet analysis...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>Error loading wallet details: {error}</p>
            </div>
            <Button variant="default" onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Wallet Analysis</h1>
        </div>
        <Button variant="default" size="sm" onClick={handleDownloadReport}>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WalletCard 
            address={address || '0x0000000000000000000000000000000000000000'}
            balance={walletDetails?.balance || '0.00'}
            riskScore={walletDetails?.riskScore || 50}
            tags={walletDetails?.tags || ['Exchange?', 'New Wallet']}
            firstSeen={walletDetails?.firstSeen}
          />
        </div>
        
        <div className="md:col-span-2">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RiskGauge 
                  score={walletDetails?.riskScore || 50} 
                  size="lg" 
                  animated={true} 
                />
                
                <div className="pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowRiskDetails(!showRiskDetails)}
                    className="w-full flex items-center justify-between text-xs"
                  >
                    <span>Risk Factor Details</span>
                    {showRiskDetails ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {showRiskDetails && (
                    <div className="mt-4 space-y-3">
                      {(riskFactors?.length ? riskFactors : mockRiskFactors).map((factor, index) => (
                        <div key={index} className="border border-white/10 rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">{factor.name}</h3>
                            <span className={`
                              text-xs px-2 py-0.5 rounded-md
                              ${factor.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                                factor.impact === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-green-500/20 text-green-400'}
                            `}>
                              {factor.impact.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{factor.description}</p>
                          <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                factor.score > 70 ? 'bg-red-500' :
                                factor.score > 40 ? 'bg-amber-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${factor.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview">Transaction History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div id="transaction-table">
            <TransactionTable 
              transactions={currentTransactions}
              title="Transaction History"
            />
            
            <PageNavigation 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-4"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Wallet Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <p className="text-gray-400">Analytics charts will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletAnalysis;
