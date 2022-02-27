import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const { APP_PORT = 4000 } = process.env

const app = express()

app.disable('x-powered-by')

const server = async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({ app })

  app.listen({ port: APP_PORT }, () => {
    console.log(
      `Server ready at localhost:${APP_PORT}${apolloServer.graphqlPath}`
    )
  })
}

server()
