import { Request, Response } from "express";

let passport = require('passport');
let BasicStrategy = require('passport-http').BasicStrategy;

export class Auth {
    static init() {
        passport.use(new BasicStrategy((username, password, callback) => {
            let user = {
                username: username,
            }
            callback(null, user)
        }));
    }

    static authenticate(request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        }
        if (request.ws) {
            return next();
        }
        Auth.isAuthenticated(request, response, next);
        //response.send('Authentication required', 401);
    }

    static isAuthenticated = passport.authenticate('basic', { session: false });
}
