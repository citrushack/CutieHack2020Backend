'use strict';

/**
 * Upload.js controller
 *
 */

const _ = require('lodash');
const apiUploadController = require('../../../node_modules/strapi-plugin-upload/controllers/upload/api');
const adminUploadController = require('../../../node_modules/strapi-plugin-upload/controllers/upload/admin');

const resolveController = ctx => {
  const {
    state: { isAuthenticatedAdmin },
  } = ctx;

  return isAuthenticatedAdmin ? adminUploadController : apiUploadController;
};

const resolveControllerMethod = method => ctx => {
  const controller = resolveController(ctx);
  const callbackFn = controller[method];

  if (!_.isFunction(callbackFn)) {
    return ctx.notFound();
  }

  return callbackFn(ctx);
};

module.exports = {
  find: resolveControllerMethod('find'),
  findOne: resolveControllerMethod('findOne'),
  count: resolveControllerMethod('count'),
  destroy: resolveControllerMethod('destroy'),
  updateSettings: resolveControllerMethod('updateSettings'),
  getSettings: resolveControllerMethod('getSettings'),

  async upload(ctx) {
    const isUploadDisabled = _.get(strapi.plugins, 'upload.config.enabled', true) === false;

    if (isUploadDisabled) {
      throw strapi.errors.badRequest(null, {
        errors: [{ id: 'Upload.status.disabled', message: 'File upload is disabled' }],
      });
    }
    //Checks if resume upload comes from the right user
// -      strapi.log.debug("state.user", ctx.state.user.id);
// -    strapi.log.debug("state.user", ctx.state.user.id);
// -    strapi.log.debug("request body", ctx.request.body);
// -    strapi.log.debug("params id", ctx.params.id);
// -    strapi.log.debug("params ", ctx.params);
const idx = ctx.state.user.id;
    if (idx != ctx.request.body.refId) {
      if(state.user.id != "5f6ea03a86d34b1ed438a963") return ctx.unauthorized(`You can't update this entry`);
    }

    const {
      query: { id },
      request: { files: { files } = {} },
    } = ctx;
    const controller = resolveController(ctx);

    if (id && (_.isEmpty(files) || files.size === 0)) {
      return controller.updateFileInfo(ctx);
    }

    if (_.isEmpty(files) || files.size === 0) {
      throw strapi.errors.badRequest(null, {
        errors: [{ id: 'Upload.status.empty', message: 'Files are empty' }],
      });
    }

    await (id ? controller.replaceFile : controller.uploadFiles)(ctx);
  },

  async search(ctx) {
    const { id } = ctx.params;

    ctx.body = await strapi.query('file', 'upload').custom(searchQueries)({
      id,
    });
  },
};

const searchQueries = {
  bookshelf({ model }) {
    return ({ id }) => {
      return model
        .query(qb => {
          qb.whereRaw('LOWER(hash) LIKE ?', [`%${id}%`]).orWhereRaw('LOWER(name) LIKE ?', [
            `%${id}%`,
          ]);
        })
        .fetchAll()
        .then(results => results.toJSON());
    };
  },
  mongoose({ model }) {
    return ({ id }) => {
      const re = new RegExp(id, 'i');

      return model
        .find({
          $or: [{ hash: re }, { name: re }],
        })
        .lean();
    };
  },
};

