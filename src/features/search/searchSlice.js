import { createSlice } from "@reduxjs/toolkit";
import { redditData } from '../../data/dummyData';
import { selectSubredditPosts } from '../subreddits/subredditsSlice';
const initialState = {
    searchItem: '',
    results: [],
    dummyData: redditData
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        searchInput: (state, action) => {
            state.searchItem = action.payload;
            const searchTerm = action.payload.toLowerCase();
            state.results = state.dummyData.filter((post) => post.title.toLowerCase().includes(searchTerm) || post.subreddit.toLowerCase().includes(searchTerm)); 
        } ,
        clearInput : (state) => // Need to incorporate this still not incorprated
            {
                // state.searchItem = ''
                state.results = []
            }
    }

})

export const searchResults = (state) => state.search.results;
export const { searchInput, clearInput } = searchSlice.actions;
export default searchSlice.reducer;