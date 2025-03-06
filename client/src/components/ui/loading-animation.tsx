import { motion } from "framer-motion";

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated character - a simple happy face that bounces */}
      <motion.div
        className="w-16 h-16 bg-primary rounded-full relative"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Eyes */}
        <motion.div 
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{ left: '25%', top: '40%' }}
          animate={{
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{ right: '25%', top: '40%' }}
          animate={{
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        {/* Smile */}
        <motion.div 
          className="absolute w-8 h-4 border-b-2 border-white"
          style={{ left: '25%', bottom: '30%' }}
          animate={{
            scaleX: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.div>
      
      {/* Loading text */}
      <motion.p
        className="text-lg font-medium text-primary"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
}
