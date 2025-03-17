
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, ExternalLink } from 'lucide-react';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  method?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  title?: string;
  isLoading?: boolean;
  maxItems?: number;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  title = 'Transaction History',
  isLoading = false,
  maxItems = 10
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Transaction>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const formatValue = (value: string) => {
    const valueNum = parseFloat(value);
    return valueNum.toFixed(6) + ' ETH';
  };
  
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort transactions
  const filteredAndSortedTransactions = transactions
    .filter(tx => 
      tx.hash.toLowerCase().includes(search.toLowerCase()) ||
      tx.from.toLowerCase().includes(search.toLowerCase()) ||
      tx.to.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'value') {
        // Sort numerically for value
        const valA = parseFloat(a[sortField]);
        const valB = parseFloat(b[sortField]);
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      } else if (sortField === 'timestamp') {
        // Sort by date
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // Sort alphabetically for strings
        const valA = a[sortField].toString().toLowerCase();
        const valB = b[sortField].toString().toLowerCase();
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
    })
    .slice(0, maxItems);
  
  const handleRowClick = (txHash: string) => {
    navigate(`/trace/${txHash}`);
  };
  
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
          <CardTitle>{title}</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-8 bg-dark-lighter border-none focus-visible:ring-neon-blue w-full md:w-56"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('hash')} className="flex items-center">
                    <span className="text-xs font-medium text-gray-400">Tx Hash</span>
                    {sortField === 'hash' && (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('from')} className="flex items-center">
                    <span className="text-xs font-medium text-gray-400">From</span>
                    {sortField === 'from' && (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('to')} className="flex items-center">
                    <span className="text-xs font-medium text-gray-400">To</span>
                    {sortField === 'to' && (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('value')} className="flex items-center">
                    <span className="text-xs font-medium text-gray-400">Value</span>
                    {sortField === 'value' && (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('timestamp')} className="flex items-center">
                    <span className="text-xs font-medium text-gray-400">Time</span>
                    {sortField === 'timestamp' && (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </th>
                <th className="text-right p-3"><span className="text-xs font-medium text-gray-400">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-3 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-neon-blue border-r-transparent" />
                      <span className="text-gray-400">Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedTransactions.length > 0 ? (
                filteredAndSortedTransactions.map((tx) => (
                  <tr 
                    key={tx.hash} 
                    onClick={() => handleRowClick(tx.hash)}
                    className="border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-mono text-xs">{truncateAddress(tx.hash)}</td>
                    <td className="p-3 font-mono text-xs">{truncateAddress(tx.from)}</td>
                    <td className="p-3 font-mono text-xs">{truncateAddress(tx.to)}</td>
                    <td className="p-3 text-xs">{formatValue(tx.value)}</td>
                    <td className="p-3 text-xs">{formatDate(tx.timestamp)}</td>
                    <td className="p-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-gray-400">
                    {search ? 'No matching transactions found' : 'No transactions available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
