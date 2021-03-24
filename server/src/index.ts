import "reflect-metadata";
import "dotenv/config"
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import {createConnection} from "typeorm";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {UserResolver} from "./resolvers/UserResolver";
import {IContext} from "./interfaces/IContext";
import {isAuthorized} from "./services/Authorization";
import {refreshTokenRouter} from "./services/RefreshTokenRoute";
import {PostResolver} from "./resolvers/PostResolver";
import {LikeResolver} from "./resolvers/LikeResolver";
import {graphqlUploadExpress} from "graphql-upload";
import {CommentResolver} from "./resolvers/CommentResolver";

(async () => {
    const app = express();
    await createConnection();
    console.log('Connected to DB')

    app.use(cors({origin: 'http://localhost:3000', credentials: true}))
    app.use(cookieParser())
    app.use(graphqlUploadExpress({maxFileSize: 3000000, maxFiles: 1}))
    app.use(refreshTokenRouter)
    app.use(express.static('public'))

    const schema = await buildSchema({
        resolvers: [UserResolver, PostResolver, LikeResolver, CommentResolver],
        authChecker: isAuthorized,
    });

    const server = new ApolloServer({
        schema,
        context: ({req, res}): IContext => ({req, res}),
        uploads: false,
    })

    server.applyMiddleware({app})

    await app.listen(process.env.PORT)
    console.log('Server Started')
})()
