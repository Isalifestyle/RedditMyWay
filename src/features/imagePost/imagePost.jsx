import React, { useState, useEffect } from 'react';

const PostImage = ({ post, styles }) => {
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        const calculateImageIndex = () => {
            const width = window.innerWidth;
            if (width < 600) {
                setImageIndex(post.preview?.images[0].resolutions.length - 4); // Small image for mobile
            } else if (width < 1648) {
                setImageIndex(post.preview?.images[0].resolutions.length - 3); // Medium image for tablets
            } else if (width < 1700) {
                setImageIndex(post.preview?.images[0].resolutions.length - 2); // Larger image for laptops
            } else {
                setImageIndex(post.preview?.images[0].resolutions.length - 1); // Largest image for desktops
            }
        };

        calculateImageIndex();
        window.addEventListener('resize', calculateImageIndex);

        return () => window.removeEventListener('resize', calculateImageIndex);
    }, [post.preview?.images]);

    const imageUrl = post.preview?.images?.[0]?.resolutions?.[imageIndex]?.url;

    return (
        imageUrl && (
            <img
                src={imageUrl}
                alt={post.title}
                className={styles.postImg}
            />
        )
    );
};

export default PostImage;
