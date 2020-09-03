'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const has = require('lodash/has');
const pick = require('lodash/pick');
const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

const sanitizeGroup = group =>
  sanitizeEntity(group, {
    model: strapi.query('group').model,
  });

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {

  /**
   * Update a/an user record.
   * @return {Object}
   */
  async updateme(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    const id = ctx.state.user.id;
    //const { email, username, password } = ctx.request.body;

    const user = await strapi.plugins['users-permissions'].services.user.fetch({
      id,
    });

    // if (has(ctx.request.body, 'email')) {
    //   return ctx.badRequest('email.notAllowed');
    // }

    // if (has(ctx.request.body, 'username')) {
    //   return ctx.badRequest('username.notAllowed');
    // }

    // if (has(ctx.request.body, 'password')) {
    //   return ctx.badRequest('password.notAllowed');
    // }

    if (!has(ctx.request.body, 'group')) return ctx.badRequest('OnlyGroupChangesAllowed');
    //strapi.log.debug("updateData", user.group['id']);

    if(ctx.request.body.group == 'none'){
      if(!user.group) return ctx.badRequest('NotCurrentlyInGroup');
      await strapi.plugins['users-permissions'].services.user.edit({ id }, {group: null});
      return ctx.send({response : 'GroupLeft'});
    }
    
    const foundGroup = await strapi.query('group').findOne({ uid: ctx.request.body.group });
    if(!foundGroup) return ctx.badRequest('CouldNotFindGroup');
    
    const updateData =  {'group': foundGroup.id};
    
    const updatedPerson = await strapi.plugins['users-permissions'].services.user.edit({ id }, updateData);
    if(!updatedPerson) return ctx.badRequest('CouldNotUpdatePerson');

    const group = await strapi.query('group').findOne({ uid: ctx.request.body.group });
    if(!group) return ctx.badRequest('CouldNotReturnGroup');

    let cleaned = sanitizeGroup(group);

    if(has(cleaned, 'users') && cleaned.users.length ){
      cleaned.users = cleaned.users.map(user => pick(user, ['firstname', 'lastname', 'id']));
    }

    return ctx.send(cleaned);  
    
    //updateData = {...ctx.request.body};
      // strapi.log.debug("updateData", updateData);
      // strapi.log.debug("foundGroup", foundGroup);
  },
  async getMyGroup(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    const id = ctx.state.user.id;
    const user = await strapi.plugins['users-permissions'].services.user.fetch({
      id,
    });
    if(!has(user, 'group.id')){
      return ctx.badRequest('UserNotInGroup');
    }
    const foundGroup = await strapi.query('group').findOne({ id: user.group['id'] });
    if(!foundGroup) return ctx.badRequest('CouldNotFindGroup');
    
    let cleaned = sanitizeGroup(foundGroup);

    if(has(cleaned, 'users') && cleaned.users.length ){
      cleaned.users = cleaned.users.map(user => pick(user, ['firstname', 'lastname', 'id']));
    }

    return ctx.send(cleaned);  
    
    //updateData = {...ctx.request.body};
      // strapi.log.debug("updateData", updateData);
      // strapi.log.debug("foundGroup", foundGroup);
  }

};
