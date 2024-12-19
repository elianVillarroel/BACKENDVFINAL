import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoEntity } from './evento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventoEntity])],
  providers: [EventoService],
  controllers: [EventoController]
})
export class EventoModule {}