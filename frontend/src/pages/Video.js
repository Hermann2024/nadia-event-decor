import React from 'react';
import VideoPlayer from '../components/VideoPlayer';

const videoList = [
  {
    src: '/assets/images/1a3cfdf2-5bfe-490e-8943-e9fc11e47bcb.MP4',
    title: 'Vidéo 1'
  },
  {
    src: '/assets/images/4d1805a2-c1d6-408f-b201-627b7fc9a1ca.MP4',
    title: 'Vidéo 2'
  },
  {
    src: '/assets/images/51eb8b95-510e-462c-ab27-ba13ecb2fed5.MP4',
    title: 'Vidéo 3'
  }
  // Ajoute ici d'autres vidéos si besoin
];

const Videos = () => (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px' }}>
    <h1 style={{ textAlign: 'center', marginTop: 80, marginBottom: 40 }}>Nos Vidéos</h1>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
      {videoList.map((video) => (
        <VideoPlayer
          key={video.src}
          src={video.src}
          title={video.title}
          width={350}
          style={{ margin: 0 }}
        />
      ))}
    </div>
  </div>
);

export default Videos; 