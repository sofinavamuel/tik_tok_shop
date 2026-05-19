module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/briefings',
      handler: 'briefing.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/briefings/:id',
      handler: 'briefing.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/briefings',
      handler: 'briefing.create',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/briefings/:id',
      handler: 'briefing.update',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/briefings/:id',
      handler: 'briefing.delete',
      config: { auth: false },
    },
  ],
};
