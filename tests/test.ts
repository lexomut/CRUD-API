import { request } from 'http';
import { doRequest } from './util';



test('два плюс два равно четыре', () => {
    expect(2 + 2).toBe(4);
});

it('should be no users', async () => {
    const response = await doRequest('/api/users','GET');

    expect(response.code).toBe(200);
    expect(response.body).toBe([]);
});
