import { CreateResourceDto } from './create-resource.dto';
import { ResourceStatus } from '../../common/enums';
declare const UpdateResourceDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateResourceDto>>;
export declare class UpdateResourceDto extends UpdateResourceDto_base {
    status?: ResourceStatus;
}
export {};
