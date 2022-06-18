import { parse } from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import { Hendler } from './hendler';


const handler = new Hendler();

export const router = async (req: IncomingMessage, res: ServerResponse) => {
    const reqUrl = parse(req.url || '', true).pathname;

    if (!reqUrl?.startsWith('/api/users')) {
        res.statusCode = 404;
        res.end(' non-existing endpoints');
        return;
    }
    const id = reqUrl?.slice(11);
    switch (req.method) {
        case 'GET': {
            try {
                const {code, body} =id?await handler.get(id):await handler.getAll();
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = code;
                res.end(JSON.stringify(body));
            } catch (error) {
                // console.log('ошибка',error.message, ' ', error.code);
                res.statusCode = error.code||'500';
                res.end(error.message);
            }
            break;
        }

        case 'POST': {
            try {
                if(id) {
                    res.statusCode = 404;
                    res.end(' non-existing endpoints');
                    return;
                }
                const buffers = [];
                for await (const chunk of req) {
                    buffers.push(chunk);
                }
                const data = Buffer.concat(buffers).toString();
                const payload = JSON.parse(data);
                const {code, body} =await handler.add(payload);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = code;
                res.end(JSON.stringify(body));
            } catch (error) {
                // console.log(error);
                res.statusCode = error.code||'500';
                res.end(error.message);
            }
            break;
        }

        case 'PUT': {
            try {
                const buffers = [];
                for await (const chunk of req) {
                    buffers.push(chunk);
                }
                const data = Buffer.concat(buffers).toString();
                const payload = JSON.parse(data);
                const {code, body} =await handler.update(id,payload);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = code;
                console.log(JSON.stringify(body));
                res.end(JSON.stringify(body));
            } catch (error) {
                // console.log(error);
                res.statusCode = error.code||'500';
                res.end(error.message);
            }
            break;
        }
        case 'DELETE': {
            try {
                const {code, body} =await handler.del(id);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = code;
                res.end(JSON.stringify(body));
            } catch (error) {
                // console.log(error);
                res.statusCode = error.code||'500';
                res.end(error.message);
            }
            break;
        }

        default: {
            res.statusCode = 404;
            res.end('default');
        }
    }
};
