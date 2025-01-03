import styles from './posts.module.css'
import { useDispatch ,useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { fetchPopularPosts, fetchComments, fetchPostsBySubreddit } from '../../hooks/useFetchPosts';
import { selectAllPosts, getPostsStatus, getPostsError, clearSelectedSubreddit, isSelectedSubreddit } from './postsSlice';
import { availablePopularComments, getPopularCommentsStatus, getSubredditCommentsStatus } from '../comments/commentsSlice';
import { SubredditSidebar } from '../../features/subreddits/subredditsList';
import { selectSubredditPosts } from '../subreddits/subredditsSlice';
import { SearchBar } from '../search/SearchBar';
import { useSearch } from '../../SearchContext';
import { searchResults } from '../search/searchSlice';
import { clearPopularComments, clearSubredditComments } from '../comments/commentsSlice';
import { VideoPlayer } from '../Video_Player/videoPlayer';
import { SkeletonPost } from "../skeletonPost/skeletonPost";

export const Posts = () =>
    {
    const [selectedComments, setSelectedComments] = useState({});
    const [loadingComments, setLoadingComments] = useState({}); // Track loading state per post
    const [arrowClicked, setArrowClicked] = useState('')
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const status = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);
    const comments = useSelector(availablePopularComments); // Fetch all comments here at the top level
    const searchInputResults = useSelector(searchResults)
    const { userInput } = useSearch();
    const popularCommentsClear = useSelector(clearPopularComments);
    const subredditCommentsClear = useSelector(clearSubredditComments)
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const subredditCommentStatus = useSelector(getSubredditCommentsStatus);
    const popularCommentsStatus = useSelector(getPopularCommentsStatus)


    
    const [selectedSubreddit, setSelectedSubreddit] = useState(false);
    const subredditPosts = useSelector(selectSubredditPosts)
    
    useEffect(() => {

        if(selectedSubreddit)
        {
            dispatch(fetchPostsBySubreddit(selectedSubreddit));
        }
        else if(status === 'idle')
        {
            dispatch(fetchPopularPosts())
        }
    }, [status, dispatch, selectedSubreddit]);

    const handleFetchComments = (permalink) => { // Not sure why this implementation worked for the load comments will need to look into tommorow
        const isSelected = !!selectedComments[permalink];
        
        // Update the state immediately by computing the next state
        const nextSelectedComments = {
            ...selectedComments,
            [permalink]: !isSelected
        };
    
        setSelectedComments(nextSelectedComments);
        setLoadingComments((prevState) => ({
            ...prevState,
            [permalink]: !isSelected,
        }));
    
        if (!isSelected) {
            dispatch(fetchComments(permalink));
        } else {
            dispatch(popularCommentsClear);
        }
    };

    const handleSubredditClick = (subreddit) => {
        setSelectedSubreddit(subreddit);
    };

    const handleClearSubreddit = () =>
    {
        setSelectedSubreddit('');
    }

    const filteredPosts = (userInput && selectedSubreddit === false )
        ? posts.filter((post) => 
            post.title.toLowerCase().includes(userInput.toLowerCase())
            )
        : posts;


        const handleArrowClick = (postId, color) => {
            setArrowClicked((prev) => ({
                ...prev,
                [postId]: color,
            }));
        };

    return (
    <div>
            <div>
                <SearchBar selectedSubreddit = {selectedSubreddit} />
            </div>
            <div className = {styles.general} >
                <div className = {styles.subredditSidebar}>
                    <SubredditSidebar handleClearSubreddit = {handleClearSubreddit} selectedSubreddit = {selectedSubreddit} onSubredditClick={handleSubredditClick} subredditPosts = {subredditPosts} />
                </div>
                <div className = {styles.mainContainer} >

                    <h1 className = {styles.MainHeading}>{!selectedSubreddit && 'Popular Reddit Posts'}</h1>
                    {status === 'loading' && <p>Loading...</p>}
                    {status === 'failed' && <p>{error}</p>}
                    {(status === 'succeeded' && !selectedSubreddit) && (
                        filteredPosts.map((post) => {
                            const postComments = comments[post.permalink] || [];
                            const hasVideo = post.media && post.media.reddit_video;
                            const dashUrl = hasVideo ? post.media.reddit_video.dash_url : null;
                            let permalinkStorage = post.permalink;
                            return (
                                <div className = {styles.mainContainer} key = {post.id} >


                                    {hasVideo ?
                                    <div className = {styles.generalPostContainer} >
                                            <div className = {styles.general} >
                                                <div className = {styles.likesVideos}>
                                                    <h3 className = {styles.likesVideosH3}>{post.ups}</h3>
                                                    <svg onClick = {() => handleArrowClick(post.id,'green')} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={arrowClicked[post.id] === 'green' ? '#34D399' : '#e8eaed'}  ><path d="M440-80v-647L256-544l-56-56 280-280 280 280-56 57-184-184v647h-80Z"/></svg>
                                                    <svg onClick = {() => handleArrowClick(post.id,'red')} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={arrowClicked[post.id] === 'red' ? '#F87171' : '#e8eaed'}><path d="M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z"/></svg>
                                                </div>
                                                <div className = {styles.postContainer}>
                                                    <div  className = {styles.title}>
                                                        <h2>{post.title}</h2>
                                                    </div>
                                                        <VideoPlayer dashUrl = {dashUrl}/>
                                                        <div>
                                                    <div className = {styles.description}>
                                                        <div className = {styles.authorLink}>
                                                            <p>By: {post.author}</p>
                                                            <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                                                                View Post
                                                            </a>
                                                        </div>
                                                        <div className = {styles.postComments}>
                                                        <div className = {styles.postComments}>
                                                    <div className = {styles.svgs}>
                                                        <div className = {styles.svgsImage} onClick = {() => handleFetchComments(post.permalink)}>
                                                            <svg  xmlns="http://www.w3.org/2000/svg" cursor height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                                                        </div>
                                                        <div className = {styles.commentNumber}>
                                                            <h4>{post.num_comments}</h4>
                                                        </div>
                                                    </div>
                                                </div>

                                                        </div>
                                                     </div>
                                                    
                                                
                                                     {popularCommentsStatus === 'loading'&& !!loadingComments[post.permalink] === true && !!selectedComments[post.permalink] === true ? <SkeletonPost/> :  (postComments && postComments.map((comment, index) => (
                                            <div key={index} className={styles.commentsContainer}>
                                                    <>
                                                        <h2 className={styles.commentsAuthor}>{comment.author}</h2>
                                                        <h3>{comment.body}</h3>
                                                        <hr />
                                                    </>
                                            </div>
                                            )))}
                                             </div>
                                             </div>
                                        </div>

                                    </div>

                                    :
                                    <div className = {styles.generalPostContainer}>
                                    <div className = {styles.general}>
                                        <div className = {styles.likesVideos}>
                                            <h3>{post.ups}</h3>
                                            
                                            <div className = {styles.Arrow}>
                                            <svg onClick = {() => handleArrowClick(post.id,'green')} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={arrowClicked[post.id] === 'green' ? '#34D399' : '#e8eaed'}  ><path d="M440-80v-647L256-544l-56-56 280-280 280 280-56 57-184-184v647h-80Z"/></svg>
                                            </div>
                                            <div className = {styles.Arrow}>
                                            <svg onClick = {() => handleArrowClick(post.id,'red')} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={arrowClicked[post.id] === 'red' ? '#F87171' : '#e8eaed'}><path d="M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z"/></svg>

                                            </div>
                                        </div>
                                        <div className = {styles.postContainer}>
                                        <div className = {styles.title}>
                                            <h2>{post.title}</h2>
                                        </div>
                                        <div className = {styles.postImg}>
                                        {post.preview?.images?.[0]?.resolutions?.[post.preview.images[0].resolutions.length - 1]?.url && (
                                                <img
                                                    src = {post.preview.images[0].resolutions[post.preview.images[0].resolutions.length - 1].url} alt={post.title}
                                                    className = {styles.postImg}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <div className = {styles.description}>
                                                <div className = {styles.authorLink}>
                                                    <p>By: {post.author}</p>
                                                    <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                                                        View Post
                                                    </a>
                                                </div>
                                                <div className = {styles.postComments}>
                                                    <div className = {styles.svgs}>
                                                          
                                                        <div className = {styles.svgsImage} onClick = {() => handleFetchComments(post.permalink)} style={{
                                                            pointerEvents: popularCommentsStatus === 'loading' ? 'none' : 'auto',
                                                            opacity: loadingComments[post.permalink] ? 0.5 : 1
                                                            }}>
                                                            <svg  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                                                        </div>
                                                        <div className = {styles.commentNumber}>
                                                            <h4>{post.num_comments}</h4>
                                                        </div>
                        
                                                    </div>
                                                    
                                                </div>
                                            </div>

                                            {popularCommentsStatus === 'loading'&& !!loadingComments[post.permalink] === true && !!selectedComments[post.permalink] === true ? <SkeletonPost/> :  (postComments && postComments.map((comment, index) => (
                                            <div key={index} className={styles.commentsContainer}>
                                                    <>
                                                        <h2 className={styles.commentsAuthor}>{comment.author}</h2>
                                                        <h3>{comment.body}</h3>
                                                        <hr />
                                                    </>
                                            </div>
                                            )))}
                                        </div>
                                    </div>
                                    </div>
                                </div>}
                            </div>
                        )

                    })
                )}
                {!selectedSubreddit && <button onClick = {handleClearSubreddit}>Back</button>}

                </div>
            </div>
    </div>
    )
}