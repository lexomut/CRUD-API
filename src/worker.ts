import 'dotenv/config';
import * as http from 'http';
import { router } from './router';


const {PORT} = process.env;
export const server = http.createServer(router);

export const start = () => {
    return new Promise(resolve => {
        server.on('error', (e) => {
            console.log('ошибка',e);
            // setTimeout(() => server.listen(PORT), 2000);
        });

        server.listen(PORT, () => {
            console.log('server run on port', PORT);
            resolve(null);
        });
    });
};



