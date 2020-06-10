const chats: any = []
const users: any = []
const CHAT_CHANNEL = "CHAT_CHANNEL"
const USERS = "USERS"

const resolvers = {
    Query: {
        chats(root, args, context) {
            return chats
        },
        usersOnline(root, args, context) {
            return users
        }
    },

    Mutation: {
        createChat(root, {from, content}, {pubsub}) {
            const userIndex = users.findIndex((userToFind) => userToFind.username === from)
            const user = users[userIndex]
            const chat = { id: chats.length + 1, from: user, content}
            chats.push(chat)
            console.log("CHATCREATED", pubsub)
            pubsub.publish("CHAT_CHANNEL", {messageSent: chat})
            return chat
        },
        updateUserOnline(root, {username}, {pubsub}) {
            console.log("updating user")
            const userIndex = users.findIndex((userToFind) => userToFind.username === username)
            const user = (userIndex !== -1) ? users[userIndex] : {id: users.length + 1, username}
            user.isOnline = true
            if (userIndex === -1) {
                users.push(user)
            }
            pubsub.publish("USERS", {usersOnline: users})
            return user
        },
        logoutUserOnline(root, {username}, {pubsub}) {
            const userIndex = users.findIndex((userToFind) => userToFind.username === username)
            const user = (userIndex !== -1) ? users[userIndex] : {id: users.length + 1, username}
            user.isOnline = false
            pubsub.publish("USERS", {usersOnline: users})
            return
        },
    },

    Subscription: {
        messageSent: {
            subscribe: (root, args, context) => {
                console.log("MESSAGGESENT", context)
                return context.pubsub.asyncIterator(CHAT_CHANNEL)
            }
        },
        usersOnline: {
            subscribe: (root, args, {pubsub}) => {
                return pubsub.asyncIterator(USERS)
            }
        }
    }
}

export default resolvers
