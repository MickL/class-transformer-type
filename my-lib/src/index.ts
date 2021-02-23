import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class MySubClassDto {
    @IsString()
    name: string;
}

export class MyClassDto {
    @IsString()
    id: string;

    @Type(() => MySubClassDto)
    @ValidateNested()
    child: MySubClassDto;
}
