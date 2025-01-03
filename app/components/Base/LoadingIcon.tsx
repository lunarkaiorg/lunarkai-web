"use client"
import { motion } from "framer-motion";
import { RiLoader4Line } from "react-icons/ri";

interface LoadingIconProps {
 isSmall?: boolean;
}

export default function LoadingIcon({ isSmall = false }: LoadingIconProps) {
 return (
   <motion.div 
     initial={{ opacity: 0 }} 
     animate={{ opacity: 1 }} 
     transition={{ duration: 0.2 }} 
     className="relative flex items-center justify-center pointer-events-none"
   >
     <RiLoader4Line 
       className={`${isSmall ? 'w-6 h-6' : 'w-9 h-9'} text-[#FCFCFC] animate-spin`}
     />
   </motion.div>
 );
}