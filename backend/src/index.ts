// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Set public role permissions for Market, Creator, Video, Product (find + findOne)
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const permissions = [
        'api::market.market.find',
        'api::market.market.findOne',
        'api::creator.creator.find',
        'api::creator.creator.findOne',
        'api::video.video.find',
        'api::video.video.findOne',
        'api::product.product.find',
        'api::product.product.findOne',
      ];

      for (const action of permissions) {
        const existing = await strapi.db
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: publicRole.id } });

        if (!existing) {
          await strapi.db
            .query('plugin::users-permissions.permission')
            .create({ data: { action, role: publicRole.id } });
        }
      }

      strapi.log.info('Public role permissions configured for Market, Creator, Video, Product');
    } else {
      strapi.log.warn('Public role not found — skipping permission configuration');
    }

    // Set authenticated role permissions for Briefing and VideoProduction (full CRUD)
    const authenticatedRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (authenticatedRole) {
      const permissions = [
        'api::briefing.briefing.find',
        'api::briefing.briefing.findOne',
        'api::briefing.briefing.create',
        'api::briefing.briefing.update',
        'api::briefing.briefing.delete',
        'api::video-production.video-production.find',
        'api::video-production.video-production.findOne',
        'api::video-production.video-production.create',
        'api::video-production.video-production.update',
        'api::video-production.video-production.delete',
      ];

      for (const action of permissions) {
        const existing = await strapi.db
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: authenticatedRole.id } });

        if (!existing) {
          await strapi.db
            .query('plugin::users-permissions.permission')
            .create({ data: { action, role: authenticatedRole.id } });
        }
      }

      strapi.log.info('Authenticated role permissions configured for Briefing and VideoProduction');
    }
  },
};
