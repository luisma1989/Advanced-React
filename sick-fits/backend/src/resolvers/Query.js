const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');
const Query = {
  // async items(parent, args, ctx, info) {
  //   console.log('get Items');
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // check if there is a current ID user
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  },
  async users (parent, args, ctx, info) {
    // Check if they are logedin
    if (!ctx.request.userId) {
      throw new Error('Debes estar llogueado en la apllicación.')
    }
    // 2. Check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    // 3. if the do, query alll the users!
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
