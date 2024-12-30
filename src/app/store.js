import { configureStore } from "@reduxjs/toolkit";
import searchReducer from '../features/search/searchSlice'
import postsReducer from "../features/posts/postsSlice";
import commentsReducer from "../features/comments/commentsSlice";
import subredditsReducer from "../features/subreddits/subredditsSlice";

export const store = configureStore({
    reducer:
    {
        posts: postsReducer,
        search: searchReducer,
        comments: commentsReducer,
        subreddits: subredditsReducer
    }
})