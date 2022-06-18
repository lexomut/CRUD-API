
import { start, server } from '../src/worker';
const request = require('supertest');

beforeEach(async () => {
    await start();
});

afterEach(() => {
    server.close();
});


test('два плюс два равно четыре', () => {
    expect(2 + 2).toBe(4);
});

it('should be no users', async () => {

    const response = await request(server).get('/api/users/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);


});
