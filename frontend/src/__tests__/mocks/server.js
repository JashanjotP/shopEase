import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// Jest expects test files under __tests__ to contain tests; add a noop test so
// this helper file doesn't fail the test runner when discovered.
test('msw server helper - noop', () => {})
