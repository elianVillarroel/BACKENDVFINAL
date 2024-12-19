import { Module } from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CalificacionController } from './calificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionEntity } from './calificacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalificacionEntity])],
  providers: [CalificacionService],
  controllers: [CalificacionController]
})
export class CalificacionModule {}