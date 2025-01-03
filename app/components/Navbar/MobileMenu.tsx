"use client"

import { motion, AnimatePresence } from "framer-motion";
import NetworkButtonMobile from './NetworkButtonMobile';
import BalanceButtonMobile from "./BalanceButtonMobile";
import { Archive, BookStack, LogOut, Plus, Settings } from "iconoir-react";
import { baseButtonStyle } from "@/constants";
import { createAxiosInstance } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAppKitNetwork } from '@reown/appkit/react';
import { useState } from 'react';
import LoadingIcon from '../Base/LoadingIcon';

interface MobileMenuProps {
  user: any;
  status: any;
  displayAddress: string;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  toggleMenu: () => void;
  onPopupOpen: () => void;
}

const MobileMenu = ({ 
  user, 
  status,
  displayAddress, 
  handleConnect, 
  handleDisconnect,
  toggleMenu,
  onPopupOpen 
}: MobileMenuProps) => {
  const router = useRouter();
  const { chainId } = useAppKitNetwork();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const createNewChat = async () => {
    if (!status || !user || !chainId || isCreatingChat) return;

    setIsCreatingChat(true);
    try {
      const response = await createAxiosInstance().post('chat', {
        userId: user.id,
        chainId,
        message: "Hi Lunark!"
      });
      router.push(`/chat/${response.data.chatId}`);
      toggleMenu();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create new chat');
    } finally {
      setIsCreatingChat(false);
    }
  };

  const renderConnectButton = () => (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${baseButtonStyle} flex items-center gap-2 justify-center w-full px-3 py-2 rounded-full max-w-[140px] mx-4`}
      disabled={!status}
      onClick={() => {
        handleConnect();
        toggleMenu();
      }}
    >
      Sign In
    </motion.button>
  );

  return (
    <AnimatePresence mode="wait">
      {true && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 flex items-center justify-center"
          style={{ height: '100vh' }}
        >
          {!user ? renderConnectButton() : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-fit max-w-[320px] space-y-4 px-4 flex flex-col items-center justify-center"
            >
              <motion.div
                key="new-chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.2,
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.15 },
                  delay: 0.15 
                }}
                className="w-full flex items-center justify-center"
              >
                <button
                  onClick={createNewChat}
                  disabled={isCreatingChat}
                  className={`${baseButtonStyle} flex items-center gap-2 justify-center w-full px-3 h-[40px] rounded-full`}
                >
                  {isCreatingChat ? (
                    <LoadingIcon isSmall />
                  ) : (
                    <Plus height={22} width={22} />
                  )}
                  New Chat
                </button>
              </motion.div>
              <motion.div
                key="network-button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.2,
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.15 },
                  delay: 0.25 
                }}
                className="w-full flex items-center justify-center"
              >
                <NetworkButtonMobile showLabel className="w-full h-[40px]" />
              </motion.div>
              <motion.div
                key="balance-button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.2,
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.15 },
                  delay: 0.35 
                }}
                className="w-full flex items-center justify-center"
              >
                <BalanceButtonMobile showLabel onPopupOpen={onPopupOpen} className="w-full h-[40px]" />
              </motion.div>
              <motion.a
                key="history"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.2,
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.15 },
                  delay: 0.45 
                }}
                href="/history"
                className={`${baseButtonStyle} flex items-center gap-2 justify-center w-full px-3 h-[40px] rounded-full`}
                onClick={toggleMenu}
              >
                <Archive height={21} width={21} />
                History
              </motion.a>
              <motion.a
                key="settings"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.2,
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.15 },
                  delay: 0.55 
                }}
                href="/settings"
                className={`${baseButtonStyle} flex items-center gap-2 justify-center w-full px-3 h-[40px] rounded-full`}
                onClick={toggleMenu}
              >
                <Settings height={22} width={22} />
                Settings
              </motion.a>
              <motion.a
                key="documentation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.2,
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.15 },
                  delay: 0.65 
                }}
                href="https://docs.lunarkai.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${baseButtonStyle} flex items-center gap-2 justify-center w-full px-3 h-[40px] rounded-full`}
              >
                <BookStack height={22} width={22} />
                Documentation
              </motion.a>
              <motion.button
                key="sign-out"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.2,
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.15 },
                  delay: 0.75 
                }}
                className={`${baseButtonStyle} flex items-center gap-2 justify-center w-full px-3 h-[40px] rounded-full border-red-500/50 hover:border-red-500/75`}
                onClick={() => {
                  handleDisconnect();
                  toggleMenu();
                }}
              >
                <LogOut height={22} width={22} />
                Sign Out
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;