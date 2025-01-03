"use client"
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useUserContext } from '@/contexts';
import LoadingIcon from '../Base/LoadingIcon';
import { Plus, Wallet } from 'iconoir-react';
import { baseButtonStyle } from '@/constants';

interface BalanceButtonProps {
  showLabel?: boolean;
  onPopupOpen: () => void;
}

const BalanceButton = ({ showLabel = false, onPopupOpen }: BalanceButtonProps) => {
  const { user, refetchUser } = useUserContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!user) return;
    setBalance(user.balance);
  }, [user]);

  useEffect(() => {
    if (!isExpanded) return;
    setIsLoading(true);
    refetchUser().finally(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showLabel && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (!showLabel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLabel]);

  const handleAddClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onPopupOpen();
  };

  return (
    <div className="relative" ref={buttonRef}>
      <motion.div
        initial={false}
        animate={{
          width: showLabel ? '11rem' : (!isLoading && isExpanded) ? 
            (Number(balance) >= 1000 ? '10rem' : (Number(balance) >= 100 ? '9rem' : '8.375rem')) : '40px',
        }}
        transition={{ duration: 0.2 }}
        className={`${baseButtonStyle} flex items-center select-none cursor-pointer overflow-hidden rounded-full h-10 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        onClick={() => !isLoading && !showLabel && setIsExpanded(!isExpanded)}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0 } }}
              transition={{ duration: 0.2 }}
              className="min-w-6 min-h-6 absolute left-1/2 -translate-x-1/2 -ml-[12px]"
            >
              <LoadingIcon isSmall />
            </motion.div>
          ) : (
            <Wallet 
              className={`text-[#FCFCFC] min-w-4 min-h-4 ${showLabel || isExpanded ? 'ml-3' : 'absolute left-1/2 -translate-x-1/2'}`} 
            />
          )}
        </AnimatePresence>
        <motion.span
          animate={{
            opacity: (!isLoading && isExpanded) || showLabel ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap pl-2 text-[#FCFCFC]"
        >
          ${balance.toFixed(2)}
        </motion.span>
        <motion.div 
          className="ml-auto flex items-center justify-center h-8 w-8 mr-1 cursor-pointer 
            hover:bg-[#FCFCFC]/20 rounded-full transition-colors duration-200"
          animate={{
            opacity: (!isLoading && isExpanded) || showLabel ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          onClick={handleAddClick}
          style={{ pointerEvents: (!isLoading && isExpanded) || showLabel ? 'auto' : 'none' }}
        >
          <div className="rounded-full h-4 w-4 flex items-center justify-center bg-[#FCFCFC]/20">
            <Plus className="text-[#FCFCFC] h-4 w-4" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BalanceButton;