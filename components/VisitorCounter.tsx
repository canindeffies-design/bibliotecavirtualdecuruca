
import React, { useEffect, useState } from 'react';
import { getVisitorCount, incrementVisitorCount } from '../services/storage';

export const VisitorCounter: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // We increment once when the component (app) loads
    const newCount = incrementVisitorCount();
    setCount(newCount);
  }, []);

  return (
    <div className="bg-black/60 border border-yellow-400/50 px-4 py-1 rounded-md backdrop-blur-sm flex flex-col items-center justify-center min-w-[120px]">
      <span className="text-[10px] text-yellow-400 uppercase font-bold tracking-tighter leading-none mb-1">
        Visitantes
      </span>
      <span className="text-white font-mono text-xl font-bold tracking-[0.2em] leading-none">
        {count.toString().padStart(6, '0')}
      </span>
    </div>
  );
};
