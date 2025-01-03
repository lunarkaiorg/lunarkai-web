"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContext, useUserContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar/Navbar';
import Header from './components/Header';
import { HomeFooter } from './components/Footer';
import ChatInput from '@/components/Chat/ChatInput';
import toast from 'react-hot-toast';
import { createAxiosInstance } from './lib/axios';
import { useAppKitNetwork } from '@reown/appkit/react';
import BrainAnimation from './components/BrainAnimation';
import { SendDiagonal } from 'iconoir-react';

export default function Home() {
  const router = useRouter();
  const { user } = useUserContext();
  const { status } = useGlobalContext();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { chainId } = useAppKitNetwork(); 

  const handleSubmit = async (value: string) => {
    if (!value.trim() || !chainId || loading) return;

    if (!user || !status) {
      toast.error('You must be connected to use Lunark AI.');
      return;
    }

    if (!(user?.termsSignature)) {
      toast.error('You must accept the terms and conditions to use Lunark AI.');
      return;
    }
    
    try {
      setLoading(true);
      const { data } = await createAxiosInstance().post('/chat', {
        message: value,
        userId: user.id,
        chainId 
      });
      if (data?.chatId) {
        router.push(`/chat/${data.chatId}`);
      }
     } catch (error: any) {
      setLoading(false);
     }
  };

  return (
    <>
      <main className="flex flex-col w-screen min-h-screen bg-black py-6">
        <div className={`transition-all duration-300 ${inputValue !== '' || loading ? 'opacity-30 ' : ''}`}>
          <BrainAnimation />
        </div>
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 overflow-hidden">
          <Navbar />
          <div className="w-full max-w-3xl mx-auto relative pt-4 sm:pt-0 pb-16 sm:mt-auto min-h-[calc(100vh-140px)] flex flex-col items-start sm:items-center justify-center">
            <AnimatePresence mode="wait">
              <Header />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="mt-4 mb-8 w-full"
                key="chat-input"
              >
                <div className='w-[95%] md:w-[80%] mx-auto'>
                  <ChatInput 
                    onSubmit={handleSubmit} 
                    value={inputValue} 
                    onChange={setInputValue} 
                    disabled={!user || loading || !status}
                    placeholder={!status ? "Lunark is sleeping..." : "How can I help with your blockchain journey?"}
                    submitIcon={SendDiagonal}
                    showSubmitButton
                    loading={loading}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
            <HomeFooter />
          </div>
        </div>
      </main>
    </>
  );
}