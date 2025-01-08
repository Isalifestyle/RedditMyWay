import { fetchPopularPosts } from '../hooks/useFetchPosts';
import { store } from '../app/store';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';

test('fetchPopularPosts should fetch the popular posts and update the store with the given posts', async () =>
{
    await store.dispatch(fetchPopularPosts());

    const state = store.getState();
    expect(Array.isArray(state.posts)).toBe(false);
    expect(state.posts).toHaveLength(2); 
    expect(state.posts).toHaveLength(22);
    expect(state.posts[0].title).toBe('Post 1');
    expect(state.posts[1].title).toBe('Post 2')
});