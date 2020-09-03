'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { customAlphabet } = require('nanoid/async');
const pick = require('lodash/pick');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 9)
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    if (ctx.is('multipart')) return ctx.badRequest('multipart.notAllowed');

    const id = ctx.state.user.id;
    if(!id) return ctx.badRequest('CouldNotFindUserID');

    const entity = await strapi.services.group.create({uid : await nanoid(), users: [id] });
    if(!entity) return ctx.badRequest('CouldNotCreateGroup');
    if(!entity.users.length) return ctx.badRequest('CouldNotAddUser');
    
    //strapi.log.debug("entity", entity);
    //const user = await strapi.plugins['users-permissions'].services.user.fetch({
    //  id,
    //});

    //if(!user) return ctx.badRequest('CouldNotFindUser');

    //return sanitizeUser(user);
    const cleaned = sanitizeEntity(entity, { model: strapi.models.group });

    
    cleaned.users = cleaned.users.map(user => pick(user, ['firstname', 'lastname', 'id']));
    

    return ctx.send(cleaned);
  },
};
