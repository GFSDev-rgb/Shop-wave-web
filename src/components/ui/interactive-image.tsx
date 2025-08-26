
"use client";

import React, { useRef, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export function InteractiveImage(props: ImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // The max rotation in degrees
    const maxRotation = 10;
    
    const rotateY = ((mouseX - width / 2) / (width / 2)) * maxRotation;
    const rotateX = -((mouseY - height / 2) / (height / 2)) * maxRotation;

    setRotation({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ rotateX: 0, rotateY: 0 });
  };

  const { rotateX, rotateY } = rotation;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="interactive-image-container"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      <Image {...props} className={cn("transition-transform duration-300 ease-out", props.className)} />
    </div>
  );
}
