import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SearchProvider } from "../src/SearchContext";
import { Posts } from './components/posts/Posts';
import { SubredditSidebar } from './components/subreddits/subredditsList';

function App() {
  return (
    <>
      <SearchProvider>
        <Routes>
          {/* Redirect the root path to /popularPosts */}
          <Route path="/" element={<Navigate to="/popularPosts" />} />
          
          <Route path="/popularPosts" element={<Posts />}>
            <Route path=":subredditName" element={<SubredditSidebar />} />
          </Route>
        </Routes>
      </SearchProvider>
    </>
  );
}

export default App;
