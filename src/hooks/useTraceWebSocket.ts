
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateNodes, updateEdges } from '@/store/slices/transactionSlice';
import { toast } from '@/components/ui/use-toast';

interface WebSocketConfig {
  url: string;
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  retryCount?: number;
  maxRetries?: number;
}

export const useTraceWebSocket = ({
  url,
  onOpen,
  onMessage,
  onClose,
  onError,
  retryCount = 0,
  maxRetries = 3
}: WebSocketConfig) => {
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const connectWebSocket = () => {
      try {
        const socket = new WebSocket(url);
        ws.current = socket;

        socket.onopen = () => {
          console.info('WebSocket connection established');
          if (onOpen) onOpen();
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'node_update') {
              dispatch(updateNodes(data.nodes));
            } else if (data.type === 'edge_update') {
              dispatch(updateEdges(data.edges));
            }
            
            if (onMessage) onMessage(data);
          } catch (e) {
            console.error('Error processing WebSocket message:', e);
          }
        };

        socket.onclose = (event) => {
          console.info('WebSocket connection closed');
          if (onClose) onClose();
          
          // Try to reconnect if not manually closed and haven't exceeded max retries
          if (!event.wasClean && retryCount < maxRetries) {
            const timeout = Math.min(1000 * Math.pow(2, retryCount), 10000);
            reconnectTimeoutRef.current = window.setTimeout(() => {
              useTraceWebSocket({
                url,
                onOpen,
                onMessage,
                onClose,
                onError,
                retryCount: retryCount + 1,
                maxRetries
              });
            }, timeout);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (onError) onError(error);
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
      }
    };

    connectWebSocket();

    // Clean up WebSocket connection
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [url, retryCount]);

  return ws.current;
};
