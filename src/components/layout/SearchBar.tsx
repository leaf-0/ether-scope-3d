
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Simple validation for Ethereum addresses and tx hashes
    if (query.startsWith('0x')) {
      // Check if it's likely an Ethereum address (42 chars including 0x)
      if (query.length === 42) {
        navigate(`/wallet/${query}`);
      } 
      // Check if it's likely a transaction hash (66 chars including 0x)
      else if (query.length === 66) {
        navigate(`/trace/${query}`);
      } 
      // Invalid format
      else {
        toast({
          title: "Invalid format",
          description: "Please enter a valid Ethereum address or transaction hash",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Invalid format",
        description: "Search query must start with 0x",
        variant: "destructive"
      });
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanding
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  const handleClear = () => {
    setQuery('');
    document.getElementById('search-input')?.focus();
  };

  return (
    <div className={`relative transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'w-10'}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        {isExpanded ? (
          <>
            <Input
              id="search-input"
              type="text"
              placeholder="Search address or tx (0x...)"
              className="w-full bg-dark-lighter border-none focus-visible:ring-neon-blue pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-0 top-0 h-full"
              onClick={toggleExpanded}
            >
              <Search className="h-4 w-4 text-gray-400" />
            </Button>
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={handleClear}
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className="p-0 h-10 w-10 rounded-full"
          >
            <Search className="h-5 w-5 text-gray-300" />
          </Button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
