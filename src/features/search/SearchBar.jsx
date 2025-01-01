import { useDispatch, useSelector } from 'react-redux';
import { searchInput, clearInput } from './searchSlice';
import { selectAllPosts } from '../posts/postsSlice';
import { selectSubredditPosts } from '../subreddits/subredditsSlice';
import { useSearch } from "../../SearchContext";
import styles from "../search/searchBar.module.css";


export const SearchBar = ({ selectedSubreddit }) => 
{
    const { userInput, setUserInput } = useSearch();
    const dispatch = useDispatch();
    const popularPosts = useSelector(selectAllPosts);
    const subredditPosts = useSelector(selectSubredditPosts)


    const handleSearchSubmit = (e) =>
    {
        e.preventDefault()
        if(userInput && !selectedSubreddit)
        {
            console.log('PopularPost dispatch')
            dispatch(searchInput({searchTerm: userInput, posts: popularPosts}))
        }
        else if (userInput && selectedSubreddit) {
            console.log('Subreddit Post dispatch')
            dispatch(searchInput({searchTerm: userInput, posts: subredditPosts}))
        }

    }
    

    return (
        <>
            <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
                <input
                    className={styles.searchBar}
                    onChange={(e) => setUserInput(e.target.value)}
                    type="text"
                    value={userInput}
                    placeholder="Search..."
                />
                <button type='submit' className={styles.searchButton}>Search</button>
            </form>
        </>
    )
}