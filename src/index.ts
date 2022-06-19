import cluster, { Worker } from 'cluster';
import * as os from 'os';
import { start } from './worker';

const pid = process.pid;
const workers:Worker[] = [];

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
        worker.on('exit', () => console.log(`worker pid ${pid} is exit`));
    }
    function messageRelay (msg:any) {
        workers.forEach((worker) => {
            worker.send(msg);
        });
    };
}
if (cluster.isWorker) {
    start();
}
