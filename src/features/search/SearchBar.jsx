import { useState } from "react";
import { useDispatch } from 'react-redux';
import { searchInput, clearInput } from './searchSlice';
export const SearchBar = () => 
{
    const [userInput, setUserInput] = useState('');
    const dispatch = useDispatch();

    const handleSearchSubmit = (e) =>
    {
        e.preventDefault()
        if(userInput)
        {
            dispatch(searchInput(userInput))
        }
        // dispatch(clearInput())
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