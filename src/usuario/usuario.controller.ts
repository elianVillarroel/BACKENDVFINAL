import { Body, Controller, Post, Patch, Get, RequestTimeoutException, InternalServerErrorException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './dto/usuario.dto';
import { TimeoutError } from 'rxjs';

@Controller('usuario')
export class UsuarioController {

   constructor(private readonly usuarioservice: UsuarioService){}


   @Get()
   async getusuarios()
   {
      try{
         return await this.usuarioservice.getusuarios();
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
    
   @Post()
   async create(@Body() dto:UsuarioDto){
      try{
         return await  this.usuarioservice.create(dto);
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
   @Get('usuarioid')
   async findid(@Body() body: {id:number})
   {
      try{
         const {id} = body;
         return await this.usuarioservice.findid(id);
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

   @Post('login')
   async findnombre(@Body() body: { nombre: string, contrasena: string}) 
   {
      try{
         const { nombre, contrasena } = body;
         return await this.usuarioservice.findnombre(nombre, contrasena);
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

   @Get('usuarios-admins')
   async useradmins()
   {
      try{
         return await this.usuarioservice.userAdmins();
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

   @Get('usuarios-pendiente')
   async userpend()
   {
      try{
         return await this.usuarioservice.getpendientes();
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

   @Patch('cambiar-estatus')
   async cambiarestatus(@Body() body:{nombreUser:string,estatus:string})
   {
      try{
         const {nombreUser,estatus} = body;
         return await this.usuarioservice.cambiarestatus(nombreUser,estatus);
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

   @Patch('cambiar-tipo')
   async cambiartipo(@Body() body:{nombreUser:string,tipo:string})
   {
      try{
         const {nombreUser,tipo} = body;
         return await this.usuarioservice.cambiartipo(nombreUser,tipo);
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
