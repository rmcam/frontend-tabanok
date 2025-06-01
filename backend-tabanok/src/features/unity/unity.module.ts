import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unity } from './entities/unity.entity';
import { Module as ModuleEntity } from '../module/entities/module.entity'; // Importar la entidad Module y renombrarla para evitar conflicto con el decorador @Module
import { UnityController } from './unity.controller';
import { UnityService } from './unity.service';

@Module({
    imports: [TypeOrmModule.forFeature([Unity, ModuleEntity])], // Añadir ModuleEntity
    controllers: [UnityController],
    providers: [UnityService],
    exports: [UnityService],
})
export class UnityModule { }
