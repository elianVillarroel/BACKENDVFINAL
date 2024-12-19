import { Module } from '@nestjs/common';
import { PeticionesService } from './peticiones.service';
import { PeticionesController } from './peticiones.controller';

@Module({
  providers: [PeticionesService],
  controllers: [PeticionesController]
})
export class PeticionesModule {}
