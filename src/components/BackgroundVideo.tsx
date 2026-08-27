import React, { useRef, useEffect, useState } from 'react';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure muted and playsInline for browser autoplay compliance
      video.muted = true;
      video.defaultMuted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
          })
          .catch((err) => {
            console.warn('Autoplay error:', err);
            // Retry on user interaction if autoplay was blocked
            const handleUserInteraction = () => {
              video.play().catch(() => {});
              window.removeEventListener('click', handleUserInteraction);
              window.removeEventListener('touchstart', handleUserInteraction);
            };
            window.addEventListener('click', handleUserInteraction);
            window.addEventListener('touchstart', handleUserInteraction);
          });
      }
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-black">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        onError={() => setError(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
          videoLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        src="https://res.cloudinary.com/nwwiqfso/video/upload/v1787486503/Video_Project_vjmhgu.mp4"
      >
        <source
          src="https://res.cloudinary.com/nwwiqfso/video/upload/v1787486503/Video_Project_vjmhgu.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};
