"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chats = [];
const users = [];
const CHAT_CHANNEL = "CHAT_CHANNEL";
const USERS = "USERS";
const resolvers = {
    Query: {
        chats(root, args, context) {
            return chats;
        },
        usersOnline(root, args, context) {
            return users;
        }
    },
    Mutation: {
        createChat(root, { from, content }, { pubsub }) {
            const userIndex = users.findIndex((userToFind) => userToFind.username === from);
            const user = users[userIndex];
            const chat = { id: chats.length + 1, from: user, content };
            chats.push(chat);
            console.log("CHATCREATED", pubsub);
            pubsub.publish("CHAT_CHANNEL", { messageSent: chat });
            return chat;
        },
        updateUserOnline(root, { username }, { pubsub }) {
            console.log("updating user");
            const userIndex = users.findIndex((userToFind) => userToFind.username === username);
            const user = (userIndex !== -1) ? users[userIndex] : { id: users.length + 1, username };
            user.last = new Date();
            if (userIndex === -1) {
                users.push(user);
            }
            pubsub.publish("USERS", { usersOnline: users });
            return user;
        },
        logoutUserOnline(root, { username }, { pubsub }) {
            const newUsers = users.filter((user) => user.username !== username);
            console.log("newUsers", newUsers);
            pubsub.publish("USERS", { usersOnline: newUsers });
            return;
        },
    },
    Subscription: {
        messageSent: {
            subscribe: (root, args, context) => {
                console.log("MESSAGGESENT", context);
                return context.pubsub.asyncIterator(CHAT_CHANNEL);
            }
        },
        usersOnline: {
            subscribe: (root, args, { pubsub }) => {
                return pubsub.asyncIterator(USERS);
            }
        }
    }
};
exports.default = resolvers;
//# sourceMappingURL=resolver.js.map