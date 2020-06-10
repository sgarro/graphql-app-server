"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const pubsub = new apollo_server_express_1.PubSub();
const subscriptions = {
    onConnect: (connectionParams, webSocket, context) => {
        console.log("user", connectionParams.user);
        resolver_1.default.Mutation.updateUserOnline(null, { username: connectionParams.user }, { pubsub });
        return {
            currentUser: connectionParams.user,
        };
    },
    onDisconnect: (webSocket, context) => {
        context.initPromise.then(({ currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            resolver_1.default.Mutation.logoutUserOnline(null, { username: currentUser }, { pubsub });
            console.log("user Leaving", currentUser);
        }));
    },
};
const resolver_1 = __importDefault(require("./resolvers/resolver"));
const schema_1 = __importDefault(require("./schemas/schema"));
const server = new apollo_server_express_1.ApolloServer({
    context: ({ connection }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("context");
        return Object.assign(Object.assign({}, connection.context), { pubsub });
    }),
    resolvers: resolver_1.default,
    subscriptions,
    typeDefs: schema_1.default,
});
const app = express_1.default();
server.applyMiddleware({ app });
const httpServer = http_1.default.createServer(app);
server.installSubscriptionHandlers(httpServer);
const PORT = 4000;
// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
//# sourceMappingURL=index.js.map