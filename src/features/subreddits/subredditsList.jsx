import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllSubreddits } from './subredditsSlice';
import { fetchSubreddits, fetchSubredditComments } from '../../hooks/useFetchPosts';
import { availableSubredditComments } from '../comments/commentsSlice';
import { useSearch } from '../../SearchContext';
import styles from './subreddit.module.css';
import { clearPopularComments, clearSubredditComments } from '../comments/commentsSlice';
import { VideoPlayer } from '../Video_Player/videoPlayer';

export const SubredditSidebar = ({ onSubredditClick, subredditPosts,selectedSubreddit, handleClearSubreddit }) => 
{
    const dispatch = useDispatch();
    const [selectedComments, setSelectedComments] = useState(false)
    const subreddits = useSelector(selectAllSubreddits);
    const status = useSelector((state) => state.subreddits.status)
    const subredditComments = useSelector(availableSubredditComments)
    const { userInput } = useSearch()
    const subredditCommentsClear = useSelector(clearSubredditComments)
    const [playingVideoId, setPlayingVideoId] = useState(null);

    useEffect(() => {
        if(status === 'idle'){
            dispatch(fetchSubreddits());
        }
    }, [status, dispatch])

    const handleSubredditFetchComments = (permalink) =>
    {
        setSelectedComments(!selectedComments);
        if( selectedComments === false ){
        dispatch(fetchSubredditComments(permalink))
        }
        else if (selectedSubreddit && (selectedComments === true)) {
            dispatch(subredditCommentsClear)
        }
    }



    const filteredPosts = (userInput && selectedSubreddit)
    ? subredditPosts.filter((subredditPost) => 
        subredditPost.title.toLowerCase().includes(userInput.toLowerCase())
        )
    : subredditPosts;
    

    return (
        <div className = {styles.general} >
            <div className = {styles.sidebarwhole} >
                <h2>Popular Subreddits</h2>
                <hr className = {styles.customLineh2}/>
                <div >
                        {subreddits.map((subreddit) => (
                            <React.Fragment key={subreddit.id}>
                                <div className = {styles.sidebar} key = {subreddit.id} onClick = {() => onSubredditClick(subreddit.display_name)}>
                                    <img styles = {styles.sidebar} src = {subreddit.icon_img || 'https://www.redditinc.com/assets/images/site/reddit-logo.png' } 
                                        alt = {subreddit.display_name} 
                                        />
                                    <p>{subreddit.display_name_prefixed}</p>
                                </div>
                                <hr className = {styles.customLine}/>
                            </React.Fragment>
                        ))}
                </div>
            </div>
            <div>
            <h1>{selectedSubreddit && `Posts from ${selectedSubreddit}`}</h1>
                {(filteredPosts && selectedSubreddit) &&
                    <div> {filteredPosts.map((subredditPost) => {
                        const postComments = subredditComments[subredditPost.permalink] || []
                        const hasVideo = subredditPost.media && subredditPost.media.reddit_video;
                        const dashUrl = hasVideo ? subredditPost.media.reddit_video.dash_url : null;
                        return (
                        <div className = {styles.mainContainer} key = {subredditPost.id}>
                            {hasVideo 
                            ? 
                            <div className = {styles.postContainer} >
                            
                                    <div>
                                        <h2>{subredditPost.title}</h2>
                                    </div>
                                    <VideoPlayer key = {subredditPost.id} dashUrl = {dashUrl}
                                    postId={subredditPost.id}
                                    setPlayingVideoId={setPlayingVideoId}  />

                                        <a href={`https://www.reddit.com${subredditPost.permalink}`} target="_blank" rel="noopener noreferrer">
                                            View Post
                                        </a>
                                          <button onClick = {() => handleSubredditFetchComments(subredditPost.permalink)}> Load Comments</button>
                                    {postComments && postComments.map((comment, index) => (
                                    <div key = {index} className = {styles.commentsContainer}>
                                        <h2 className = {styles.commentsAuthor} >{comment.author}</h2>
                                        <h3> {comment.body}</h3>
                                        <hr></hr>
                                    </div>
                                    ))}
                              </div>
                            :
                            <div className = {styles.postContainer} >
                                <div>
                                    <h2>{subredditPost.title}</h2>
                                </div>
                                <div className = {styles.postImg}>
                                    {subredditPost.preview && 
                                    <img src = {subredditPost.preview.images[0].resolutions[subredditPost.preview.images[0].resolutions.length - 1].url} alt = {subredditPost.title} />}
                                </div>
                                <p>By: {subredditPost.author}</p>
                                <a href={`https://www.reddit.com${subredditPost.permalink}`} target="_blank" rel="noopener noreferrer">
                                    View Post
                                </a>
                                <button onClick = {() => handleSubredditFetchComments(subredditPost.permalink)}> Load Comments</button>
                                {postComments && postComments.map((comment, index) => (
                                        <div key = {index} className = {styles.commentsContainer}>
                                            <h2 className = {styles.commentsAuthor}>{comment.author}</h2>
                                            <h3>{comment.body}</h3>
                                            <hr></hr>

                                        </div>
                                    ))}
                            </div> }
                    
                                </div>
                                )}
                            )} 
                        
                     </div>
                     
                }
                {selectedSubreddit && <button onClick = {handleClearSubreddit}>Back</button>}
            </div>

            
        </div>
    )

}
