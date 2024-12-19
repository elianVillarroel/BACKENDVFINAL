import { Module } from '@nestjs/common';
import { EspacioService } from './espacio.service';
import { EspacioController } from './espacio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspacioEntity } from './espacio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EspacioEntity])],
  providers: [EspacioService],
  controllers: [EspacioController]
})
export class EspacioModule {}