
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import type { RootState, AppDispatch } from './index';
import { Transaction, IpLocation, RiskFactor } from './slices/walletSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for wallet data
export const useWalletData = (address?: string) => {
  const wallet = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();

  return {
    walletData: wallet,
    isLoading: wallet.isLoading,
    error: wallet.error,
    // Helper derived data
    hasData: wallet.address !== '',
    hasMatchingAddress: address ? wallet.address === address : true,
  };
};

// Custom hook for transaction data
export const useTransactionData = () => {
  const transaction = useAppSelector((state) => state.transaction);
  const dispatch = useAppDispatch();

  return {
    transactionData: transaction,
    isLoading: transaction.isLoading,
    error: transaction.error,
    hasData: transaction.nodes.length > 0,
  };
};

// Custom hook for filtered transactions
export const useFilteredTransactions = (filters?: {
  minValue?: number;
  maxValue?: number;
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
}) => {
  const transactions = useAppSelector((state) => state.wallet.transactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

  useEffect(() => {
    if (!filters) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(tx => {
      const value = parseFloat(tx.value);
      const date = new Date(tx.timestamp);
      
      // Apply value filters
      if (filters.minValue !== undefined && value < filters.minValue) {
        return false;
      }
      if (filters.maxValue !== undefined && value > filters.maxValue) {
        return false;
      }
      
      // Apply date filters
      if (filters.dateFrom && date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && date > filters.dateTo) {
        return false;
      }
      
      // Apply status filter
      if (filters.status && tx.status !== filters.status) {
        return false;
      }
      
      return true;
    });
    
    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  return filteredTransactions;
};

// Custom hook for IP location data
export const useIpLocations = () => {
  const ipLocations = useAppSelector((state) => state.wallet.ipLocations);
  
  // Compute some useful statistics
  const locationStats = {
    total: ipLocations.length,
    countries: new Set(ipLocations.map(loc => loc.country)).size,
    mostRecent: ipLocations.length > 0 
      ? ipLocations.reduce((latest, loc) => {
          return new Date(loc.lastActive) > new Date(latest.lastActive) ? loc : latest;
        }, ipLocations[0])
      : null
  };
  
  return {
    ipLocations,
    locationStats
  };
};

// Custom hook for risk analysis
export const useRiskAnalysis = () => {
  const riskScore = useAppSelector((state) => state.wallet.riskScore);
  const riskFactors = useAppSelector((state) => state.wallet.riskFactors);
  
  // Categorize risk factors
  const categorizedFactors = {
    high: riskFactors.filter(f => f.impact === 'high'),
    medium: riskFactors.filter(f => f.impact === 'medium'),
    low: riskFactors.filter(f => f.impact === 'low'),
  };
  
  // Calculate overall risk category
  const getRiskCategory = () => {
    if (riskScore < 30) return 'low';
    if (riskScore < 70) return 'medium';
    return 'high';
  };
  
  return {
    riskScore,
    riskFactors,
    categorizedFactors,
    riskCategory: getRiskCategory(),
    hasHighRiskFactors: categorizedFactors.high.length > 0
  };
};
