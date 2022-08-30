import { setupServer } from 'msw/node';
import { handlers } from './handlersTestServer';
export { rest } from 'msw';

export const mswServer = setupServer(...handlers);

beforeEach(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());
