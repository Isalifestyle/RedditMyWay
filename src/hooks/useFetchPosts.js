import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPopularPosts = createAsyncThunk(
    'posts/fetchPopularPosts',
    async () => {
        const response = await fetch('https://www.reddit.com/r/popular.json');
        const jsonData = await response.json();
        console.log(jsonData.data.children.map(post => post.data));
        return jsonData.data.children.map(post => post.data);
    }
)

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (permalink) => {
    const response = await fetch(`https://www.reddit.com${permalink}.json`);
    const jsonData = await response.json();
    return jsonData[1].data.children.map(comment => comment.data);
    }
)

export const fetchSubreddits = createAsyncThunk(
    'subreddits/fetchSubreddits',
    async () => {
        const response = await fetch('https://www.reddit.com/subreddits/popular.json');
        const data = await response.json();
        return data.data.children.map((child) => child.data)
    }
)

export const fetchSubredditComments = createAsyncThunk(
    'subreddit/fetchComments',
    async (permalink) => {
    const response = await fetch(`https://www.reddit.com${permalink}.json`);
    const jsonData = await response.json();
    return jsonData[1].data.children.map(comment => comment.data);
    }
)

export const fetchPostsBySubreddit = createAsyncThunk(
    'posts/fetchBySubreddit',
    async (subreddit) => {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`)
        const data = await response.json();
        return data.data.children.map((post) => post.data)
    }
)