import { setupServer } from 'msw/node';
import requestHandlers from './testServerHandlers';
export { rest } from 'msw';

export const mswServer = setupServer(...requestHandlers);

beforeEach(() => mswServer.listen());
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
