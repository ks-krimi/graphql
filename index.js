import { graphql, buildSchema } from 'graphql'

const db = {
  users: [
    { id: 1, name: 'Nico', email: 'ny.kalash@gmail.com' },
    { id: 2, name: 'Krimi', email: 'krimi@gmail.com' }
  ]
}

const schema = buildSchema(`
    type Query {
        users: [User!]!
    }

    type User {
      id: ID!
      name: String
      email: String
      avatarUrl: String
    }
`)

const rootValue = {
  users: () => db.users
}

graphql(
  schema,
  `
    {
      users {
        email
      }
    }
  `,
  rootValue
)
  .then(({ data }) => console.log(data))
  .catch(console.error)
