import React from 'react';
import { motion } from 'framer-motion';
import type { Agent } from '../../types';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const statusColors = {
    idle: 'bg-gray-700',
    active: 'bg-green-600',
    waiting: 'bg-yellow-600',
    done: 'bg-blue-600',
  };

  const pulseAnimation = agent.status === 'active' ? {
    animate: {
      boxShadow: ['0 0 8px #00e676', '0 0 24px #00e676', '0 0 8px #00e676'],
    },
    transition: { duration: 1.5, repeat: Infinity },
  } : {};

  return (
    <motion.div
      className="w-24 h-32 cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      {...pulseAnimation}
    >
      <div className={`${statusColors[agent.status]} rounded-lg p-2 h-full flex flex-col items-center justify-center text-center text-white`}>
        <div className="text-3xl mb-2">{agent.icon}</div>
        <div className="font-bold text-sm uppercase">{agent.name}</div>
        <div className="text-xs opacity-75 mt-1">{agent.status}</div>
      </div>
    </motion.div>
  );
}
