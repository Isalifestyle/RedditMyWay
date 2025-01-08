import styles from './skeletonPost.module.css';

export const SkeletonPost = () => {
    return (
        <div>
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className={styles.skeletonPost}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonText}></div>
                </div>
            ))}
        </div>
    );
};