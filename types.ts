
export type Person = {
    'id': string
    'username': string
    'age': number
    'hobbies': string[]
}
export type PersonKeys = 'id' | 'username' | 'age' | 'hobbies'
export enum fields {id = 'string', username = 'string', age = 'number', hobbies = 'array'}

export type DatabaseResponse = {
    code:number
    body:string|Person|Person[]
}
