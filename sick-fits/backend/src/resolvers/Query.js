const { forwardTo } = require('prisma-binding');
const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  // async items(parent, args, ctx, info) {
  //   console.log('get Items');
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
};

module.exports = Query;
