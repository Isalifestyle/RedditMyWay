import { setupServer } from 'msw/node';
import { handlers } from './handlers';  // Your msw handlers

// Set up the MSW server with the handlers
export const server = setupServer(...handlers);

// Set up lifecycle hooks
beforeAll(() => server.listen());  // Start server before tests
afterEach(() => server.resetHandlers());  // Reset handlers after each test to ensure no interference
afterAll(() => server.close());