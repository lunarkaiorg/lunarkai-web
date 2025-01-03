import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { IMessage } from '@/types/message';
import { useUserContext } from '@/contexts';

interface SocketAuth {
  sessionToken: string | null;
  userId: string;
  chatId: string;
}

interface UseSocketProps {
 chatId: string;
 onStreamResponse: (message: IMessage) => void; 
 onStreamEnd?: () => void;
 socketRef?: React.MutableRefObject<Socket | null>;
}

export const useSocket = ({ chatId, onStreamResponse, onStreamEnd, socketRef: externalSocketRef }: UseSocketProps) => {
 const internalSocketRef = useRef<Socket<any, any> | null>(null);
 const socketRefToUse = externalSocketRef || internalSocketRef;
 const { user } = useUserContext();
 const [isConnected, setIsConnected] = useState(false);
 const [isReconnecting, setIsReconnecting] = useState(false);
 const [socketStatus, setSocketStatus] = useState<string>('');
 const reconnectAttemptsRef = useRef(0);
 const MAX_RECONNECT_ATTEMPTS = 5;
 const RECONNECT_DELAY = 1000;

 useEffect(() => {
   if (!user?.id) return;

   let reconnectTimer: NodeJS.Timeout;

   const initSocket = () => {
     if (socketRefToUse.current?.connected) {
       const currentAuth = (socketRefToUse.current as any).auth as SocketAuth;
       if (currentAuth?.chatId === chatId) {
         socketRefToUse.current.emit('joinChat', chatId);
         return;
       }
       
       socketRefToUse.current.emit('leaveChat', currentAuth?.chatId);
       socketRefToUse.current.disconnect();
     }

     const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4545', {
       transports: ['websocket'],
       auth: {
         sessionToken: localStorage.getItem('sessionToken'),
         userId: user.id,
         chatId
       } as SocketAuth,
       reconnectionDelayMax: 5000,
       reconnection: true,
       reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
       timeout: 20000,
       forceNew: false
     });

     socket.on('connect', () => {
       setIsConnected(true);
       setIsReconnecting(false);
       reconnectAttemptsRef.current = 0;
       socket.emit('joinChat', chatId);
     });

     socket.on('connect_error', (error) => {
       setIsConnected(false);
       handleReconnect(socket);
     });

     socket.on('disconnect', (reason) => {
       setIsConnected(false);
       if (reason === 'io server disconnect' || reason === 'transport close') {
         handleReconnect(socket);
       }
     });

     socket.on('error', (error) => {
       setIsConnected(false);
       handleReconnect(socket);
     });

     socket.on('status', ({ status }: { status: string }) => {
       setSocketStatus(status);
     });

     socket.on('streamResponse', (message: IMessage) => {
       if (message.chatId === chatId) {
         onStreamResponse(message);
       }
     });

     socket.on('streamEnd', () => {
       if (onStreamEnd) {
         onStreamEnd();
       }
     });

     socket.on('ping', () => {
       socket.emit('pong');
     });

     socketRefToUse.current = socket;
   };

   const handleReconnect = (socket: Socket) => {
     if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
       setIsReconnecting(false);
       if (onStreamEnd) {
         onStreamEnd();
       }
       return;
     }

     setIsReconnecting(true);
     reconnectAttemptsRef.current++;

     clearTimeout(reconnectTimer);
     reconnectTimer = setTimeout(() => {
       if (!isConnected && socket) {
         socket.connect();
       }
     }, RECONNECT_DELAY * reconnectAttemptsRef.current);
   };

   initSocket();

   return () => {
     clearTimeout(reconnectTimer);
     if (socketRefToUse.current?.connected) {
       socketRefToUse.current.emit('leaveChat', chatId);
     }
   };
 }, [chatId, user?.id, onStreamEnd, onStreamResponse]);

 const stopStream = useCallback(() => {
   if (socketRefToUse.current?.connected) {
     socketRefToUse.current.emit('stopStream', chatId);
   }
 }, [chatId]);

 const startStream = useCallback(() => {
   if (socketRefToUse.current?.connected) {
     socketRefToUse.current.emit('streamStart');
   }
 }, []);

 return {
   socket: socketRefToUse.current,
   stopStream,
   startStream,
   isConnected,
   isReconnecting,
   socketStatus
 };
};