
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

interface WalletState {
  address: string;
  balance: string;
  transactions: number;
  firstSeen: string;
  riskScore: number;
  tags: string[];
  recentTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: '',
  balance: '0',
  transactions: 0,
  firstSeen: '',
  riskScore: 0,
  tags: [],
  recentTransactions: [],
  isLoading: false,
  error: null
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
    clearWalletData: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        return { ...state, ...action.payload };
      })
      .addCase(fetchWalletDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearWalletData } = walletSlice.actions;
export default walletSlice.reducer;
