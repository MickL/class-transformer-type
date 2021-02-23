import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { MyClassDto } from '../../my-lib/dist';

const plain = {
    id: '1',
    child: {
        name: 'cat',
    },
};

const klass = plainToClass(MyClassDto, plain);

console.log(klass);
