
import axios from 'axios';

// Base API URL - update with actual backend URL in production
const BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Wallet API
export const getWalletDetails = async (address: string) => {
  try {
    const response = await api.get(`/wallet/${address}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet details:', error);
    throw error;
  }
};

// Transaction API
export const getTransactionDetails = async (hash: string) => {
  try {
    const response = await api.get(`/transaction/${hash}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};

// Trace API
export const getTransactionTrace = async (hash: string) => {
  try {
    const response = await api.get(`/trace/${hash}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction trace:', error);
    throw error;
  }
};

// Report API
export const generateReport = async (address: string) => {
  try {
    const response = await api.post(`/report/${address}`);
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export const getReport = async (reportId: string) => {
  try {
    const response = await api.get(`/report/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

// Mock data for development
export const getMockWalletDetails = (address: string) => {
  return {
    address,
    balance: '158.42',
    transactions: 47,
    firstSeen: '2023-01-15T10:23:45Z',
    riskScore: 68,
    tags: ['exchange', 'mixer?'],
    recentTransactions: [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        timestamp: '2023-08-10T14:22:31Z',
        value: '12.5',
        to: '0xabcdef1234567890abcdef1234567890abcdef12',
        from: address,
        gasUsed: '21000',
        status: 'success'
      },
      {
        hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
        timestamp: '2023-08-09T09:15:20Z',
        value: '8.3',
        to: address,
        from: '0x9876543210abcdef9876543210abcdef98765432',
        gasUsed: '21000',
        status: 'success'
      }
    ]
  };
};

export const getMockTransactionTrace = (hash: string) => {
  return {
    rootTransaction: {
      hash,
      from: '0x1234567890abcdef1234567890abcdef12345678',
      to: '0xabcdef1234567890abcdef1234567890abcdef12',
      value: '50.0',
      timestamp: '2023-08-05T11:22:33Z'
    },
    nodes: [
      {
        id: '0x1234567890abcdef1234567890abcdef12345678',
        type: 'wallet',
        riskScore: 25,
        value: '50.0',
      },
      {
        id: '0xabcdef1234567890abcdef1234567890abcdef12',
        type: 'wallet',
        riskScore: 40,
        value: '50.0',
      },
      {
        id: '0x7890abcdef1234567890abcdef1234567890abcd',
        type: 'wallet',
        riskScore: 75,
        value: '30.0',
      },
      {
        id: '0xef1234567890abcdef1234567890abcdef123456',
        type: 'wallet',
        riskScore: 90,
        value: '20.0',
      },
      {
        id: '0x567890abcdef1234567890abcdef1234567890ab',
        type: 'wallet',
        riskScore: 30,
        value: '10.0',
      }
    ],
    edges: [
      {
        from: '0x1234567890abcdef1234567890abcdef12345678',
        to: '0xabcdef1234567890abcdef1234567890abcdef12',
        value: '50.0',
        timestamp: '2023-08-05T11:22:33Z'
      },
      {
        from: '0xabcdef1234567890abcdef1234567890abcdef12',
        to: '0x7890abcdef1234567890abcdef1234567890abcd',
        value: '30.0',
        timestamp: '2023-08-05T11:25:12Z'
      },
      {
        from: '0xabcdef1234567890abcdef1234567890abcdef12',
        to: '0xef1234567890abcdef1234567890abcdef123456',
        value: '20.0',
        timestamp: '2023-08-05T11:26:45Z'
      },
      {
        from: '0x7890abcdef1234567890abcdef1234567890abcd',
        to: '0x567890abcdef1234567890abcdef1234567890ab',
        value: '10.0',
        timestamp: '2023-08-05T12:01:20Z'
      }
    ]
  };
};

export default api;
