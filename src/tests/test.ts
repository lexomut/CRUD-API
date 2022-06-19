
import { start, server } from '../worker';
import { Person } from '../types';
import { changedUser, testUser } from './user';

const request = require('supertest');

let user: Person | undefined;

beforeAll(async () => {
    await start();
});

afterAll(() => {
    server.close();
});

describe('first scenario\n',() => {
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

describe('\n\nsecond scenario : error handling check\n',() => {
    it('Requests to non-existing endpoints (e.g. some-non/existing/resource) should be handled (server should answer with status code 404 and corresponding human-friendly message)', async () => {
        const response = await request(server).get('/some-non/existing/resource');
        expect(response.statusCode).toBe(404);
    });

    it('Errors on the server side that occur during the processing of a request should be handled and processed correctly (server should answer with status code 500)', async () => {
        const response = await request(server).post('/api/users/').send('35465676879');
        expect(response.statusCode).toBe(500);
    });

    it('Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
        const response = await request(server).get('/api/users/rthyjuikiedrgyji5656767');
        expect(response.statusCode).toBe(400);
    });

    it('Errors on the server side that occur during the processing of a request should be handled and processed correctly (server should answer with status code 500)', async () => {
        const response = await request(server).post('/api/users/').send(JSON.stringify({
            username:'Alexey',
            hobbies:['travel']
        }));
        expect(response.statusCode).toBe(400);
    });

});

describe('\n\nThird scenario \n',() => {

    it('A new object is created by a POST api/users request (a response containing newly created record is expected)',
        async () => {

            const response = await request(server).post('/api/users/').send(JSON.stringify(testUser));
            if (response.statusCode === 201) {
                user = response.body;
            }
            expect(response.statusCode).toBe(201);
        });

    it('Get all records with a GET api/users request  (expect 1 user) ', async () => {
        const response = await request(server).get('/api/users/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([user]);
    });

    it('With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)',
        async () => {
            const response = await request(server).delete(`/api/users/${user?.id}`);
            expect(response.statusCode).toBe(204);
        });

    it('We try to update the created record with a PUT api/users/{userId}request (a response is expected status 404)',
        async () => {
            const response = await request(server).put(`/api/users/${user?.id}`).send(JSON.stringify(changedUser));
            expect(response.statusCode).toBe(404);
        });
    it('Get all records with a GET api/users request (an empty array is expected)   ', async () => {
        const response = await request(server).get('/api/users/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });



});

