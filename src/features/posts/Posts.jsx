import styles from './posts.module.css'
import { useDispatch ,useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { fetchPopularPosts, fetchComments, fetchPostsBySubreddit } from '../../hooks/useFetchPosts';
import { selectAllPosts, getPostsStatus, getPostsError, clearSelectedSubreddit, isSelectedSubreddit } from './postsSlice';
import { availablePopularComments } from '../comments/commentsSlice';
import { SubredditSidebar } from '../../features/subreddits/subredditsList';
import { selectSubreddit, selectSubredditPosts } from '../subreddits/subredditsSlice';
export const Posts = () =>
    {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const status = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);
    const comments = useSelector(availablePopularComments); // Fetch all comments here at the top level

    console.log('Comments:',comments)

    const [selectedSubreddit, setSelectedSubreddit] = useState();
    const subredditPosts = useSelector(selectSubredditPosts)
    console.log('subreddit', subredditPosts)
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

    const handleFetchComments = (permalink) =>
    {

        dispatch(fetchComments(permalink));
    }

    const handleSubredditClick = (subreddit) => {
        setSelectedSubreddit(subreddit);
    };

    const handleClearSubreddit = () =>
    {
        setSelectedSubreddit('');
    }

    return (
    <div className = {styles.general} >
        
        <div>
            <SubredditSidebar selectedSubreddit = {selectedSubreddit} onSubredditClick={handleSubredditClick} subredditPosts = {subredditPosts} />
        </div>
        <div>

             <h1>{selectedSubreddit ? `Posts from ${selectedSubreddit}` : 'Popular Reddit Posts'}</h1>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>{error}</p>}
            {(status === 'succeeded' && !selectedSubreddit) && (
                posts.map((post) => {
                    const postComments = comments[post.permalink] || [];
                    return (
                    <div key = {post.id} >
                        <h2>{post.title}</h2>
                        {post.thumbnail && 
                        <img src = {post.thumbnail} alt = {post.title} style = {{width: '200px'}}/>}
                        <p>By: {post.author}</p>
                        <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                            View Post
                        </a>
                        <button onClick = {() => handleFetchComments(post.permalink)}> Load Comments</button>
                        {postComments && postComments.map((comment, index) => (
                            <div key = {index} style = {{marginLeft: '20px', marginTop: '10px'}}>
                                <h2><strong>{comment.author}</strong>: {comment.body}</h2>
                            </div>
                    ))}
                    </div>
                )

             })
         )};
         <button onClick = {handleClearSubreddit}>Back</button>

        </div>
    </div>
    )
}