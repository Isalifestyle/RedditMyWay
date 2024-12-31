import { useDispatch, useSelector } from 'react-redux';
import { searchInput, clearInput } from './searchSlice';
import { selectAllPosts } from '../posts/postsSlice';
import { selectSubredditPosts } from '../subreddits/subredditsSlice';
import { useSearch } from "../../SearchContext";



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
            dispatch(searchInput({searchTerm: userInput, posts: popularPosts}))
        }
        else if (userInput && selectedSubreddit) {
            dispatch(searchInput({searchTerm: userInput, posts: subredditPosts}))
        }

    }
    

    return (
        <>
            <form onSubmit = {handleSearchSubmit}>
                <input
                onChange = {(e) => setUserInput(e.target.value)}
                type = "text"
                value = {userInput}/>
                
            <button type = 'submit' >Search</button>
            </form>
        </>
    )
}