import { UsersService } from './users.service';
import { MailService } from '../mail/mail.service';
import { UpdateEmailDto, DirectEmailDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly mailService;
    constructor(usersService: UsersService, mailService: MailService);
    updateEmail(req: any, dto: UpdateEmailDto): Promise<import("./entities/user.entity").User>;
    sendDirectEmail(dto: DirectEmailDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
