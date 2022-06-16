import 'dotenv/config';
import * as http from 'http'
import { router } from './router';


const {PORT} = process.env;
const server = http.createServer(router);


server.on('error', function () {
    console.log('ошибка')
    setTimeout(()=>server.listen(PORT),2000)
});
server.listen(PORT);



console.log('1234567  ', PORT);
