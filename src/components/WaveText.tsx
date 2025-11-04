// src/components/WaveText.tsx
"use client";
import { motion } from 'framer-motion';

const WaveText = ({ text }: { text: string }) => {
  const letters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
  };

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const, // <-- DIPERBAIKI: Tambahkan 'as const' di sini
        damping: 12,
        stiffness: 100,
        repeat: Infinity,
        repeatDelay: 2,
        repeatType: "mirror" as const,
        duration: 0.5
      },
    },
  };

  return (
    <motion.h1
      className="text-5xl md:text-7xl font-bold text-(--color-text-primary) mb-6 flex overflow-hidden justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span 
          key={index} 
          variants={letterVariants} 
          className={letter === ' ' ? 'mx-2' : ''}
        >
          {letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default WaveText;