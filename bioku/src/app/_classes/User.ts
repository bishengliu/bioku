//user model of the application
//define user group
interface GroupIdName{
    group_id: number;
    group: string;
}
//user profile
interface Profile{
    birth_date: string;
    photo: string;
    photo_tag: string;
    telephone: number;
}
export class User{
    pk: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile: Profile;
    roles: Array<string>;
    //groups: Array<GroupIdName>; //later will be different type
}