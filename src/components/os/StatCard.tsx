// src/components/os/StatCard.tsx
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-transform hover:scale-105">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-[--color-dark-primary]">{title}</p>
        <p className="text-2xl font-bold text-[--color-text-primary]">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;