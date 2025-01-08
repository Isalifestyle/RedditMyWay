import { configureStore } from "@reduxjs/toolkit";
import searchReducer from '../components/search/searchSlice'
import postsReducer from "../components/posts/postsSlice";
import commentsReducer from "../components/comments/commentsSlice";
import subredditsReducer from "../components/subreddits/subredditsSlice";

export const store = configureStore({
    reducer:
    {
        posts: postsReducer,
        search: searchReducer,
        comments: commentsReducer,
        subreddits: subredditsReducer
    }
})