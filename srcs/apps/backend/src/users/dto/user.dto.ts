export class UserDtoCreate {
    email: String;
    name: String;
}

export class UsersResponse {
    id: number;
    email: string;
    password: string;
    friends: UsersResponse[]
    blockedUser: UsersResponse[]
}