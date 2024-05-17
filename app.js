import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'

import WebAppAuthProvider from 'msal-node-wrapper'

const authConfig = {
    auth: {
   	clientId: "18d3292a-6aff-4178-8f83-43ab44b81071",
    	authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    	clientSecret: "3JS8Q~BuW6zPa5hHPnWs7i1C-5IEoa3bAyzY8bJt",
    	redirectUri: "https://a7-websharer.kayladoan.me/redirect"
    },
	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};

import models from './models.js';
import apiv3Router from './routes/api/v3/apiv3.js';
import apiv2Router from './routes/api/v2/apiv2.js';
import apiv1Router from './routes/api/v1/apiv1.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessions({
    secret: "this is some secret key I am making up p8kn fwlihftrn3oinyswnwd3in4oin",
    saveUninitialized: true,
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());


app.use((req, res, next) => {
    req.models = models
    next()
})

app.use('/api/v1', apiv1Router);
app.use('/api/v2', apiv2Router);
app.use('/api/v3', apiv3Router);


app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // redirect here after login
    })(req, res, next);

});
app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next);

});
app.use(authProvider.interactionErrorHandler());


export default app;
