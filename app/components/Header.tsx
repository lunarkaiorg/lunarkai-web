"use client"
import { motion } from "framer-motion";

export default function Header() {
 return (
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     transition={{ duration: 0.2 }}
     key="header"
     className="relative w-full -mt-12"
   >
     <div className="flex justify-center items-center relative w-fit mx-auto">
       <motion.h1 
         initial={{ opacity: 0, y: 40 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.2 }}
         className="text-3xl sm:text-5xl text-center mb-3 sm:mb-6 font-dune font-bold text-transparent bg-clip-text bg-gradient-to-t from-[#FCFCFC] via-[#FCFCFC] to-[#0F2B2500]"
         key="title"
       >
         Lunark AI
       </motion.h1>
     </div>
   </motion.div>
 );
}