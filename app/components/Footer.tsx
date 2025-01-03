"use client"
import { motion } from "framer-motion";

export function HomeFooter() {
 return (
   <div className="absolute bottom-0 flex flex-col justify-center items-center w-full">
     <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ duration: 0.2, delay: 0.4 }}
       className="text-center text-sm text-[#4F6263] mb-2"
     >
       Built by <span className="text-[#9CA3AF]">Lunark AI</span> © {new Date().getFullYear()} 
     </motion.div>
     <div className="flex flex-row justify-center gap-3 text-[#4F6263] max-w-2xl text-center text-xs">
      <motion.a 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.5 }}
          href="/terms" 
          target="_blank" 
        className="hover:underline mx-auto"
      >
        Terms of Service
      </motion.a> 
      <motion.a 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.5 }}
        href="/privacy" 
        target="_blank" 
        className="hover:underline mx-auto"
      >
        Privacy Policy
      </motion.a>
     </div>
   </div>
 );
}

export function ChatFooter() {
 return (
   <div className="flex justify-between items-center px-4 mt-4 text-xs">
     <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.4 }}
      className="text-[#4F6263]"
     >
       Built by <span className="text-[#9CA3AF]">Lunark AI</span> © {new Date().getFullYear()}  
     </motion.div>
     <div className="flex flex-row gap-3 text-[#4F6263] max-w-2xl text-center">
      <motion.a 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.5 }}
          href="/terms" 
          target="_blank" 
        className="hover:underline mx-auto"
      >
        Terms of Service
      </motion.a> 
      <motion.a 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.5 }}
        href="/privacy" 
        target="_blank" 
        className="hover:underline mx-auto"
      >
        Privacy Policy
      </motion.a>
     </div>
   </div>
 );
}