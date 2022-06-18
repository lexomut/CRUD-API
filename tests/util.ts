import { request } from 'http';
import 'dotenv/config';

const {PORT} = process.env;


export function doRequest(url: string, method: string):Promise<{code:number|undefined,body:any}> {
    const options = {
        hostname: 'localhost',
        port: PORT,
        path: url,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return new Promise((resolve) => {
        console.log(options);
        const req = request(options, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                console.log('data');
                data += chunk;
            });
            resp.on('end', () => {
                console.log('end');
                resolve({code: resp.statusCode, body: JSON.parse(data)});
            });

            req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
            });

        });
    });
}
