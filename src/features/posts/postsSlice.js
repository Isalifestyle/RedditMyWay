import { createSlice } from '@reduxjs/toolkit';
import { fetchPopularPosts } from '../../hooks/useFetchPosts';
import { fetchPostsBySubreddit, fetchComments } from "../../hooks/useFetchPosts";

const initialState = {
    posts:[],
    status: 'idle',
    error: null,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPopularPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPopularPosts.fulfilled, (state, action) => 
            {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(fetchPopularPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            }) 

    } 
})


export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const selectPopularPosts = (state) => state.posts.popularPosts;
export const { clearSelectedSubreddit } = postsSlice.actions

export default postsSlice.reducer;