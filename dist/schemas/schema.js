"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = apollo_server_express_1.gql `
      type User {
        id: Int!
        username: String!
        isOnline: Boolean!
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
      }`;
exports.default = typeDefs;
//# sourceMappingURL=schema.js.map