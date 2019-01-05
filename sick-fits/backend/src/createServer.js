const { GraphQLServer } = require('graphql-yoga');
// Then we also need to import what are called our resolvers. Resolver
// answers the question: Where does this data come from? or what are this
// data in the data base? We have query resolver, which is when you pull
// data and mutation resolvers when you push the data.
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const db = require('./db');

// create the GraphQL Yoga server
function createServer() {
  return new GraphQLServer({
    // (schema.graphql) This file will be contains the querys and resolvers, and
    // we are going to be able to share some dat between Prisma and Yoga
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    // This will make sense why we're doing this
    context: req => ({ ...req, db })
  })
}

module.exports = createServer;