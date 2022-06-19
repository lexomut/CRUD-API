import cluster, { Worker } from 'cluster';
import * as os from 'os';
import { start } from './worker';

const pid = process.pid;
const workers: Worker[] = [];

if (cluster.isPrimary) {
    const cpuCount = os.cpus().length;
    console.log('cpus: ', cpuCount);
    console.log('Primary started pid:', pid);
    for (let i = 0; i < cpuCount; i++) {
        const worker = cluster.fork();
        workers.push(worker);
        worker.on('message', (data) => {
            if (data.storage) {
                messageRelay(data);
            }

        });
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
            const newWorker = cluster.fork();
            newWorker.on('message', (data) => {
                if (data.storage) {
                    messageRelay(data);
                }
            });
            workers.push(newWorker);
        });
    }

    function messageRelay(msg: any) {
        workers.forEach((worker) => {
            worker.send(msg);
        });
    };
}
if (cluster.isWorker) {
    start();
}
