import { ApolloServer, gql } from "apollo-server-express"

const typeDefs = gql`
      type User {
        id: Int!
        username: String!
        last: String!
      }
      type Chat {
        id: Int!
        from: User
        content: String!
      }
      type Query {
        chats: [Chat]
        usersOnline: [User]
      }
      type Mutation {
        createChat(from: String!, content: String!): Chat
        updateUserOnline(username: String!): User
        logoutUserOnline(username: String!): User
      }
      type Subscription {
        messageSent: Chat
        usersOnline: [User]
      }`

export default typeDefs
