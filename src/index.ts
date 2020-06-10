import { ApolloServer, PubSub } from "apollo-server-express"
import express from "express"
import http from "http"
const pubsub = new PubSub()
const subscriptions = {
    onConnect: (connectionParams, webSocket, context) => {
      console.log("user", connectionParams.user)
      resolvers.Mutation.updateUserOnline(null, {username: connectionParams.user}, {pubsub})
      return  {

          currentUser: connectionParams.user,
      }
      },
      onDisconnect: (webSocket, context) => {
        context.initPromise.then(async ({currentUser}) => {
          resolvers.Mutation.logoutUserOnline(null, {username: currentUser}, {pubsub})
          console.log("user Leaving", currentUser)
        })
      },
}
import resolvers from "./resolvers/resolver"
import typeDefs from "./schemas/schema"

const server = new ApolloServer({
  context: async ({connection}) => {
    return {
      ...connection.context,
      pubsub,
    }
  },
  resolvers,
  subscriptions,
  typeDefs,
  })

const app = express()
server.applyMiddleware({ app })
const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)
const PORT = 4000

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})
