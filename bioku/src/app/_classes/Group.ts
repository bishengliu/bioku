//research group
import { User } from './User';
export interface GroupInfo{
    pk: number;
    group_name: string;
    pi: string;
    pi_fullname: string;
    photo: string;
    photo_tag: string;
    email: string;
    department: string;
    telephone: number;
}

export class Group{
    group: GroupInfo;
    members: Array<User>;
    assistants: Array<User>;
}