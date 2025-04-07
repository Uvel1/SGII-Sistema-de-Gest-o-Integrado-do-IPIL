import express from "express";
import 'dotenv/config';
import './shared/services/TranslationsYup.services';
import {router} from "./routes/index.routes";
import cors from 'cors';
import path from 'path';

const server = express();

server.use(express.static(path.join(__dirname, 'public')));
server.use(cors());
server.use(express.json());
server.use(router);


export {server};