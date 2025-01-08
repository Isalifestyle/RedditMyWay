import { createSlice } from "@reduxjs/toolkit";
import { selectSubredditPosts } from '../subreddits/subredditsSlice';
const initialState = {
    searchItem: '',
    results: [],
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        searchInput: (state, action) => {
            const { searchTerm, posts } = action.payload;
            state.searchItem = searchTerm;
            const lowerSearchTerm = searchTerm.toLowerCase();
            console.log('Search Term', lowerSearchTerm)
            state.results = posts.filter((post) => post.title.toLowerCase().includes(lowerSearchTerm)); 
        },
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