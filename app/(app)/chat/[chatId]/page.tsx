"use client"
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from "framer-motion";
import Chat from '@/components/Chat/Chat';
import Navbar from '@/components/Navbar/Navbar';
import LoadingIcon from '@/components/Base/LoadingIcon';
import { IMessage } from '@/types/message';
import { useUserContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { Socket, io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { createAxiosInstance } from '@/lib/axios';
import { useAppKitNetwork } from '@reown/appkit/react';

export default function ChatPage({ params }: { params: { chatId: string } }) {
 const { user } = useUserContext();
 const [messages, setMessages] = useState<IMessage[]>([]);
 const [isStreaming, setIsStreaming] = useState(false);
 const socketRef = useRef<Socket | null>(null);
 const [inputValue, setInputValue] = useState('');
 const [loading, setLoading] = useState(false);
 const [initialLoading, setInitialLoading] = useState(true);
 const router = useRouter();
 const { chainId } = useAppKitNetwork();
 const [lastChunk, setLastChunk] = useState('');

 const handleStreamResponse = useCallback((message: IMessage) => {
  if (!isStreaming) {
    setIsStreaming(true);
  }
  setLoading(false);
  
  if (lastChunk === message.content) {
    return;
  }
  setLastChunk(message.content);
  
  setMessages(prev => {
    const messageIndex = prev.findIndex(m => m.id === message.id);
    if (messageIndex === -1) {
      return [...prev, {
        ...message,
        content: message.content,
        memory: message.memory 
      }];
    }

    const updatedMessages = [...prev];
    const currentMessage = prev[messageIndex];
    
    if (!currentMessage.content.includes(message.content)) {
      updatedMessages[messageIndex] = {
        ...currentMessage,
        content: currentMessage.content + message.content,
        memory: message.memory || currentMessage.memory
      };
    }
    
    return updatedMessages;
  });
}, [isStreaming, lastChunk]);

 const handleStreamEnd = useCallback(() => {
   setIsStreaming(false);
   setLoading(false);
 }, []);

 const { socket, isConnected, isReconnecting, socketStatus, stopStream, startStream } = useSocket({
   chatId: params.chatId,
   onStreamResponse: handleStreamResponse,
   onStreamEnd: handleStreamEnd,
   socketRef
 });

 const fetchMessages = useCallback(async () => {
   try {
     const { data } = await createAxiosInstance().get(`/chat/${params.chatId}`, {
       params: { userId: user?.id }
     });
     if (data.userId !== user?.id) {
       router.push('/');
       return;
     }
     
     if (data?.messages) {
       setMessages(data.messages);
     }
   } catch (error) {
    console.error('Fetch messages error:', error);
   } finally {
     setInitialLoading(false);
   }
 }, [params.chatId, user?.id, router]);

 useEffect(() => {
   const lastMessage = messages[messages.length - 1];
   
   if (lastMessage?.role === 'user') {
     const previousMessage = messages[messages.length - 2];
     if (!previousMessage || previousMessage.role === 'lunark') {
       setLoading(true);
       
       const currentTime = new Date().getTime();
       const messageTime = new Date(lastMessage.createdAt).getTime();
       const timeDifference = (currentTime - messageTime) / 1000 / 60;
       
       if (timeDifference >= 5) {
         setLoading(false);
         toast.error('Chat timed out. Please send another message.');
       }
     }
   }
 }, [messages]);

 useEffect(() => {
   if (!user || !params.chatId) return;
   fetchMessages();
 }, [user, params.chatId, fetchMessages]);

 const handleStreamControl = useCallback(() => {
   if (isStreaming) {
     stopStream();
     requestAnimationFrame(() => {
       setIsStreaming(false);
     });
   }
 }, [isStreaming, stopStream]);

 const handleSubmit = async (value: string) => {
  if (!value.trim() || !chainId || loading || isStreaming) return;
    
  const tempUserMessage: IMessage = {
    id: Date.now().toString(),  
    chatId: params.chatId,
    role: 'user',
    content: value,
    transaction: null,
    toolData: null,
    memory: null,  
    createdAt: new Date()
  };

  setMessages(prev => [...prev, tempUserMessage]);
  setInputValue('');
  setLoading(true);

  try {
    startStream();
    await createAxiosInstance().post(`/chat/${params.chatId}/message`, {
      content: value,
      chainId,
      userId: user?.id
    });
  } catch (error: any) {
    setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
    setLoading(false);
  }
};

 useEffect(() => {
   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key === 'Escape' && isStreaming) {
       stopStream();
       setIsStreaming(false);
     }
   };
  
   window.addEventListener('keydown', handleKeyDown);
   return () => window.removeEventListener('keydown', handleKeyDown);
 }, [isStreaming, stopStream]);

 return (
   <main className="flex flex-col w-screen min-h-screen bg-black overflow-hidden py-6">
     <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6">
       <Navbar />
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="w-full max-w-3xl mx-auto relative min-h-[calc(100vh-212px)]"
       >
         {initialLoading ? (
           <div className="absolute inset-0 flex items-center justify-center">
             <LoadingIcon />
           </div>
         ) : (
           <Chat 
             messages={messages}
             inputValue={inputValue}
             isConnected={!loading && isConnected && !initialLoading && !isReconnecting}
             onSubmit={handleSubmit}
             onInputChange={setInputValue}
             loading={loading}
             isStreaming={isStreaming}
             onStreamControl={handleStreamControl}
             socketStatus={socketStatus}
           />
         )}
       </motion.div>
     </div>
   </main>
 );
}