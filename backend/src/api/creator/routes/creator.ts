module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/creators',
      handler: 'creator.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/creators/:id',
      handler: 'creator.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/creators',
      handler: 'creator.create',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/creators/:id',
      handler: 'creator.update',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/creators/:id',
      handler: 'creator.delete',
      config: { auth: false },
    },
  ],
};
