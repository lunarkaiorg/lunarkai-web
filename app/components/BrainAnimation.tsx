"use client"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"

const BrainAnimation = () => {
 const [imagesLoaded, setImagesLoaded] = useState(false)
 const [currentImage, setCurrentImage] = useState("/images/brain/left/brain_left_1.webp")
 const [isLoopPlaying, setIsLoopPlaying] = useState(true)
 const [videoLoaded, setVideoLoaded] = useState(false)
 
 const videoRef = useRef<HTMLVideoElement | null>(null)
 const inactivityIntervalRef = useRef<NodeJS.Timeout | null>(null)
 const animationFrameIdRef = useRef<number | null>(null)
 const currentPositionRef = useRef(0.5)
 const targetPositionRef = useRef(0.5)
 const isMouseMovingRef = useRef(false)
 const isResettingRef = useRef(false)
 const leftImagesRef = useRef<HTMLImageElement[]>([])
 const rightImagesRef = useRef<HTMLImageElement[]>([])

 const leftFrames = Array.from({ length: 24 }, (_, i) => 
   `/images/brain/left/brain_left_${i + 1}.webp`
 )
 const rightFrames = Array.from({ length: 24 }, (_, i) => 
   `/images/brain/right/brain_right_${i + 1}.webp`
 )

 const preloadImages = async () => {
   const loadImage = (src: string): Promise<HTMLImageElement> => {
     return new Promise((resolve, reject) => {
       const img = new Image()
       img.src = src
       img.onload = () => resolve(img)
       img.onerror = reject
     })
   }

   try {
     leftImagesRef.current = await Promise.all(leftFrames.map(loadImage))
     rightImagesRef.current = await Promise.all(rightFrames.map(loadImage))
     setImagesLoaded(true)
   } catch (error) {
     console.error('Error loading images:', error)
   }
 }

 const handleVideoLoaded = () => {
   if(videoRef.current && imagesLoaded) {
     setVideoLoaded(true)
     videoRef.current.playbackRate = 0.25
     videoRef.current.play()
       .then(() => setVideoLoaded(true))
       .catch(error => console.error('Video playback failed:', error));
   }
 }

 useEffect(() => {
   const init = async () => {
     await preloadImages()
     if(imagesLoaded) {
       handleVideoLoaded()
     }
   }
   init()
 }, [])

 const lerp = (start: number, end: number, t: number): number => {
   return start + (end - start) * t
 }

 useEffect(() => {
   const animate = () => {
     if (!isLoopPlaying || !imagesLoaded) {
       const lerpFactor = isResettingRef.current ? 0.1 : 0.5
       currentPositionRef.current = lerp(currentPositionRef.current, targetPositionRef.current, lerpFactor)

       if (currentPositionRef.current < 0.5) {
         const normalizedPosition = 1 - (Math.max(0.1, currentPositionRef.current) - 0.1) / 0.4
         const index = Math.min(23, Math.max(0, Math.floor(normalizedPosition * 24)))
         if (leftImagesRef.current[index]) setCurrentImage(leftImagesRef.current[index].src)
       } else {
         const normalizedPosition = Math.min((currentPositionRef.current - 0.5) / 0.4, 1)
         const index = Math.min(23, Math.max(0, Math.floor(normalizedPosition * 24)))
         if (rightImagesRef.current[index]) setCurrentImage(rightImagesRef.current[index].src)
       }

       if (isResettingRef.current && Math.abs(currentPositionRef.current - 0.5) < 0.01) {
         setIsLoopPlaying(true)
         isResettingRef.current = false
       }
     }

     animationFrameIdRef.current = requestAnimationFrame(animate)
   }

   animationFrameIdRef.current = requestAnimationFrame(animate)

   const handleMouseMove = (e: MouseEvent) => {
     if (inactivityIntervalRef.current) {
       clearTimeout(inactivityIntervalRef.current)
     }
     
     setIsLoopPlaying(false)
     isResettingRef.current = false
     isMouseMovingRef.current = true
     targetPositionRef.current = e.clientX / window.innerWidth

     setTimeout(() => {
       isMouseMovingRef.current = false
     }, 100)

     inactivityIntervalRef.current = setTimeout(() => {
       isResettingRef.current = true
       targetPositionRef.current = 0.5
     }, 2000)
   }

   window.addEventListener("mousemove", handleMouseMove)

   return () => {
     window.removeEventListener("mousemove", handleMouseMove)
     if (inactivityIntervalRef.current) {
       clearTimeout(inactivityIntervalRef.current)
     }
     if (animationFrameIdRef.current) {
       cancelAnimationFrame(animationFrameIdRef.current)
     }
   }
 }, [isLoopPlaying])

 const renderContent = () => {
  if (!imagesLoaded) {
    return (
      <img 
        src="/images/brain/left/brain_left_5.webp"
        alt="Loading Brain"
        className="w-full h-full scale-[2] sm:scale-150 lg:scale-100 object-contain"
      />
    )
  }

  if (isLoopPlaying) {
    return (
      <video
        ref={videoRef}
        src="/images/brain/brain-loop.webm"
        loop
        muted
        playsInline
        controls={false}
        onLoadedData={handleVideoLoaded}
        className="w-full h-full scale-[2] sm:scale-150 lg:scale-100 object-contain"
      />
    )
  }

  return (
    <motion.img 
      src={currentImage}
      alt="Interactive Brain"
      className="w-full h-full scale-[2] sm:scale-150 lg:scale-100 object-contain"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
      }}
    />
  )
}

 return (
   <motion.div  
     className="fixed inset-0 w-full min-h-screen z-0 pointer-events-none"
     initial={{ opacity: 0, scale: 1.1 }}
     animate={{ opacity: 1, scale: 0.875 }}
     transition={{ duration: 1.6, ease: "easeOut" }}
   >
     {renderContent()}
   </motion.div>
 )
}

export default BrainAnimation