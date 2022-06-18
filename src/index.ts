import cluster from 'cluster';
import * as os from 'os';
import { start } from './worker';

const pid = process.pid;

if (cluster.isPrimary) {
    const cpuCount = os.cpus().length;
    console.log('cpus: ', cpuCount);
    console.log('Primary started pid:', pid);
    for (let i = 0; i < cpuCount; i++) {
        const worker = cluster.fork();
        worker.on('exit', () => console.log(`worker pid ${pid} is exit`));
    }
}
if (cluster.isWorker) {
    start();
}
