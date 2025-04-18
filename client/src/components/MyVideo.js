import React, { useCallback } from 'react';

function MyVideo({ myStream }) {
  // Attach the stream to the video element
  const attachStream = useCallback(
    (videoElement) => {
      if (videoElement && myStream) {
        videoElement.srcObject = myStream;
      }
    },
    [myStream]
  );

  return (
    <div className="my-video-container">
      {myStream && (
        <video
          width="200"
          ref={attachStream}
          autoPlay
          muted
          playsInline
          className="my-video"
        />
      )}
    </div>
  );
}

export default MyVideo;
