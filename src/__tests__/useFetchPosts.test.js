import { fetchPopularPosts } from '../hooks/useFetchPosts';
import { store } from '../app/store';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';

test('fetchPopularPosts should fetch the popular posts and update the store with the given posts', async () =>
{

});