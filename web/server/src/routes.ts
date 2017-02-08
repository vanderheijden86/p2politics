/* tslint:disable */
import { ValidateParam } from 'tsoa';
import { Web3Controller } from './controllers/web3.controller';

const models: any = {
    'Balance': {
        'coinbase': { typeName: 'string', required: true },
        'originalBalance': { typeName: 'number', required: true },
    },
};

/* tslint:disable:forin */
export function RegisterRoutes(app: any) {
    app.get('/v1/web3/balance', function(req: any, res: any, next: any) {
        const params = {
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new Web3Controller();
        promiseHandler(controller.getBalance.apply(controller, validatedParams), res, next);
    });

    function promiseHandler(promise: any, response: any, next: any) {
        return promise
            .then((data: any) => {
                if (data) {
                    response.json(data);
                } else {
                    response.status(204);
                    response.end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getRequestParams(request: any, bodyParamName?: string) {
        const merged: any = {};
        if (bodyParamName) {
            merged[bodyParamName] = request.body;
        }

        for (let attrname in request.params) { merged[attrname] = request.params[attrname]; }
        for (let attrname in request.query) { merged[attrname] = request.query[attrname]; }
        return merged;
    }

    function getValidatedParams(params: any, request: any, bodyParamName?: string): any[] {
        const requestParams = getRequestParams(request, bodyParamName);

        return Object.keys(params).map(key => {
            if (params[key].injected === 'inject') {
                return undefined;
            } else if (params[key].injected === 'request') {
                return request;
            } else {
                return ValidateParam(params[key], requestParams[key], models, key);
            }
        });
    }
}