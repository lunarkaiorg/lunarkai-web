"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, BookStack, Menu, Xmark, Archive, Plus, Settings } from 'iconoir-react';
import { useAppKitAccount, useAppKit, useAppKitNetwork } from '@reown/appkit/react';
import NetworkButton from './NetworkButton';
import Link from 'next/link';
import { useGlobalContext, useUserContext } from '@/contexts';
import Image from 'next/image';
import MobileMenu from './MobileMenu';
import BalanceButton from './BalanceButton';
import BalancePopup from '../Popup/BalancePopup';
import { ethers } from 'ethers';
import Tooltip from '../Base/Tooltip';
import { createAxiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { baseButtonStyle } from '@/constants';
import LoadingIcon from '../Base/LoadingIcon';

const iconButtonStyle = `
  ${baseButtonStyle}
  flex items-center gap-3 
  h-10 w-10 
  justify-center 
  items-center 
  rounded-full
  text-[#FCFCFC]
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { user, disconnect } = useUserContext();
  const router = useRouter();
  const { address } = useAppKitAccount();
  const { open } = useAppKit();
  const { status } = useGlobalContext();
  const { chainId } = useAppKitNetwork();
  const [displayAddress, setDisplayAddress] = useState('');
  const [isBalancePopupLoading, setIsBalancePopupLoading] = useState(false);

  const menuItemsVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.05,
      }
    },
    closed: {
      x: 50,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.05,
      }
    }
  };

  const itemVariant = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    closed: {
      x: 50,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(false);
    setTimeout(() => {
      setIsDesktopMenuOpen(!isDesktopMenuOpen);
    }, 50);
  };

  useEffect(() => {
    if (address) {
      setDisplayAddress(`${ethers.getAddress(address).slice(0, 6)}...${ethers.getAddress(address).slice(-4)}`);
    }
  }, [address]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = 'unset';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const handleConnect = async () => {
    if (!status) return;
    try {
      await open({ view: 'Connect' });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleBalanceSelect = async (amount: number) => {
    try {
      setIsBalancePopupLoading(true);
      const response = await createAxiosInstance().post('/add-balance', { price: amount, userId: user.id });
      router.push(response.data.url);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add balance');
    } finally {
      setIsBalancePopupLoading(false);
    }
  };

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
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create new chat');
    } finally {
      setIsCreatingChat(false);
    }
  };

  const renderConnectButton = () => (
    <motion.button
      key="connect-button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      disabled={!status}
      className={`${baseButtonStyle} flex items-center gap-3 text-[#FCFCFC] px-8 py-2 rounded-full`}
      onClick={handleConnect}
    >
      Sign in
    </motion.button>
  );
  

  const renderMenuItems = () => (
    <motion.div
      initial="closed"
      animate={isDesktopMenuOpen ? "open" : "closed"}
      variants={menuItemsVariants}
      className={`flex items-center gap-3 absolute right-[52px] ${
        !isDesktopMenuOpen ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      key="desktop-menu"
    >
      <motion.div variants={itemVariant}>
        <Tooltip text="New Chat">
          <button 
            onClick={createNewChat} 
            disabled={isCreatingChat}
            className={`${iconButtonStyle} ${isCreatingChat ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isCreatingChat ? (
              <LoadingIcon isSmall />
            ) : (
              <Plus height={22} width={22} />
            )}
          </button>
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <NetworkButton />
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="Wallet">
          <BalanceButton onPopupOpen={() => setIsPopupOpen(true)} />
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="History">
          <Link href="/history" className={iconButtonStyle}>
            <Archive height={21} width={21} />
          </Link>
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="Docs">
          <Link href="https://docs.lunarkai.org" target="_blank" rel="noopener noreferrer" className={iconButtonStyle}>
            <BookStack height={22} width={22} />
          </Link>
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="Settings">
          <Link href="/settings" className={iconButtonStyle}>
            <Settings height={22} width={22} />
          </Link>
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="Sign Out">
          <button
            onClick={handleDisconnect}
            className={`${iconButtonStyle} border-red-500/50 hover:border-red-500/75`}
          >
            <LogOut height={22} width={22} />
          </button>
        </Tooltip>
      </motion.div>
    </motion.div>
  );

  return (
    <nav className="w-full pb-2 sm:pb-4 sm:pt-4 relative">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center relative z-50">
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-semibold"
            style={{
              background: 'linear-gradient(180deg, #000000 0%, #4E4A46 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            href="/"
          >
            <Image src="/images/icons/icon-light.svg" alt="Lunark AI" width={256} height={256} className='w-12 h-12 object-contain' />
          </motion.a>
          <div className="hidden md:flex items-center relative">
            <AnimatePresence mode="wait">
              {!user ? (
                renderConnectButton()
              ) : (
                <>
                  {renderMenuItems()}
                  <div className="flex items-center gap-3">
                    <AnimatePresence mode="wait">
                      {!isDesktopMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, width: 0 }}
                          animate={{ opacity: 1, scale: 1, width: "auto" }}
                          exit={{ opacity: 0, scale: 0.8, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Tooltip text="New Chat">
                            <button 
                              onClick={createNewChat} 
                              disabled={isCreatingChat}
                              className={`${iconButtonStyle} ${isCreatingChat ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              {isCreatingChat ? (
                                <LoadingIcon isSmall />
                              ) : (
                                <Plus height={22} width={22} />
                              )}
                            </button>
                          </Tooltip>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Tooltip text={isDesktopMenuOpen ? "Close Menu" : "Open Menu"}>
                      <motion.button
                        onClick={toggleDesktopMenu}
                        className="flex h-10 w-10 justify-center items-center z-10 text-[#FCFCFC]"
                        initial={false}
                        animate={{
                          rotate: isDesktopMenuOpen ? 180 : 0,
                          scale: isDesktopMenuOpen ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {isDesktopMenuOpen ? <Xmark /> : <Menu />}
                      </motion.button>
                    </Tooltip>
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            className="md:hidden flex items-center z-50"
            onClick={toggleMenu}
            initial={false}
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{
                scale: isMenuOpen ? 1.2 : 1
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center text-[#FCFCFC]"
            >
              {isMenuOpen ? <Xmark /> : <Menu />}
            </motion.div>
          </motion.button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <MobileMenu
            user={user}
            status={status}
            displayAddress={displayAddress}
            handleConnect={handleConnect}
            handleDisconnect={handleDisconnect}
            toggleMenu={toggleMenu}
            onPopupOpen={() => setIsPopupOpen(true)}
          />
        )}
      </AnimatePresence>
      <BalancePopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSelect={handleBalanceSelect}
        loading={isBalancePopupLoading}
      />
    </nav>
  );
};

export default Navbar;