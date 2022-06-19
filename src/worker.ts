import 'dotenv/config';
import * as http from 'http';
import { Handler } from './handler';
import { router } from './router';


const {PORT} = process.env;
export const handler = new Handler();
export const server = http.createServer(router);

export const start = () => {
    return new Promise(resolve => {
        server.on('error', (e) => {
            console.log('ошибка сервера',e);
        });

        server.listen(PORT, () => {
            console.log(`pid ${process.pid}  server run on port`, PORT);
            resolve(null);
        });
    });
};



