import { createSlice } from "@reduxjs/toolkit";
import { fetchComments, fetchSubredditComments } from '../../hooks/useFetchPosts'

const initialState = 
{
    popularComments: {},
    subredditComments: {},
    popularStatus: 'idle',
    subredditStatus: 'idle'
}
const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearPopularComments: (state) => {
            state.popularComments = {};
        },
        clearSubredditComments: (state) => {
            state.subredditComments = {};
        }

    },
    extraReducers: (builder) =>
    {
        builder
            //Popular posts comments (default view)
            .addCase(fetchComments.pending, (state) => 
            {
                console.log('Loading testing')
                state.popularStatus = 'loading'
            })
            .addCase(fetchComments.fulfilled, (state, action) =>
            {
                console.log('action.payload:', action.payload); // Log to check the payload structure
                console.log('action.meta.arg:', action.meta.arg);
                state.popularStatus = 'succeeded';
                state.popularComments[action.meta.arg] = action.payload
            })
            .addCase(fetchComments.rejected, (state,action) =>
            {
                state.popularStatus = 'failed';
            })
            //Subreddit Comments
            .addCase(fetchSubredditComments.pending, (state) => {
                state.subredditStatus = 'loading';
            })
            .addCase(fetchSubredditComments.fulfilled, (state, action) => {
                state.subredditStatus = 'succeeded'
                state.subredditComments[action.meta.arg] = action.payload
            })
            .addCase(fetchSubredditComments.rejected, (state, action) => {
                state.subredditStatus = 'failed';

            })
    }
})

export const availablePopularComments = (state) => state.comments.popularComments;
export const availableSubredditComments = (state) => state.comments.subredditComments;
export const getPopularCommentsStatus = (state) => state.comments.popularStatus;
export const getSubredditCommentsStatus = (state) =>state.comments.subredditStatus
export const { clearPopularComments, clearSubredditComments } = commentsSlice.actions;
export default commentsSlice.reducer;