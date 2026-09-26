'use client';

import React from 'react';

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
  const width = Math.round(height * 3.43);
  const src = theme === 'dark' ? '/fastonmed-logo-white.svg' : '/fastonmed-logo.svg';

  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 0 }}>
      <img
        src={src}
        alt="FastOnMed Healthcare Equipment LLC"
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
