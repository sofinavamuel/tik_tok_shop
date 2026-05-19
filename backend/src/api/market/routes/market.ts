module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/markets',
      handler: 'market.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/markets/:id',
      handler: 'market.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/markets',
      handler: 'market.create',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/markets/:id',
      handler: 'market.update',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/markets/:id',
      handler: 'market.delete',
      config: { auth: false },
    },
  ],
};
