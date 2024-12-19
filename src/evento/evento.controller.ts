import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Patch, Post, Put, RequestTimeoutException} from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoDto } from './dto/evento.dto';
import { DataSource } from 'typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { EspacioEntity } from 'src/espacio/espacio.entity';
import { EventoDto1 } from './dto/evento.dto1';
import { TimeoutError } from 'rxjs';
import { EventoDtoU } from './dto/evento.dtou';
import { EventoDtoF } from './dto/evento.dtof';
import { EventoEntity } from './evento.entity';

@Controller('evento')
export class EventoController 
{

   private usuariocontrol;
   private espaciocontrol;
   private eventocontrol;
   
   constructor(private readonly eventoservice: EventoService, private dataSource: DataSource)
   {
      this.usuariocontrol = this.dataSource.getRepository(UsuarioEntity);
      this.espaciocontrol = this.dataSource.getRepository(EspacioEntity);
      this.eventocontrol = this.dataSource.getRepository(EventoEntity);
   }

   //Crear Evento Presidente / Empresa
   @Post()
   async create(@Body() dto1:EventoDto1)
   {
      try
      {
         const usuario = await this.usuariocontrol.findOneBy({nombre: dto1.id_usuario});
         if (!usuario) 
         {
            throw new BadRequestException('Usuario no encontrado');
         }
         const espacio = await this.espaciocontrol.findOneBy({nombre: dto1.id_espacio});
         if (!espacio) 
         {
            throw new BadRequestException('Espacio no encontrado');
         }
         let costito = espacio.costo + dto1.capacidad_personas * 2 + (dto1.hora_fin - dto1.hora_inicio) * 10;
         switch (dto1.tipo_evento) 
         {
            case 'Medioambientales':
              costito = costito + 50;
              break;
            case 'Cultural':
               costito = costito + 60;
               break;
            case 'Comida':
               costito = costito + 80;
               break;
            case 'Politica':
               costito = costito + 100;
               break;
         }
         console.log('hasta aqui bien');
         const dto: EventoDto ={
            nombre : dto1.nombre,
            tipo_evento: dto1.tipo_evento,
            descripcion: dto1.descripcion,
            id_usuario: usuario.id,
            id_espacio: espacio.id,
            fecha_evento: dto1.fecha_evento,
            capacidad_personas: dto1.capacidad_personas,
            hora_inicio: dto1.hora_inicio,
            hora_fin: dto1.hora_fin,
            costo: costito,
            tipo_pago:dto1.tipo_pago,
            img_evento: dto1.img_evento
         }
         return await  this.eventoservice.create(dto);
      } catch (error) 
      {
         console.error('Error en el servidor:', error); // Agrega este log
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }

   //Ver eventos Usuario Normal (nombre,fecha_evento,hora_inicio,hora_fin,espacio)
   @Get('eventos-Usernormal')
   async eventosUserNoraml()
   {
      try{
         const eventosdisponibles = await this.eventoservice.EventosUsuarioNormal();
         if (eventosdisponibles.length === 0) 
         {
            return {
               message: 'No hay eventos'};
         }
         else
         {
            return {
               message: 'Eventos disponibles encontrados',
               data: eventosdisponibles};
         }
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }   
   }

   //Eventos por fecha (nombre,fecha_evento,hora_inicio,hora_fin,espacio)
   @Get('filtrar-fecha')
   async getEventosByFecha(@Body() body: {fecha:string})
   {
      try{
         const {fecha}=body;
         const eventosdisponibles = await this.eventoservice.EventosFechaUserNormal(fecha);
         if (eventosdisponibles.length === 0) {
            return {
               message: 'No hay eventos en esta fecha'
            };
         }
         else
         {
            return {
               message: 'Eventos disponibles encontrados',
               data: eventosdisponibles
            };
         } 
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }
   
   //Ver eventos propios Presidente / Empresa (completo)
   @Post('eventos-Creador')
   async eventosCreador(@Body() body: {NombreCreador:string})
   {
      try{
         const {NombreCreador} = body;
         const eventosCreador = await this.eventoservice.EventosCreador(NombreCreador);
         if (eventosCreador.length === 0) 
         {
            return {
               message: 'No hay eventos registrados'};
         }
         else
         {
            return {
               message: 'Eventos disponibles encontrados',
               data: eventosCreador};
         }
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }

   //Ver eventos pendientes completo ADMIN (completo)
   @Get ('eventos-pend')
   async eventospendiente ()
   {
      try{
         const eventos = await this.eventoservice.eventosPendiente();
         if (eventos.length === 0) 
            {
               return {
                  message: 'No hay eventos pendientes'};
            }
            else
            {
               return {
                  message: 'Eventos pendientes encontrados',
                  data: eventos};
            }
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
      
   }

   //Cambiar dueño evento
   @Patch('change-user')
   async changeUser(@Body() body: { usuarioNombre: string; eventoNombre: string }) 
   {
      try{
         const { usuarioNombre, eventoNombre } = body;
         return await this.eventoservice.changeuser(usuarioNombre, eventoNombre);
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }

   //Cambiar lugar evento
   @Patch('reubicar')
   async reubicar(@Body() body: {eventoNombre:string; espacioNombre:string})
   {
      try{
         const {eventoNombre,espacioNombre} = body;
         return await this.eventoservice.reubicar(eventoNombre,espacioNombre);
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }

   //Cambiar estado de evento
   @Patch('actualizar-estado')
   async actualizarEstado(@Body() body: {eventoNombre:string,estatus:string})
   {
      try{
         const {eventoNombre,estatus}=body;
         return await this.eventoservice.updateStatus(eventoNombre,estatus);
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }

   //Avisar tiempo max permisos
   @Get('aviso-permisos')
   async calcularDiasHastaEvento(@Body() body: {eventoNombre: string}): Promise<string> 
   {
      try{
         const {eventoNombre} = body;
         const canti = await this.eventoservice.calcularDiasHastaEvento(eventoNombre);
         return (`Quedan ${canti} dias para entregar los permisos`);
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }

   //Eliminar Evento
   @Delete('eliminar-evento')
   async eliminarevento(@Body() body: {nombreEvento: string}) 
   {
      try{
         const {nombreEvento} = body;
         return await this.eventoservice.deleteevento(nombreEvento);
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }

   //Agregar permisos
   @Put('actualizar-evento')
   async actualizarevento(@Body() dto1:EventoDtoF)
   {
      try
      {
         const evento = await this.eventocontrol.findOneBy({nombre:dto1.nombre});
         if(!evento)
         {
            throw new BadRequestException('Evento inexistente');
         }
         const dto: EventoDtoU = {
            id: evento.id,
            nombre: evento.nombre,
            tipo_evento: evento.tipo_evento,
            descripcion: dto1.descripcion,
            fecha_reserva: evento.fecha_reserva,
            id_usuario: evento.id_usuario,
            id_espacio: evento.id_espacio,
            fecha_evento: evento.fecha_evento, // Mantener la fecha_evento original
            capacidad_personas: dto1.capacidad_personas,
            hora_inicio: evento.hora_inicio,
            hora_fin: evento.hora_fin,
            costo: evento.costo,
            urlpermisos: dto1.urlpermisos,
            tipo_pago: evento.tipo_pago,
            img_evento: dto1.img_evento,
            estado: evento.estado,
          };
         return await  this.eventoservice.actualizar(dto);
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }

   @Get('id-evento')
   async buscarid(@Body() body: {id_evento:number})
   {
      try{
         const {id_evento} = body;
         return await this.eventoservice.findid(id_evento);
      } catch (error) 
      {
         if (error instanceof TimeoutError) 
         {  // Verifica si el error es por tiempo de espera
           throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
         }
          // Si es otro tipo de error, lanzamos un error interno
         throw new InternalServerErrorException('Hubo un problema. Intenta más tarde.');
      }
   }
}
