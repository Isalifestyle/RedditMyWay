import { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [userInput, setUserInput] = useState('');

    return (
        <SearchContext.Provider value={{ userInput, setUserInput }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);