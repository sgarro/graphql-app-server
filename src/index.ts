import { GraphQLServer, PubSub } from "graphql-yoga"
import resolvers from "./resolver/resolver"
import typeDefs from "./schemas/schema"
const pubsub = new PubSub()
const subscriptions = {
    onConnect: (connectionParams, webSocket, context) => {
      console.log("user", connectionParams.user)
      return  {
          currentUser: connectionParams.user,
      }
      },
      onDisconnect: (webSocket, context) => {
        console.log("onDisconnect", context.currentUser)

        // ...
      },
}
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub },  })
console.log(server.context)
server.start({subscriptions}, () => console.log("Server is running on localhost:4000"))
