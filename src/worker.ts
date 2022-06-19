import 'dotenv/config';
import * as http from 'http';
import { router } from './router';


const {PORT} = process.env;
export const server = http.createServer(router);

export const start = () => {
    return new Promise(resolve => {
        server.on('error', (e) => {
            console.log('ошибка сервера',e);
        });

        server.listen(PORT, () => {
            console.log('server run on port', PORT);
            resolve(null);
        });
    });
};



