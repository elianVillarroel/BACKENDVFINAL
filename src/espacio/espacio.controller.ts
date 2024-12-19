import { Body, Controller, Get, InternalServerErrorException, Patch, Post, RequestTimeoutException } from '@nestjs/common';
import { EspacioDto } from './dto/espacio.dto';
import { EspacioService } from './espacio.service';
import { TimeoutError } from 'rxjs';

@Controller('espacio')
export class EspacioController 
{

  constructor(private readonly espacioService: EspacioService) {}

  //Crear Espacio
  @Post()
  async create(@Body() dto: EspacioDto) 
  {
    try 
    {
      // Intentamos crear el espacio. Si la operación de la base de datos tarda demasiado, se lanzará un error.
      return await this.espacioService.create(dto);
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
  
  //Todos los espacios
  @Get()
  async getespacios()
  {
    try 
    {
      return this.espacioService.getespacios();
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

  //Mostrar Espacios Disponibles
  @Get('disponibles')
  async getAvailableSpaces(@Body() body: {fecha:string}) 
  {
    const {fecha}=body;
    try 
    {
      const espaciosDisponibles = await this.espacioService.findAvailableSpaces(fecha);
      return {
        message: 'Espacios disponibles encontrados',
        data: espaciosDisponibles,
      };
    } catch (error) 
    {
      if (error instanceof TimeoutError) 
      {  // Verifica si el error es por tiempo de espera
        throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
      }
      return {
        message: 'Ocurrió un error al buscar los espacios disponibles',
        error: error.message,};
    }
  }
}
