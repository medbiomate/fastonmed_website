'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  height?: number;
  theme?: 'dark' | 'light';
}

export default function FastonmedLogo({
  height = 38,
  theme = 'light',
  className = ''
}: LogoProps) {
  // Original Fastonmed logo aspect ratio is ~3.4:1
  const width = Math.round(height * 3.4);
  const src = theme === 'dark' ? '/fastonmed-logo-white.png' : '/fastonmed-logo.png';

  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 0 }}>
      <img
        src={src}
        alt="Fastonmed Medical Equipment Solutions"
        width={width}
        height={height}
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
}
