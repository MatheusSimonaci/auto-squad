import React from 'react';
import { motion } from 'framer-motion';
import type { Story } from '../../types';

interface StoryCardProps {
  story: Story;
  onClick?: () => void;
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  const statusColors = {
    draft: 'border-yellow-600',
    active: 'border-green-600',
    done: 'border-blue-600',
  };

  return (
    <motion.div
      className={`border-2 ${statusColors[story.status]} rounded-lg p-4 bg-card/50 cursor-pointer min-w-64`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
    >
      <h4 className="font-bold text-lg mb-2">{story.title}</h4>
      <p className="text-sm text-gray-400 mb-3">{story.id}</p>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{Math.round(story.progress * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded h-2">
          <motion.div
            className="bg-green-500 h-full rounded"
            initial={{ width: 0 }}
            animate={{ width: `${story.progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="text-xs text-gray-400">
        {story.agents.length} agents
      </div>
    </motion.div>
  );
}
