import React from 'react';
import VideoGallery from '../components/VideoGallery';

const VideoPlayer = ({
  src,
  width = 600,
  height,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  poster,
  style = {},
  title,
  description
}) => {
  return (
    <div style={{ textAlign: 'center', margin: '32px 0' }}>
      {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
      <video
        src={src}
        width={width}
        height={height}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        poster={poster}
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          ...style
        }}
      >
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
      {description && <p style={{ marginTop: 10, color: '#555' }}>{description}</p>}
    </div>
  );
};

export default VideoPlayer; 