import { UserType, Gender } from '../../common/enums';
export declare class RegisterDto {
    email: string;
    password: string;
    user_type: UserType;
    gender: Gender;
    full_name: string;
    profile_data?: any;
    parent_id?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
