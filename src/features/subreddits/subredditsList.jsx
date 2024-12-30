import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllSubreddits } from './subredditsSlice';
import { fetchSubreddits, fetchSubredditComments } from '../../hooks/useFetchPosts';
import { availableSubredditComments } from '../comments/commentsSlice';

export const SubredditSidebar = ({ onSubredditClick, subredditPosts,selectedSubreddit }) => 
{
    const dispatch = useDispatch();
    const subreddits = useSelector(selectAllSubreddits);
    const status = useSelector((state) => state.subreddits.status)
    const subredditComments = useSelector(availableSubredditComments)


    useEffect(() => {
        if(status === 'idle'){
            dispatch(fetchSubreddits());
        }
    }, [status, dispatch])

    const handleSubredditFetchComments = (permalink) =>
    {
        dispatch(fetchSubredditComments(permalink))
    }


    return (
        <div>
            <h2>Popular Subreddits</h2>
            {subreddits.map((subreddit) => (
                <div style = {{cursor: 'pointer'}} key = {subreddit.id} onClick = {() => onSubredditClick(subreddit.display_name)}>
                    <img src = {subreddit.icon_img || 'https://www.redditinc.com/assets/images/site/reddit-logo.png' } 
                         alt = {subreddit.display_name} 
                          />
                    <p>{subreddit.display_name_prefixed}</p>
                </div>
            ))}
             {(subredditPosts && selectedSubreddit) &&
                <div> {subredditPosts.map((subredditPost) => {
                    const postComments = subredditComments[subredditPost.permalink] || []
                    return (
                    <div>
                        <h2>{subredditPost.title}</h2>
                        {subredditPost.thumbnail && 
                        <img src = {subredditPost.thumbnail} alt = {subredditPost.title} style = {{width: '200px'}}/>}
                        <p>By: {subredditPost.author}</p>
                        <a href={`https://www.reddit.com${subredditPost.permalink}`} target="_blank" rel="noopener noreferrer">
                            View Post
                        </a>
                        <button onClick = {() => handleSubredditFetchComments(subredditPost.permalink)}> Load Comments</button>
                        {postComments && postComments.map((comment, index) => (
                            <div key = {index} style = {{marginLeft: '20px', marginTop: '10px'}}>
                                <h2><strong>{comment.author}</strong>: {comment.body}</h2>
                            </div>
                        ))}
                    </div>
            )}
        )} 
                </div>
        
    }

            
        </div>
    )

}
