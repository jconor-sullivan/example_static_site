import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="50" y="55" textAnchor="middle" fontSize="20" fill="currentColor">R</text>
    </svg>
  );
}
