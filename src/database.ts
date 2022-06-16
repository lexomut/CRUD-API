import { v4 as uuidv4 } from 'uuid';
import { DatabaseResponse, Person, PersonKeys } from '../types';
import { fields } from '../types';
import { storage } from './storage';

class DatabaseError extends Error {
    code: number;
    constructor (obj:{code:number,body:string}){
       super(obj.body)
        this.code = obj.code
    }
}



export class Database {
    data: Person[];

    constructor() {
        this.data = storage;
    }

    add(data: any):Promise<DatabaseResponse>  {
        const id = uuidv4();
        const person: Person = {...data, id};
        const errors = this._validate(person);
        if (errors.length) {
            return Promise.reject(new DatabaseError({code:400, body:errors.toString()}));
        }
        this.data.push(person);
        return Promise.resolve({code:201, body:person});
    }

    del(uuid:string):Promise<DatabaseResponse>  {
        if (!uuid || !this.checkIfValidUUID(uuid)) {
            return Promise.reject(new DatabaseError({code:400,body: 'Not valid ID'}));
        }
        const userIndex = this.data.findIndex(user => user.id === uuid);
        if (userIndex<0) {
            return Promise.reject(new DatabaseError({code:404, body: `user Id ${uuid} doesn't exist `}));
        }
        this.data.splice(userIndex,1);
        return Promise.resolve({code:204,body:this.data[userIndex]||''});
        

    }

    getAll():Promise<DatabaseResponse> {
        return Promise.resolve({code:200,body:this.data});
    }

    get(uuid: string):Promise<DatabaseResponse> {
        if (!uuid || !this.checkIfValidUUID(uuid)) {
            return Promise.reject(new DatabaseError({code:400,  body:'Not valid ID'}));
        }
        const user = this.data.find(user => user.id === uuid);
        if (user) {
            return Promise.resolve({code:200,body:user});
        }
        return Promise.reject(new DatabaseError({code:404, body:'user not found'}));
    }

    update(uuid: string, payload: any):Promise<DatabaseResponse>  {
        if (!uuid || !this.checkIfValidUUID(uuid)) {
            return Promise.reject(new DatabaseError({code:400,body:'Not valid ID'}));
        }

        const person: Person = {id: uuid, username: payload.username, age: payload.age, hobbies: payload.hobbies};
        const errors = this._validate(person);
        if (errors.length) {
            return Promise.reject(new DatabaseError({code:400,body:errors.toString()}));
        }
        const userIndex = this.data.findIndex(user => user.id === uuid);
        if (userIndex<0) {
            return Promise.reject(new DatabaseError({code:404, body: `user Id ${uuid} doesn't exist `}));
        }
        this.data[userIndex]=person;
        return Promise.resolve({code:200,body:person});



    }


    private _validate(person: Person) {
        const errors: string[] = [];
        Object.entries(fields).forEach(([first, value]) => {
            const key = first as PersonKeys;
            if (!person[key]) {
                errors.push(`field ${key} is empty`);
                return;
            }
            if (typeof person[key] !== value) {
                errors.push(`field ${key} is has type ${typeof person[key]} mast be ${value}`);
            }
            if (person.hobbies?.length && person.hobbies.find(item => typeof item !== 'string')) {
                errors.push('array hobbies includes not a string');
            }
        });
        return errors;

    }

    checkIfValidUUID(str: string) {
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        return regexExp.test(str);
    }

}
