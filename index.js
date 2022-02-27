import { ApolloServer, gql } from 'apollo-server'
import crypto from 'crypto'

const db = {
  users: [
    { id: '1', name: 'Nico', email: 'ny.kalash@gmail.com' },
    { id: '2', name: 'Krimi', email: 'krimi@gmail.com' }
  ],
  messages: [
    { id: '1', userId: '1', body: 'Hello', createdAt: Date.now() },
    { id: '2', userId: '2', body: 'Hi', createdAt: Date.now() },
    { id: '1', userId: '1', body: "What's up", createdAt: Date.now() }
  ]
}

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User!
    messages: [Message!]!
  }

  type Mutation {
    addUser(email: String!, name: String): User
    delUser(id: ID!): User
  }

  type User {
    id: ID!
    name: String
    email: String
    avatarUrl: String
    messages: [Message!]!
  }

  type Message {
    id: ID!
    body: String!
    createdAt: String!
  }
`
const resolvers = {
  Query: {
    users: () => db.users,
    user: (root, { id }) => db.users.find((user) => user.id === id),
    messages: () => db.messages
  },
  Mutation: {
    addUser: (root, { email, name }) => {
      const user = {
        id: crypto.randomBytes(10).toString('hex'),
        email,
        name
      }
      db.users.push(user)
      return user
    },
    delUser: (root, { id }) => {
      const user = db.users.find((user) => user.id === id)
      if (user) {
        db.users = db.users.filter((user) => user.id !== id)
      }
      return user
    }
  },
  User: {
    messages: (user) =>
      db.messages.filter((message) => message.userId === user.id)
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server
  .listen()
  .then(({ url }) => console.log(url))
  .catch((e) => console.log(e))
