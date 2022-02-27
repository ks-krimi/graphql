import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
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

const schema = buildSchema(`
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
      messages:[Message!]!
    }

    type Message {
      id: ID!
      body: String!
      createdAt: String!
    }
`)

class User {
  constructor (user) {
    Object.assign(this, user)
  }

  messages () {
    return db.messages.filter((message) => message.userId === this.id)
  }
}

// resolver
const rootValue = {
  users: () => db.users.map((user) => new User(user)),
  user: (args) =>
    db.users.map((user) => new User(user)).find((user) => user.id === args.id),
  messages: () => db.messages,
  addUser: ({ email, name }) => {
    const user = {
      id: crypto.randomBytes(10).toString('hex'),
      email,
      name
    }
    db.users.push(user)
    return user
  },
  delUser: ({ id }) => {
    const user = db.users.find((user) => user.id === id)
    if (user) {
      db.users = db.users.filter((user) => user.id !== id)
    }
    return user
  }
}

const app = express()

app.use('/graphql', graphqlHTTP({ schema, rootValue, graphiql: true }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`listen on localhost: ${PORT}`))
