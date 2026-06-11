import React from 'react';
import './RobloxObby3D.css';

export default function RobloxObby3D() {
  return (
    <div className="roblox-obby-3d-container">
      <iframe
        src="/roblox-tower/index.html"
        title="Tower of Challenge 3D"
        className="roblox-obby-3d-iframe"
        allow="autoplay; fullscreen; pointer-lock; microphone"
      />
    </div>
  );
}
