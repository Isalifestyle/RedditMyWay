import logo from './logo.svg';
import './App.css';
import { SearchBar } from "./features/search/SearchBar";
import { Posts } from './features/posts/Posts';
function App() {
  return (
    <>
      <SearchBar/>
      <Posts/>

    </>
  );
}

export default App;
