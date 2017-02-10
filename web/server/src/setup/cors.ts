import { Request, Response } from "express";

export class Cors {
    static allowCrossDomain(request: Request, response: Response, next: Function) {
        response.header('Access-Control-Allow-Origin', '*'); // TODO weghalen op P
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Origin');
        //res.header('Access-Control-Max-Age', '86400'); // 24 hours

        // intercept OPTIONS method
        if (request.method === 'OPTIONS') {
            response.sendStatus(200);
        } else {
            next();
        }
    }
}
