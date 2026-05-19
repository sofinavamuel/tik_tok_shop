module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/video-productions',
      handler: 'video-production.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/video-productions/:id',
      handler: 'video-production.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/video-productions',
      handler: 'video-production.create',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/video-productions/:id',
      handler: 'video-production.update',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/video-productions/:id',
      handler: 'video-production.delete',
      config: { auth: false },
    },
  ],
};
