//user model of the application
export class User{
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    photo_url: string;
    telephone: number;
    roles: Array<string>;
    groups: Array<number>; //later will be different type
}