import * as express from "express";
import * as path from "path";
import * as _ from "lodash";

export class ClientRoutes {
    static setupClientRoutes(app) {
        // serve the client form the ./dist folder
        let clientPath = path.normalize(path.join(__dirname, '/../../../client'));
        let clientDist = `${clientPath}/dist`;
        let clientImages = `${clientDist}/assets/images`;
        let clientIcons = `${clientDist}/assets/icons`;
        let clientI18N = `${clientDist}/assets/i18n`;
        console.log('__dirname        ', __dirname);
        console.log('clientPath       ', clientPath);
        console.log('clientImages', clientImages);

        // static files
        app.use(express.static(clientDist));
        // images
        app.use('/assets/images/', express.static(clientImages));
        // i18n
        app.use('/assets/i18n/', express.static(clientI18N));
        // index.html
        let renderIndex = (request, response) => {
            // suppress websocket calls
            if (!request.ws && !_.startsWith(request.params[0], 'v1')) {
                let index = path.resolve(clientDist, 'index.html');
                //let index = path.resolve(clientDist, 'index.html');
                console.log('request.path', request.path, 'index', index);
                response.sendFile(index);
            }
        }
        app.get('/*', renderIndex);
    }
}