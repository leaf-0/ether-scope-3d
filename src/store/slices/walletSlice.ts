import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getWalletDetails, getMockWalletDetails } from '../../lib/api';
import { toast } from '@/components/ui/use-toast';

export interface Transaction {
  hash: string;
  timestamp: string;
  value: string;
  to: string;
  from: string;
  gasUsed: string;
  status: string;
}

export interface RiskFactor {
  name: string;
  description: string;
  score: number;
  impact: 'high' | 'medium' | 'low';
}

export interface WalletDetails {
  address: string;
  balance: string;
  transactions: number;
  firstSeen: string;
  riskScore: number;
  tags: string[];
}

export interface IpLocation {
  ip: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  lastActive: string;
}

interface WalletState {
  address: string;
  balance: string;
  transactions: Transaction[];
  firstSeen: string;
  riskScore: number;
  tags: string[];
  recentTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  walletDetails: WalletDetails | null;
  riskFactors: RiskFactor[];
  ipLocations: IpLocation[];
}

const initialState: WalletState = {
  address: '',
  balance: '0',
  transactions: [],
  firstSeen: '',
  riskScore: 0,
  tags: [],
  recentTransactions: [],
  isLoading: false,
  error: null,
  walletDetails: null,
  riskFactors: [],
  ipLocations: []
};

// Thunk for fetching wallet details
export const fetchWalletDetails = createAsyncThunk(
  'wallet/fetchDetails',
  async (address: string, { rejectWithValue }) => {
    try {
      // For development, use mock data
      // In production, use actual API call:
      // const data = await getWalletDetails(address);
      const data = getMockWalletDetails(address);
      return data;
    } catch (error: any) {
      toast({
        title: "Error fetching wallet details",
        description: error.message || 'Failed to fetch wallet details',
        variant: "destructive"
      });
      return rejectWithValue(error.message || 'Failed to fetch wallet details');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletData: () => initialState,
    updateIpLocations: (state, action: PayloadAction<IpLocation[]>) => {
      state.ipLocations = action.payload;
    },
    setWalletRiskFactors: (state, action: PayloadAction<RiskFactor[]>) => {
      state.riskFactors = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.recentTransactions.unshift(action.payload);
      // Keep recent transactions limited to a reasonable number
      if (state.recentTransactions.length > 20) {
        state.recentTransactions = state.recentTransactions.slice(0, 20);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.walletDetails = {
          address: action.payload.address || '',
          balance: action.payload.balance || '0',
          transactions: action.payload.transactions || 0,
          firstSeen: action.payload.firstSeen || '',
          riskScore: action.payload.riskScore || 0,
          tags: action.payload.tags || []
        };
        state.address = action.payload.address || '';
        state.balance = action.payload.balance || '0';
        state.transactions = action.payload.recentTransactions || [];
        state.firstSeen = action.payload.firstSeen || '';
        state.riskScore = action.payload.riskScore || 0;
        state.tags = action.payload.tags || [];
        state.recentTransactions = action.payload.recentTransactions || [];
        state.riskFactors = action.payload.riskFactors || [];
        state.ipLocations = action.payload.ipLocations || [];
        
        // Show success toast
        toast({
          title: "Wallet loaded successfully",
          description: `Address: ${action.payload.address}`,
          variant: "default"
        });
      })
      .addCase(fetchWalletDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        
        // Show error toast
        toast({
          title: "Error loading wallet",
          description: action.payload as string,
          variant: "destructive"
        });
      });
  }
});

export const { clearWalletData, updateIpLocations, setWalletRiskFactors, addTransaction } = walletSlice.actions;
export default walletSlice.reducer;
