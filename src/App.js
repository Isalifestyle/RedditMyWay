import logo from './logo.svg';
import './App.css';
import { SearchProvider } from "../src/SearchContext";
import { Posts } from './components/posts/Posts';
function App() {
  return (
    <>
    <SearchProvider>
      <Posts/>
    </SearchProvider>

    </>
  );
}

export default App;
