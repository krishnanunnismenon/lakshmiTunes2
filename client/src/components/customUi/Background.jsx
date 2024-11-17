import React, { useEffect, useState, useCallback } from 'react';
import { cn } from "@/lib/utils";

const svgFiles = [
  '/guitar-bass-head-svgrepo-com.svg',
  '/guitar-instrument-electric-flying-v-svgrepo-com.svg',
  '/guitar-instrument-electric-svgrepo-com.svg',
  '/guitar-pick-svgrepo-com.svg',
  '/guitar-svgrepo-com (1).svg',
  '/guitar-svgrepo-com.svg'
];

const GuitarBackground = ({ className }) => {
  const [svgElements, setSvgElements] = useState([]);

  const generateBackground = useCallback(() => {
    const elements = [];
    const numElements = 20; // Further reduced for better performance
    const gridSize = Math.ceil(Math.sqrt(numElements));
    const cellSize = 100 / gridSize;

    for (let i = 0; i < numElements; i++) {
      const randomSvg = svgFiles[Math.floor(Math.random() * svgFiles.length)];
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      const x = (col * cellSize) + (Math.random() * (cellSize * 0.6));
      const y = (row * cellSize) + (Math.random() * (cellSize * 0.6));
      
      const rotation = Math.random() * 360;
      const scale = 0.15 + Math.random() * 0.15; // Smaller scale for more subtlety

      elements.push(
        <div
          key={i}
          className="absolute transition-transform duration-1000 ease-in-out opacity-5 pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `rotate(${rotation}deg) scale(${scale})`,
            width: '60px',
            height: '60px',
          }}
        >
          <img
            src={randomSvg}
            alt=""
            className="w-full h-full object-contain"
            style={{ filter: 'invert(1)' }}
          />
        </div>
      );
    }

    setSvgElements(elements);
  }, []);

  useEffect(() => {
    generateBackground();
    const handleResize = () => {
      generateBackground();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [generateBackground]);

  return (
    <div className={cn("fixed inset-0 overflow-hidden -z-10", className)}>
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative w-full h-full">
        {svgElements}
      </div>
    </div>
  );
};

export default GuitarBackground;