import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findById(id: string): Promise<User>;
    findOne(id: string): Promise<User>;
    updateEmail(id: string, newEmail: string): Promise<User>;
}
