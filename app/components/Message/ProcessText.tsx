import { ReactNode } from 'react';
import Image from 'next/image';
import { networks } from '@/constants';
import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { baseButtonStyle } from '@/constants';

interface MarkerInfo {
 text?: string;
 icon?: string;
 type?: string;
}

const AddressCode = ({ address }: { address: string }) => {
 const [displayText, setDisplayText] = useState(address);
 const containerRef = useRef<HTMLElement>(null);
 const [width, setWidth] = useState<number | undefined>();
 
 useEffect(() => {
   if (containerRef.current) {
     setWidth(containerRef.current.offsetWidth);
   }
 }, []);

 const handleClick = async () => {
   await navigator.clipboard.writeText(address);
   setDisplayText('Copied address to clipboard!');
   toast.success('Copied address to clipboard!');
   
   setTimeout(() => {
     setDisplayText(address);
   }, 2000);
 };

 return (
   <code 
     ref={containerRef}
     style={{ width: width ? `${width}px` : 'auto' }}
     className={`${baseButtonStyle}  cursor-pointer rounded-full inline-block px-2 py-0.5 text-center text-sm font-mono text-pink-600`}
     onClick={handleClick}
   >
     {displayText}
   </code>
 );
};

export const processText = (children: ReactNode): ReactNode[] => {
 if (!children || typeof children !== 'string') {
   return [children];
 }

 let processedText = children;
 const markers = new Map<string, MarkerInfo>();
 let markerCount = 0;

 networks.forEach(network => {
   const networkName = network.name
     .replace(/\s+/g, '[\\s-]*') 
     .replace(/[A-Z]/g, letter => `[${letter.toLowerCase()}${letter}]`); 
     
   const nameRegex = new RegExp(`\\b${networkName}\\b`, 'gi');
   processedText = processedText.replace(nameRegex, (match) => {
     const marker = `%%MARKER${markerCount}%%`;
     markers.set(marker, {
       text: network.name, 
       icon: network.icon
     });
     markerCount++;
     return marker;
   });
 
   const currencyRegex = new RegExp(`\\b${network.nativeCurrency}\\b`, 'gi');
   processedText = processedText.replace(currencyRegex, (match) => {
     const marker = `%%MARKER${markerCount}%%`;
     markers.set(marker, {
       text: match.toUpperCase(),
       icon: network.icon
     });
     markerCount++;
     return marker;
   });
 });

 const balanceRegex = /\b\d+(?:,\d{3})*(?:\.\d+)?\b/g;
 processedText = processedText.replace(balanceRegex, (match) => {
   const marker = `%%BALANCE${markerCount}%%`;
   markers.set(marker, {
     text: match,
     type: 'balance'
   });
   markerCount++;
   return marker;
 });

 const parts = processedText.split(/(%%(?:MARKER|BALANCE)\d+%%)/);
 const intermediateResults: ReactNode[] = parts.map((part, idx) => {
   if (part.startsWith('%%MARKER') && part.endsWith('%%')) {
     const markerInfo = markers.get(part);
     if (markerInfo) {
       return (
         <span key={`marker-${idx}`} className="inline-flex items-center font-semibold">
           {markerInfo.text}
           <Image 
             src={markerInfo.icon || '/images/chains/ethereum.png'} 
             alt="chain icon"
             width={32}
             height={32}
             className="w-4 h-4 ml-1 rounded-full"
           />
         </span>
       );
     }
   } else if (part.startsWith('%%BALANCE') && part.endsWith('%%')) {
     const markerInfo = markers.get(part);
     if (markerInfo) {
       return (
         <span key={`balance-${idx}`} className="font-semibold">
           {markerInfo.text}
         </span>
       );
     }
   }
   return part;
 });

 const results: ReactNode[] = [];
 intermediateResults.forEach((part, index) => {
   if (typeof part !== 'string') {
     results.push(part);
     return;
   }

   let lastIndex = 0;
   const segments: ReactNode[] = [];

   const ethAddressRegex = /(0x[a-fA-F0-9]{40})/g;
   let ethMatch;
   while ((ethMatch = ethAddressRegex.exec(part)) !== null) {
     if (ethMatch.index > lastIndex) {
       segments.push(part.slice(lastIndex, ethMatch.index));
     }
     const address = ethMatch[0];
     segments.push(
       <AddressCode key={`eth-${index}-${ethMatch.index}`} address={address} />
     );
     lastIndex = ethMatch.index + ethMatch[0].length;
   }

   const remainingAfterEth = part.slice(lastIndex);
   
   const urlRegex = /(?:"|')?(?:https?:\/\/[^\s"']+|www\.[^\s"']+|[^\s"']+\.(?:com|org|net|edu|gov|mil|io|dev|ai)[^\s"']*)(?:"|')?/g;
   let urlMatch;
   lastIndex = 0;

   while ((urlMatch = urlRegex.exec(remainingAfterEth)) !== null) {
     if (urlMatch.index > lastIndex) {
       segments.push(remainingAfterEth.slice(lastIndex, urlMatch.index));
     }

     let url = urlMatch[0];
     url = url.replace(/^["']|["']$/g, '');
     const href = url.startsWith('www.') ? `https://${url}` : url;
     
     segments.push(
       <a
         key={`url-${index}-${urlMatch.index}`}
         href={href}
         target="_blank"
         rel="noopener noreferrer"
         className={`${baseButtonStyle} !border-0 text-sky-500 hover:text-sky-600 hover:border-sky-500/50 cursor-pointer break-all`}
       >
         {url}
       </a>
     );
     lastIndex = urlMatch.index + urlMatch[0].length;
   }

   if (lastIndex < remainingAfterEth.length) {
     segments.push(remainingAfterEth.slice(lastIndex));
   }

   results.push(...segments);
 });

 return results;
};