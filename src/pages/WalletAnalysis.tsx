
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '@/store';
import { fetchWalletDetails } from '@/store/slices/walletSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/table';
import { 
  Wallet as WalletIcon, 
  ArrowLeft,
  Download,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import WalletCard from '@/components/wallet/WalletCard';
import RiskGauge from '@/components/wallet/RiskGauge';
import { generateReport } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const WalletAnalysis = () => {
  const { address } = useParams<{ address: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const { 
    address: walletAddress,
    balance,
    transactions,
    firstSeen,
    riskScore,
    tags,
    recentTransactions,
    isLoading,
    error
  } = useSelector((state: RootState) => state.wallet);
  
  useEffect(() => {
    if (address) {
      dispatch(fetchWalletDetails(address));
    }
  }, [dispatch, address]);
  
  const handleGenerateReport = async () => {
    if (!address) return;
    
    setIsGeneratingReport(true);
    
    try {
      // Simulate API call for development
      //await generateReport(address);
      
      toast({
        title: "Report Generated",
        description: "The wallet analysis report has been successfully generated."
      });
      
      // Simulate download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#';
        link.setAttribute('download', `wallet-report-${address.substring(0, 8)}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1000);
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "There was an error generating the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  // Format transaction timestamp
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Truncate address
  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="container mx-auto pt-24 pb-12 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neon-blue border-r-transparent"></div>
            <span className="ml-3 text-gray-400">Loading wallet data...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !walletAddress) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="container mx-auto pt-24 pb-12 px-4">
          <div className="flex flex-col justify-center items-center h-64">
            <AlertTriangle className="h-12 w-12 text-amber-400 mb-4" />
            <h2 className="text-xl text-white mb-2">Error Loading Wallet</h2>
            <p className="text-gray-400 mb-4">{error || "Wallet address not found or invalid"}</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-12 px-4">
        <div className="mb-8 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              <span className="mr-3">Wallet Analysis</span>
            </h1>
            <div className="text-gray-400 font-mono mt-1">
              {address}
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGeneratingReport} 
            className="neon-border"
          >
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet Info & Risk */}
          <div className="space-y-6 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
            <WalletCard 
              address={walletAddress}
              balance={balance}
              riskScore={riskScore}
              tags={tags}
              firstSeen={firstSeen}
            />
            
            <Card className="glass border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Analysis of wallet risk factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <RiskGauge score={riskScore} animated size="lg" />
                </div>
                
                <div className="space-y-4 mt-6">
                  <div className="p-3 rounded-md bg-dark-lighter">
                    <div className="text-xs text-gray-400 mb-1">Risk Factors</div>
                    <div className="space-y-2">
                      {riskScore > 60 && (
                        <div className="text-sm text-amber-400 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1.5" />
                          Transaction pattern indicates potential mixing
                        </div>
                      )}
                      {riskScore > 40 && (
                        <div className="text-sm text-amber-400 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1.5" />
                          Connected to high-risk addresses
                        </div>
                      )}
                      {riskScore < 40 && (
                        <div className="text-sm text-gray-300">
                          No significant risk factors detected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Transactions & Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass border border-white/10 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Recent activity for this wallet</CardDescription>
                  </div>
                  <WalletIcon className="text-neon-blue h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <Link 
                      key={tx.hash} 
                      to={`/trace/${tx.hash}`}
                      className="block hover:bg-white/5 rounded-lg p-3 transition-colors"
                    >
                      <div className="flex justify-between">
                        <div className="font-mono text-sm text-gray-400">
                          {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 6)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="text-sm text-white font-medium">
                            {tx.value} ETH
                          </div>
                          <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="ml-2 text-gray-400 hover:text-white"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <div className="flex items-center text-sm">
                          <span className={`${tx.from === address ? 'text-red-400' : 'text-gray-400'}`}>
                            {tx.from === address ? 'OUT' : 'IN'}
                          </span>
                          <span className="mx-2 text-gray-500">
                            {tx.from === address ? 'to' : 'from'}
                          </span>
                          <span className="font-mono text-gray-400">
                            {truncateAddress(tx.from === address ? tx.to : tx.from)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(tx.timestamp)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border border-white/10 animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="pb-2">
                <CardTitle>Pattern Analysis</CardTitle>
                <CardDescription>Detected transaction patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  {riskScore > 60 ? (
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                      <p className="text-white font-medium">Suspicious transaction patterns detected</p>
                      <p className="text-gray-400 text-sm mt-2">This wallet shows signs of transaction layering</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-neon-green/20 text-neon-green flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      </div>
                      <p className="text-white font-medium">No suspicious patterns detected</p>
                      <p className="text-gray-400 text-sm mt-2">This wallet shows normal transaction behavior</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletAnalysis;
