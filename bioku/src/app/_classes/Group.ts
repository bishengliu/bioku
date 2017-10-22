// research group
import { User } from './User';
export class GroupInfo {
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

export class Assistant {
    user_id: number;
    user: User;
}

export class Member {
    user_id: number;
    user: User;
}

export class Group extends GroupInfo {
    // group: GroupInfo;
    members: Array<Member>;
    assistants: Array<Assistant>;
}
