import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSubreddits } from "../../hooks/useFetchPosts";
import { fetchPostsBySubreddit } from "../../hooks/useFetchPosts";
const initialState = {
    subreddits: [],
    subredditPost: [],
    status: 'idle',
    error: null
};


const subredditSlice = createSlice({
    name:'subreddits',
    initialState,
    reducers: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubreddits.pending, (state) => 
            {
                state.status = 'loading';
            })
            .addCase(fetchSubreddits.fulfilled, (state, action) => 
            {
                state.status = 'succeeded';
                state.subreddits = action.payload;
            })
            .addCase(fetchSubreddits.rejected, (state, action) => 
            {
                state.status = 'rejected';
                state.error = action.error.message;
            })
            .addCase(fetchPostsBySubreddit.fulfilled, (state, action) => 
            {
                console.log('Fetching Posts...', action.payload);  // Log the full payload
                state.subredditPost = action.payload
            })
    }
})

export const selectAllSubreddits = (state) => state.subreddits.subreddits;
export const selectSubredditPosts = (state) => state.subreddits.subredditPost;
export default subredditSlice.reducer;