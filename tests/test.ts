import { changedUser, testUser } from './test-user';
import { start, server } from '../src/worker';
import { Person } from '../src/types';

const request = require('supertest');

let user: Person | undefined;

beforeEach(async () => {
    await start();
});

afterEach(() => {
    server.close();
});
describe('first scenario',() => {

    test('два плюс два равно четыре', () => {
        expect(2 + 2).toBe(4);
    });

    it('Get all records with a GET api/users request (an empty array is expected)   ', async () => {
        const response = await request(server).get('/api/users/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('A new object is created by a POST api/users request (a response containing newly created record is expected)',
        async () => {

            const response = await request(server).post('/api/users/').send(JSON.stringify(testUser));
            if (response.statusCode === 201) {
                user = response.body;
            }
            expect(response.statusCode).toBe(201);
            // expect(response.body).toEqual([]);
        });

    it('With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)'
        , async () => {
            const response = await request(server).get(`/api/users/${user?.id}`);
            expect(response.statusCode).toBe(200);
            expect((response.body).id).toEqual(user?.id);
        });

    it('We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)',
        async () => {
            const oldId=user?.id;
            const response = await request(server).put(`/api/users/${oldId}`).send(JSON.stringify(changedUser));
            if (response.statusCode === 200) {
                user = response.body;
            }
            expect(response.statusCode).toBe(200);
            expect((response.body).id).toEqual(oldId);
        });

    it('With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)',
        async () => {
            const response = await request(server).delete(`/api/users/${user?.id}`);
            expect(response.statusCode).toBe(204);
        });

    it('With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)'
        , async () => {
            const response = await request(server).get(`/api/users/${user?.id}`);
            expect(response.statusCode).toBe(404);
        });

});

