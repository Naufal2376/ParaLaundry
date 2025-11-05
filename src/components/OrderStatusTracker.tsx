// src/components/OrderStatusTracker.tsx
"use client";
import React from 'react';
import { FileText, Archive, Loader, PackageCheck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Definisikan semua langkah yang mungkin
const STEPS = [
  { name: "Pesanan Diterima", icon: <FileText /> },
  { name: "Masuk Antrean", icon: <Archive /> },
  { name: "Proses Dicuci", icon: <Loader /> }, // Ikon Loader akan kita putar
  { name: "Siap Diambil", icon: <PackageCheck /> },
  { name: "Selesai", icon: <CheckCircle /> },
];

interface OrderStatusTrackerProps {
  currentStatus: string;
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ currentStatus }) => {
  const currentStepIndex = STEPS.findIndex(step => step.name === currentStatus);

  return (
    <div className="flex flex-col gap-4">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;

        // Tentukan style berdasarkan status
        let iconBgClass = "bg-gray-300";
        let iconColorClass = "text-gray-500";
        let textClass = "text-(--color-dark-primary)/50";
        let lineClass = "bg-gray-300";
        let iconAnimation = ""; // <-- BARU: Variabel untuk animasi ikon
        let circleAnimation = {};

        if (isCompleted) {
          iconBgClass = "bg-green-500";
          iconColorClass = "text-white";
          textClass = "text-(--color-text-primary)";
          lineClass = "bg-green-500";
        } else if (isActive) {
          iconBgClass = "bg-(--color-brand-primary)";
          iconColorClass = "text-white";
          textClass = "text-(--color-text-primary) font-bold";
          lineClass = "bg-gray-300";
          circleAnimation = { scale: 1.1, transition: { repeat: Infinity, repeatType: "mirror", duration: 0.5 } };
          
          // BARU: Jika status aktif adalah "Proses Dicuci", tambahkan animasi putar
          if (step.name === "Proses Dicuci") {
            iconAnimation = "animate-spin";
          }
        }

        return (
          <motion.div
            key={step.name}
            className="flex items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
          >
            {/* Icon Container */}
            <div className="flex flex-col items-center mr-4">
              <motion.div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${iconBgClass} transition-colors duration-500`}
                animate={circleAnimation}
              >
                <span className={`${iconColorClass} ${iconAnimation}`}>{step.icon}</span>
              </motion.div>
              {index < STEPS.length - 1 && (
                <div className={`w-0.5 md:w-1 h-16 mt-2 ${lineClass} transition-colors duration-500`} />
              )}
            </div>

            {/* Text Content */}
            <div className="pt-1 md:pt-2">
              <h3 className={`text-base md:text-xl ${textClass} transition-colors duration-500`}>
                {step.name}
              </h3>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;