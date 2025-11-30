import { rest } from 'msw'

// Note: API_BASE_URL in project is '/api' and API_URLS include '/api/...' so endpoints become '/api/api/...'

const sampleProducts = [
  { id: 'p1', slug: 'test-phone', name: 'Test Phone', thumbnail: 'http://example.com/t.jpg', categoryId: 'cat-1', categoryTypeId: 'type-1', price: 199.99, rating: 4, variants: [{ id: 'v1', size: 'M', color: 'Black', stockQuantity: 10 }], productResources: [{ url: 'http://example.com/t.jpg' }] },
  { id: 'p2', slug: 'other-phone', name: 'Other Phone', thumbnail: 'http://example.com/t2.jpg', categoryId: 'cat-1', categoryTypeId: 'type-1', price: 299.99, rating: 5 }
]

export const handlers = [
  // products list
  rest.get('/api/api/products', (req, res, ctx) => {
    const categoryId = req.url.searchParams.get('categoryId')
    const typeId = req.url.searchParams.get('typeId')
    const slug = req.url.searchParams.get('slug')

    if (slug) {
      const found = sampleProducts.find(p => p.id === slug || p.slug === slug)
      return res(ctx.status(200), ctx.json(found ? [found] : []))
    }

    let filtered = sampleProducts
    if (categoryId) filtered = filtered.filter(p => p.categoryId === categoryId)
    if (typeId) filtered = filtered.filter(p => p.categoryTypeId === typeId)

    return res(ctx.status(200), ctx.json(filtered))
  }),

  // single product by id (path)
  rest.get('/api/api/product/:id', (req, res, ctx) => {
    const { id } = req.params
    const found = sampleProducts.find(p => p.id === id)
    return res(ctx.status(200), ctx.json(found || {}))
  }),

  // place order
  rest.post('/api/order', async (req, res, ctx) => {
    const body = await req.json()
    // echo back with fake credentials
    return res(ctx.status(200), ctx.json({ id: 'order-1', credentials: { client_secret: 'cs_test' }, received: body }))
  }),

  // user profile
  rest.get('/api/api/user/profile', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 'user-123', addressList: [{ id: 'addr-123', name: 'Home', street: '1 Main', city: 'Town', state: 'ST', zipCode: '12345' }] }))
  }),

  // address create/delete
  rest.post('/api/api/address', async (req, res, ctx) => {
    const body = await req.json()
    return res(ctx.status(201), ctx.json({ id: 'addr-new', ...body }))
  }),

  rest.delete('/api/api/address/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ success: true }))
  })
]

export default handlers

// Add a noop test so Jest doesn't treat this helper file as an empty test suite
test('msw handlers helper - noop', () => {})
