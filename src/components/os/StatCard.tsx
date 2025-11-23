// src/components/os/StatCard.tsx
"use client"
import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string; // Misal: "bg-blue-100 text-blue-600"
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-transform hover:scale-105"
      whileHover={{ y: -5 }}
    >
      <div className={`p-4 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-(--color-dark-primary)">{title}</p>
        <p className="text-2xl font-bold text-(--color-text-primary)">{value}</p>
      </div>
    </motion.div>
  );
};

export default React.memo(StatCard);