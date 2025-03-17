
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getWalletDetails, getMockWalletDetails } from '../../lib/api';

interface Transaction {
  hash: string;
  timestamp: string;
  value: string;
  to: string;
  from: string;
  gasUsed: string;
  status: string;
}

interface RiskFactor {
  name: string;
  description: string;
  score: number;
  impact: 'high' | 'medium' | 'low';
}

interface WalletDetails {
  address: string;
  balance: string;
  transactions: number;
  firstSeen: string;
  riskScore: number;
  tags: string[];
}

interface IpLocation {
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
      })
      .addCase(fetchWalletDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearWalletData, updateIpLocations } = walletSlice.actions;
export default walletSlice.reducer;
