
import { useState, useEffect, useCallback } from 'react';

interface WebSocketOptions {
  url: string;
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = ({
  url,
  onOpen,
  onMessage,
  onClose,
  onError,
  reconnect = true,
  reconnectAttempts = 5,
  reconnectInterval = 3000
}: WebSocketOptions) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setAttempts(0);
        if (onOpen) onOpen();
      };
      
      ws.onmessage = (event) => {
        if (onMessage) {
          try {
            const data = JSON.parse(event.data);
            onMessage(data);
          } catch (err) {
            // If it's not JSON, pass the raw data
            onMessage(event.data);
          }
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        if (onClose) onClose();
        
        // Attempt to reconnect if enabled
        if (reconnect && attempts < reconnectAttempts) {
          setTimeout(() => {
            setAttempts(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };
      
      setSocket(ws);
      
      return ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      return null;
    }
  }, [url, onOpen, onMessage, onClose, onError, reconnect, reconnectAttempts, reconnectInterval, attempts]);
  
  useEffect(() => {
    const ws = connect();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);
  
  const send = useCallback((data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(typeof data === 'string' ? data : JSON.stringify(data));
      return true;
    }
    return false;
  }, [socket]);
  
  return { isConnected, send };
};

// Legacy class for backward compatibility
export class TransactionWebSocket {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private messageHandlers: Array<(data: any) => void> = [];

  constructor(url: string = 'ws://localhost:5000/ws/trace') {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => this.reconnect(), this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
        }
      };
    });
  }

  private reconnect(): void {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    this.connect().catch(error => {
      console.error('Reconnection failed:', error);
    });
  }

  subscribe(handler: (data: any) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}

// Export a singleton instance
const traceWebSocket = new TransactionWebSocket();
export default traceWebSocket;
