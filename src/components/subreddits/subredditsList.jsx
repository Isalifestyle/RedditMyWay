import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllSubreddits } from './subredditsSlice';
import { fetchSubreddits, fetchSubredditComments } from '../../hooks/useFetchPosts';
import { availableSubredditComments, getSubredditCommentsStatus } from '../comments/commentsSlice';
import { useSearch } from '../../SearchContext';
import styles from './subreddit.module.css';
import { clearPopularComments, clearSubredditComments } from '../comments/commentsSlice';
import { VideoPlayer } from '../Video_Player/videoPlayer';
import {SkeletonPost} from '../skeletonPost/skeletonPost';
import PostImage, { imagePost } from '../imagePost/imagePost';


export const SubredditSidebar = ({ onSubredditClick, subredditPosts,selectedSubreddit, handleClearSubreddit }) => 
{
    const dispatch = useDispatch();
    const [selectedComments, setSelectedComments] = useState({});
    const [loadingComments, setLoadingComments] = useState({});
    const [arrowClicked, setArrowClicked] = useState('')
    const subreddits = useSelector(selectAllSubreddits);
    const status = useSelector((state) => state.subreddits.status)
    const subredditComments = useSelector(availableSubredditComments)
    const { userInput } = useSearch()
    const subredditCommentsClear = useSelector(clearSubredditComments)
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const subredditCommentStatus = useSelector(getSubredditCommentsStatus);


    useEffect(() => {
        if(status === 'idle'){
            dispatch(fetchSubreddits());
        }
    }, [status, dispatch])

    const handleSubredditFetchComments = (permalink) =>
    {
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
    
        if(!isSelected){
            console.log('fetching commentss')
        dispatch(fetchSubredditComments(permalink))
        }
        else {
            console.log('Clearing comments')
            dispatch(subredditCommentsClear)
        }
    }



    const filteredPosts = (userInput && selectedSubreddit)
    ? subredditPosts.filter((subredditPost) => 
        subredditPost.title.toLowerCase().includes(userInput.toLowerCase())
        )
    : subredditPosts;

    const handleArrowClick = (postId, color) => {
        setArrowClicked((prev) => ({
            ...prev,
            [postId]: color,
        }));
    };
    

    return (
        <div className = {styles.general} >
            <div className = {styles.sidebarwholeSubreddit} >
                <h2>Popular Subreddits</h2>
                <hr className = {styles.customLineh2}/>
                <div className = {styles.subredditBar}>
                        {subreddits.map((subreddit) => (
                            <React.Fragment key={subreddit.id}>
                                <div className = {styles.sidebar} key = {subreddit.id} onClick = {() => onSubredditClick(subreddit.display_name)}>
                                    <img styles = {styles.sidebar} src = {subreddit.icon_img || 'https://www.redditinc.com/assets/images/site/reddit-logo.png' } 
                                        alt = {subreddit.display_name} 
                                        />
                                    <p className = {styles.pwrap}>{subreddit.display_name_prefixed}</p>
                                </div>
                                <hr className = {styles.customLine}/>
                            </React.Fragment>
                        ))}
                </div>
            </div>
            <div >
            <h1>{selectedSubreddit && `Posts from ${selectedSubreddit}`}</h1>
                {(filteredPosts && selectedSubreddit) &&
                    <div className = {styles.subredditPostCont}> {filteredPosts.map((subredditPost) => {
                        const postComments = subredditComments[subredditPost.permalink] || []
                        const hasVideo = subredditPost.media && subredditPost.media.reddit_video;
                        const dashUrl = hasVideo ? subredditPost.media.reddit_video.dash_url : null;
                        return (
                        <div className = {styles.mainContainer} key = {subredditPost.id}>
                            {hasVideo 
                            ? 
                            <div className = {styles.postContainerVideo} >

                                <div >
                                    <div className = {styles.likes} >
                                        <h3> {subredditPost.ups}</h3>
                                        <svg onClick = {() => handleArrowClick(subredditPost.id,'green')} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="24px" fill={arrowClicked[subredditPost.id] === 'green' ? '#34D399' : '#e8eaed'}  ><path d="M440-80v-647L256-544l-56-56 280-280 280 280-56 57-184-184v647h-80Z"/></svg>
                                        <svg onClick = {() => handleArrowClick(subredditPost.id,'red')} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="24px" fill={arrowClicked[subredditPost.id] === 'red' ? '#F87171' : '#e8eaed'}><path d="M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z"/></svg>
                                    </div>
                                </div>
                                <div className = {styles.mainInfoVideo}>
                                    <div className = {styles.videoFullPost}>
                                    <div className = {styles.videoTitle}>
                                        <h2>{subredditPost.title}</h2>
                                    </div>
                                    <VideoPlayer key = {subredditPost.id} dashUrl = {dashUrl}
                                    postId={subredditPost.id}
                                    setPlayingVideoId={setPlayingVideoId}  />
                                    <div className = {styles.description}>
                                    <div className = {styles.postInfo}>
                                        <div className = {styles.postDescription}> 
                                            <p>By: {subredditPost.author}</p>
                                            <a href={`https://www.reddit.com${subredditPost.permalink}`} target="_blank" rel="noopener noreferrer">
                                                View Post
                                            </a>
                                        </div>
                                            <div className = {styles.commentsButtonVideos}>
                                            <div className = {styles.svgsImageVideos} onClick = {() => handleSubredditFetchComments(subredditPost.permalink)} style={{
                                                                pointerEvents: subredditCommentStatus === 'loading' ? 'none' : 'auto',
                                                                opacity: loadingComments[subredditPost.permalink] ? 0.5 : 1
                                                                }}>
                                                <svg  xmlns="http://www.w3.org/2000/svg" cursor height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                                            </div>    
                                            <div className = {styles.numComments}>
                                                <h4>{subredditPost.num_comments}</h4>
                                            </div>
                                        </div>
                                    </div>
                                        
                                          {subredditCommentStatus === 'loading'&& !!loadingComments[subredditPost.permalink] === true && !!selectedComments[subredditPost.permalink] === true ? <SkeletonPost/> :  (postComments && postComments.map((comment, index) => (
                                            <div key={index} className={styles.commentsContainerVideos}>
                                                    <>
                                                        <h2 className={styles.commentsAuthor}>{comment.author}</h2>
                                                        <h3>{comment.body}</h3>
                                                        <hr />
                                                    </>
                                            </div>
                                            )))} </div>
                                    </div>
                                </div>
                              </div>
                            :
                            <div className = {styles.postContainer} >
                                <div>
                                 <div className = {styles.likes}>
                                    <h3 > {subredditPost.ups}</h3>
        
                                    <svg onClick = {() => handleArrowClick(subredditPost.id,'green')} xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="24px" fill={arrowClicked[subredditPost.id] === 'green' ? '#34D399' : '#e8eaed'}  ><path d="M440-80v-647L256-544l-56-56 280-280 280 280-56 57-184-184v647h-80Z"/></svg>
                                    <svg onClick = {() => handleArrowClick(subredditPost.id,'red')} xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="24px" fill={arrowClicked[subredditPost.id] === 'red' ? '#F87171' : '#e8eaed'}><path d="M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z"/></svg>
                                </div>
                                </div>
                                <div className = {styles.fullPost}> 
                                <div className = {styles.mainInfo}>
                                    <h2>{subredditPost.title}</h2>
                                </div>
                                <div className = {styles.postImg}>
                                    
                                    <PostImage styles = {styles} post = {subredditPost}/>
                                </div>
                                <div className = {styles.postInfo}>
                                    <div className = {styles.postDescription}> 
                                        <p>By: {subredditPost.author}</p>
                                        <a href={`https://www.reddit.com${subredditPost.permalink}`} target="_blank" rel="noopener noreferrer">
                                            View Post
                                        </a>
                                    </div>
                                    <div>
                                        <div className = {styles.commentsButton}>
                                            <div className = {styles.svgsImage} onClick = {() => handleSubredditFetchComments(subredditPost.permalink)} style={{
                                                                pointerEvents: subredditCommentStatus === 'loading' ? 'none' : 'auto',
                                                                opacity: loadingComments[subredditPost.permalink] ? 0.5 : 1
                                                                }}>
                                                <svg  xmlns="http://www.w3.org/2000/svg" cursor height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                                            </div>    
                                            <div className = {styles.numComments}>
                                                <h4>{subredditPost.num_comments}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {subredditCommentStatus === 'loading'&& !!loadingComments[subredditPost.permalink] === true && !!selectedComments[subredditPost.permalink] === true ? <SkeletonPost/> :  (postComments && postComments.map((comment, index) => (
                                            <div key={index} className={styles.commentsContainer}>
                                                    <>
                                                        <h2 className={styles.commentsAuthor}>{comment.author}</h2>
                                                        <h3>{comment.body}</h3>
                                                        <hr />
                                                    </>
                                            </div>
                                            )))}</div>
                            </div> }
                            
                    
                                </div>
                                )}
                            )} 
                        
                     </div>
                     
                }
                {selectedSubreddit && <button className = {styles.button} onClick = {handleClearSubreddit}>Back To Main Posts</button>}
            </div>

            
        </div>
    )

}