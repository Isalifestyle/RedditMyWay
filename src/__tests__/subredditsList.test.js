import { fireEvent } from "@testing-library/react";
import { SubredditSidebar } from "../components/subreddits/subredditsList";
import { BrowserRouter } from 'react-router-dom';

test('button click', () => {
    const { getByText } = render(<BrowserRouter> <SubredditSidebar /> </BrowserRouter>)
    const button = getByText('Back To Main Posts');
    fireEvent.click(button);
    expect(window.location.pathname).toBe('/popularPosts');

})