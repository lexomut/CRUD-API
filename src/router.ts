import { parse } from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import { Database } from './database';


const handler = new Database();

export const router = async (req: IncomingMessage, res: ServerResponse) => {
    console.log('req.url',req.url)
    const reqUrl = parse(req.url || '', true).pathname;

    console.log(reqUrl);
    if (!reqUrl?.startsWith('/api/users')) {
        res.statusCode = 404;
        res.end('не правильный аддрес');
        return;
    }
    const id = reqUrl?.slice(11)
    console.log("id",id)
    switch (req.method) {
        case 'GET': {
            try {
                const {code, body} =id?await handler.get(id):await handler.getAll();
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = code;
                res.end(JSON.stringify(body));
            } catch (error) {
                console.log('ошибка',error.message, ' ', error.code)
                res.statusCode = error.code||'500';
                res.end(error.message);
            }
            break;
        }

        case 'POST': {
            try {
                const buffers = [];
                for await (const chunk of req) {
                    buffers.push(chunk);
                }
                const data = Buffer.concat(buffers).toString()
                const payload = JSON.parse(data)
                const {code, body} =await handler.add(payload);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = code;
                res.end(JSON.stringify(body));
            } catch (error) {
                console.log(error)
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
