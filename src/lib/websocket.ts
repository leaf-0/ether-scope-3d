
import { useState, useEffect, useRef } from 'react';

interface WebSocketOptions {
  url: string;
  enabled?: boolean;
  onOpen?: () => void;
  onMessage?: (data: string) => void;
  onClose?: () => void;
  onError?: (event: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = ({
  url,
  enabled = true,
  onOpen,
  onMessage,
  onClose,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5
}: WebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connectWebSocket = () => {
    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      console.log(`Connecting to WebSocket: ${url}`);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        setError(null);
        setReconnectCount(0);
        if (onOpen) onOpen();
      };

      ws.onmessage = (event) => {
        if (onMessage) onMessage(event.data);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        
        // Try to reconnect if enabled and haven't exceeded max attempts
        if (enabled && reconnectCount < maxReconnectAttempts) {
          console.log(`Attempting to reconnect (${reconnectCount + 1}/${maxReconnectAttempts})...`);
          const timeout = window.setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connectWebSocket();
          }, reconnectInterval);
          
          reconnectTimeoutRef.current = timeout;
        }
        
        if (onClose) onClose();
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError(event);
        if (onError) onError(event);
      };
    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
    }
  };

  // Effect to establish WebSocket connection
  useEffect(() => {
    if (!enabled) return;

    connectWebSocket();

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, enabled]);

  // Function to send data over the WebSocket
  const send = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      wsRef.current.send(message);
    } else {
      console.error('WebSocket is not connected, cannot send data');
    }
  };

  return { isConnected, error, reconnectCount, send };
};

// Mock WebSocket for development (when real backend is not available)
export class MockWebSocket {
  private callbacks: {
    open: (() => void)[];
    message: ((data: any) => void)[];
    close: (() => void)[];
    error: ((event: any) => void)[];
  } = {
    open: [],
    message: [],
    close: [],
    error: []
  };
  
  readyState = WebSocket.OPEN;

  constructor(public url: string) {
    // Simulate connection open
    setTimeout(() => {
      this.callbacks.open.forEach(cb => cb());
    }, 500);
    
    // Simulate periodic messages
    setInterval(() => {
      const types = ['transaction', 'alert', 'wallet'];
      const type = types[Math.floor(Math.random() * types.length)];
      const severity = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'high' : 'medium') : 'low';
      
      const mockData = {
        id: Date.now().toString(),
        type,
        title: `New ${type} event`,
        description: `Simulated ${type} for development`,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        timestamp: new Date(),
        severity: type === 'alert' ? severity : undefined
      };
      
      this.callbacks.message.forEach(cb => cb(JSON.stringify(mockData)));
    }, 10000);
  }

  onopen(callback: () => void) {
    this.callbacks.open.push(callback);
  }
  
  onmessage(callback: (event: { data: any }) => void) {
    this.callbacks.message.push((data) => callback({ data }));
  }
  
  onclose(callback: () => void) {
    this.callbacks.close.push(callback);
  }
  
  onerror(callback: (event: any) => void) {
    this.callbacks.error.push(callback);
  }
  
  send(data: any) {
    console.log('MockWebSocket send:', data);
  }
  
  close() {
    this.callbacks.close.forEach(cb => cb());
  }
}

// Factory function to create either real or mock WebSocket based on environment
export const createWebSocket = (url: string): WebSocket | MockWebSocket => {
  // Check if we're in development mode or testing
  if (process.env.NODE_ENV === 'development' && url.includes('localhost')) {
    console.log('Using MockWebSocket for development');
    return new MockWebSocket(url) as unknown as WebSocket;
  }
  
  // Use real WebSocket in production
  return new WebSocket(url);
};
