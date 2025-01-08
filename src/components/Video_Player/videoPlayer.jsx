import React, { useState, useEffect, useRef } from 'react';import dashjs from 'dashjs';
import styles from "./videoPlayer.module.css";

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
        <div className = {styles.videoContainer}>
            <video
                ref={videoRef}
                controls
                type="video/mp4"

            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};
