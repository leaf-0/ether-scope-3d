
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateTraceFromWebSocket } from '@/store/slices/transactionSlice';

interface UseTraceWebSocketProps {
  url: string;
  enabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (event: Event) => void;
}

export const useTraceWebSocket = ({
  url,
  enabled = true,
  onOpen,
  onClose,
  onError
}: UseTraceWebSocketProps) => {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const connectWebSocket = () => {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connection established');
          setIsConnected(true);
          setError(null);
          if (onOpen) onOpen();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // Dispatch action to update Redux store with WebSocket data
            dispatch(updateTraceFromWebSocket(data));
          } catch (err) {
            console.error('Error processing WebSocket message:', err);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
          setIsConnected(false);
          if (onClose) onClose();
        };

        ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          setError(event);
          setIsConnected(false);
          if (onError) onError(event);
        };
      } catch (err) {
        console.error('Error creating WebSocket connection:', err);
      }
    };

    connectWebSocket();

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, enabled, dispatch, onOpen, onClose, onError]);

  const send = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected, cannot send data');
    }
  };

  return { isConnected, error, send };
};
