import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, RequestTimeoutException } from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CalificacionDto } from './dto/calificacion.dto';
import { CalificacionDto1 } from './dto/calificacion.dto1';

import { EventoEntity } from 'src/evento/evento.entity';
import { DataSource } from 'typeorm';
import { TimeoutError } from 'rxjs';

@Controller('calificacion')
export class CalificacionController 
{
   
   private eventoRepository;
   constructor(private readonly calificacionservice: CalificacionService,private dataSource: DataSource)
   {
      
      this.eventoRepository=this.dataSource.getRepository(EventoEntity);
   }

   @Post()
   async create(@Body() dto1:CalificacionDto1)
   {
      try{
         const evento = await this.eventoRepository.findOneBy({nombre:dto1.id_evento});
         if(!evento)
         {
            throw new BadRequestException(`El evento no existe`);
         }
         const dto: CalificacionDto=
         {
            id_evento: evento.id,
            calificacion: dto1.calificacion,
            comentario: dto1.comentario
         };
         return await  this.calificacionservice.create(dto);
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
            throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
         // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema al crear el espacio. Intenta más tarde.');
      }
   }

   @Get('todas-calificaciones')
   async todascalif()
   {
      try
      {
         return await this.calificacionservice.califs();
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
            throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
         // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema al crear el espacio. Intenta más tarde.');
      }
   }

   @Get('calificaciones-evento')
   async califsevento(@Body() body: {nomevento:string})
   {
      try
      {
         const {nomevento} = body;
         return await this.calificacionservice.califsevento(nomevento);
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
            throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
         // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema al crear el espacio. Intenta más tarde.');
      }
   }

}
