import restify = require('restify');
import {InsightResponse} from "../controller/IInsightFacade";
import Log from "../Util";
import InsightFacade from "../controller/InsightFacade";

export default class Endpoint {

    public static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::echo(..) - params: ' + JSON.stringify(req.params));
        try {
            let result = Endpoint.performEcho(req.params.msg);
            Log.info('Server::echo(..) - responding ' + result.code);
            res.json(result.code, result.body);
        } catch (err) {
            Log.error('Server::echo(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performEcho(msg: string): InsightResponse {
        if (typeof msg !== 'undefined' && msg !== null) {
            return {code: 200, body: {message: msg + '...' + msg}};
        } else {
            return {code: 400, body: {error: 'Message not provided'}};
        }
    }

    public static addDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Endpoint::addDataset()');
        new InsightFacade().addDataset(req.params.id, new Buffer(req.params.body).toString('base64'))
            .then(function (resp: InsightResponse) {
                res.status(resp.code);
                res.json(resp);
                return next();
            })
            .catch(function (err: InsightResponse) {
                res.status(err.code);
                res.json(err);
                return next();
            });
    }

    public static removeDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Endpoint::removeDataset() - params: ' + JSON.stringify(req.params));
        new InsightFacade().removeDataset(req.params.id)
            .then(function (resp: InsightResponse) {
                res.status(resp.code);
                res.json(resp);
                return next();
            })
            .catch(function (err: InsightResponse) {
                res.status(err.code);
                res.json(err);
                return next();
            });
    }

    public static performQuery(req: restify.Request, res: restify.Response, next: restify.Next) {
        new InsightFacade().performQuery(req.body)
            .then(function (resp: InsightResponse) {
                res.status(resp.code);
                res.json(resp);
                return next();
            })
            .catch(function (err: InsightResponse) {
                res.status(err.code);
                res.json(err);
                return next();
            });
    }

}