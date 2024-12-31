import React, { useState, useEffect, useRef } from 'react';import dashjs from 'dashjs';

export const VideoPlayer = ({ dashUrl, postId }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        if (!videoRef.current) return; // Ensure the video element is present

        const player = dashjs.MediaPlayer().create();
        player.initialize(videoRef.current, dashUrl, false);

        // Cleanup on component unmount
        return () => {
            player.reset();
        };
    }, [dashUrl]);


    return (
        <div>
            <video
                ref={videoRef}
                controls
                width="700px"
                height="400px"
                type="video/mp4"

            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};
