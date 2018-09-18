"use strict";
var Util_1 = require("../Util");
var InsightFacade_1 = require("../controller/InsightFacade");
var Endpoint = (function () {
    function Endpoint() {
    }
    Endpoint.echo = function (req, res, next) {
        Util_1.default.trace('Server::echo(..) - params: ' + JSON.stringify(req.params));
        try {
            var result = Endpoint.performEcho(req.params.msg);
            Util_1.default.info('Server::echo(..) - responding ' + result.code);
            res.json(result.code, result.body);
        }
        catch (err) {
            Util_1.default.error('Server::echo(..) - responding 400');
            res.json(400, { error: err.message });
        }
        return next();
    };
    Endpoint.performEcho = function (msg) {
        if (typeof msg !== 'undefined' && msg !== null) {
            return { code: 200, body: { message: msg + '...' + msg } };
        }
        else {
            return { code: 400, body: { error: 'Message not provided' } };
        }
    };
    Endpoint.addDataset = function (req, res, next) {
        Util_1.default.trace('Endpoint::addDataset()');
        new InsightFacade_1.default().addDataset(req.params.id, new Buffer(req.params.body).toString('base64'))
            .then(function (resp) {
            res.status(resp.code);
            res.json(resp);
            return next();
        })
            .catch(function (err) {
            res.status(err.code);
            res.json(err);
            return next();
        });
    };
    Endpoint.removeDataset = function (req, res, next) {
        Util_1.default.trace('Endpoint::removeDataset() - params: ' + JSON.stringify(req.params));
        new InsightFacade_1.default().removeDataset(req.params.id)
            .then(function (resp) {
            res.status(resp.code);
            res.json(resp);
            return next();
        })
            .catch(function (err) {
            res.status(err.code);
            res.json(err);
            return next();
        });
    };
    Endpoint.performQuery = function (req, res, next) {
        new InsightFacade_1.default().performQuery(req.body)
            .then(function (resp) {
            res.status(resp.code);
            res.json(resp);
            return next();
        })
            .catch(function (err) {
            res.status(err.code);
            res.json(err);
            return next();
        });
    };
    return Endpoint;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Endpoint;
//# sourceMappingURL=Endpoint.js.map