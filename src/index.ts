import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createContext } from "./graphql/context";
import { schema } from "./graphql/schema";

const start = async () => {
  const server = express();
  const port = process.env.PORT || 3003;

  server.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

  const apolloServer = new ApolloServer({
    introspection: true,
    schema,
    context: createContext,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app: server,
  });
};

start();
