
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTransactionTrace, getMockTransactionTrace } from '../../lib/api';

interface Node {
  id: string;
  type: string;
  riskScore: number;
  value: string;
}

interface Edge {
  from: string;
  to: string;
  value: string;
  timestamp: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
}

interface TraceState {
  rootTransaction: Transaction | null;
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TraceState = {
  rootTransaction: null,
  nodes: [],
  edges: [],
  selectedNode: null,
  isLoading: false,
  error: null
};

// Thunk for fetching transaction trace
export const fetchTransactionTrace = createAsyncThunk(
  'transaction/fetchTrace',
  async (hash: string, { rejectWithValue }) => {
    try {
      // For development, use mock data
      // In production, use actual API call:
      // const data = await getTransactionTrace(hash);
      const data = getMockTransactionTrace(hash);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch transaction trace');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    selectNode: (state, action: PayloadAction<string>) => {
      state.selectedNode = action.payload;
    },
    clearSelectedNode: (state) => {
      state.selectedNode = null;
    },
    clearTraceData: () => initialState,
    updateNodes: (state, action: PayloadAction<Node[]>) => {
      // Add or update nodes from real-time data
      action.payload.forEach((newNode) => {
        const existingNodeIndex = state.nodes.findIndex(n => n.id === newNode.id);
        if (existingNodeIndex >= 0) {
          state.nodes[existingNodeIndex] = newNode;
        } else {
          state.nodes.push(newNode);
        }
      });
    },
    updateEdges: (state, action: PayloadAction<Edge[]>) => {
      // Add or update edges from real-time data
      action.payload.forEach((newEdge) => {
        const existingEdgeIndex = state.edges.findIndex(
          e => e.from === newEdge.from && e.to === newEdge.to
        );
        if (existingEdgeIndex >= 0) {
          state.edges[existingEdgeIndex] = newEdge;
        } else {
          state.edges.push(newEdge);
        }
      });
    },
    updateTraceFromWebSocket: (state, action: PayloadAction<any>) => {
      // Handle real-time updates from WebSocket
      const { nodes, edges } = action.payload;
      
      // Add new nodes
      nodes.forEach((node: Node) => {
        if (!state.nodes.find(n => n.id === node.id)) {
          state.nodes.push(node);
        }
      });
      
      // Add new edges
      edges.forEach((edge: Edge) => {
        if (!state.edges.find(e => e.from === edge.from && e.to === edge.to)) {
          state.edges.push(edge);
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionTrace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionTrace.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.rootTransaction = action.payload.rootTransaction;
        state.nodes = action.payload.nodes;
        state.edges = action.payload.edges;
      })
      .addCase(fetchTransactionTrace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  selectNode, 
  clearSelectedNode, 
  clearTraceData,
  updateTraceFromWebSocket,
  updateNodes,
  updateEdges
} = transactionSlice.actions;
export default transactionSlice.reducer;
