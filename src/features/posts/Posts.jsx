import styles from './posts.module.css'
import { useDispatch ,useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { fetchPopularPosts, fetchComments, fetchPostsBySubreddit } from '../../hooks/useFetchPosts';
import { selectAllPosts, getPostsStatus, getPostsError, clearSelectedSubreddit, isSelectedSubreddit } from './postsSlice';
import { availablePopularComments } from '../comments/commentsSlice';
import { SubredditSidebar } from '../../features/subreddits/subredditsList';
import { selectSubredditPosts } from '../subreddits/subredditsSlice';
import { SearchBar } from '../search/SearchBar';
import { useSearch } from '../../SearchContext';
import { searchResults } from '../search/searchSlice';
import { clearPopularComments, clearSubredditComments } from '../comments/commentsSlice';

export const Posts = () =>
    {
    const [selectedComments, setSelectedComments] = useState(false)
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const status = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);
    const comments = useSelector(availablePopularComments); // Fetch all comments here at the top level
    const searchInputResults = useSelector(searchResults)
    const { userInput } = useSearch();
    const popularCommentsClear = useSelector(clearPopularComments);
    const subredditCommentsClear = useSelector(clearSubredditComments)

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

        setSelectedComments(!selectedComments)
        if(selectedComments === false){
        dispatch(fetchComments(permalink));
        }
        else if (posts && (selectedComments === true)){
            dispatch(popularCommentsClear)
        }
    }

    const handleSubredditClick = (subreddit) => {
        setSelectedSubreddit(subreddit);
    };

    const handleClearSubreddit = () =>
    {
        setSelectedSubreddit('');
    }

    const filteredPosts = userInput 
        ? posts.filter((post) => 
            post.title.toLowerCase().includes(userInput.toLowerCase())
            )
        : posts;

        const getLastResolution = (resolutions) => {
            return resolutions[resolutions.length - 1];  
        };

    return (
    <div>
            <div>
                <SearchBar selectedSubreddit = {selectedSubreddit} />
            </div>
            <div className = {styles.general} >
                <div>
                    <SubredditSidebar handleClearSubreddit = {handleClearSubreddit} selectedSubreddit = {selectedSubreddit} onSubredditClick={handleSubredditClick} subredditPosts = {subredditPosts} />
                </div>
                <div className = {styles.mainPostContainer} >

                    <h1>{!selectedSubreddit && 'Popular Reddit Posts'}</h1>
                    {status === 'loading' && <p>Loading...</p>}
                    {status === 'failed' && <p>{error}</p>}
                    {(status === 'succeeded' && !selectedSubreddit) && (
                        posts.map((post) => {
                            const postComments = comments[post.permalink] || [];
                            const hasVideo = post.media && post.media.reddit_video;
                            return (
                                <div key = {post.id} >


                                        {hasVideo ?
                                        <div className = {styles.postContainer} >
                                            <div>
                                                <h2>{post.title}</h2>
                                            </div>
                                        <video
                                                controls
                                                width="700px"
                                                height="400px"
                                                src={post.secure_media.reddit_video.fallback_url}
                                                type={"video/mp4"}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                            <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                                                View Post
                                            </a>
                                          <button onClick = {() => handleFetchComments(post.permalink)}> Load Comments</button>
                                          {postComments && postComments.map((comment, index) => (
                                        <div key = {index} style = {{marginLeft: '20px', marginTop: '10px'}}>
                                            <h2>{comment.author}</h2>
                                            <h3>: {comment.body}</h3>
                                        </div>
                                    ))}

                                        </div>

                                    :
                                    <div className = {styles.postContainer}>
                                    <div>
                                        <h2>{post.title}</h2>
                                    </div>
                                    <div className = {styles.postImg}>
                                    {post.preview && (
                                            <img
                                                src = {post.preview.images[0].resolutions[post.preview.images[0].resolutions.length - 1].url} alt={post.title}
                                                className = {styles.postImg}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p>By: {post.author}</p>
                                        <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                                            View Post
                                        </a>
                                        <button onClick = {() => handleFetchComments(post.permalink)}> Load Comments</button>
                                        {postComments && postComments.map((comment, index) => (
                                        <div key = {index} className = {styles.commentsContainer}>
                                            <h2 className = {styles.commentsAuthor}>{comment.author}</h2>
                                            <h3>{comment.body}</h3>
                                        </div>
                                    ))}
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