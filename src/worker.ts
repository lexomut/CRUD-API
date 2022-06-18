import 'dotenv/config';
import * as http from 'http';
import { router } from './router';


const {PORT} = process.env;
const server = http.createServer(router);

export const start= () => {
    server.on('error', function () {
        console.log('ошибка');
        setTimeout(() => server.listen(PORT), 2000);
    });

    // process.once('SIGHUP', () => {
    //     server.close();
    // });
    server.listen(PORT,() => {
        console.log('server run on port',PORT );
    });
};

