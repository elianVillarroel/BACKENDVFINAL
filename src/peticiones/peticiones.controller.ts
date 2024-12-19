import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Patch, Post, RequestTimeoutException } from '@nestjs/common';
import { PeticionesService } from './peticiones.service';
import { PeticionesDto } from './dto/peticiones.dto';
import { TimeoutError } from 'rxjs';
import { PeticionesDto1 } from './dto/peticiones.dto1';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { DataSource } from 'typeorm';

function manejoErrorDeCargaDBNube(error: any, mensaje: string){
    if (error instanceof TimeoutError) {
        throw new RequestTimeoutException('La conexión con la base de datos está tardando demasiado. Intenta más tarde.');
    }
        throw new InternalServerErrorException(mensaje);
}
@Controller('peticiones')
export class PeticionesController 
{
    private usercontrol;
    constructor(private readonly peticionesService: PeticionesService, private dataSource: DataSource) 
    {
        this.usercontrol = this.dataSource.getRepository(UsuarioEntity);
    }

    //Registrar Peticion
    @Post()
    async registrarPeticion(@Body() dto1:PeticionesDto1)
    {
        try 
        {
            const usuario = await this.usercontrol.findOneBy({nombre:dto1.id_usuario})
            if (!usuario) 
            {
                throw new BadRequestException('Usuario no encontrado');
            }
            const dto: PeticionesDto=
            {
                descripcion : dto1.descripcion,
                id_usuario: usuario.id
            }
            
            return await this.peticionesService.registrar(dto);
        } catch (error) 
        {
           manejoErrorDeCargaDBNube(error, 'Hubo un error al registrar la petición. Intente más tarde');
        }
    }

    //
    @Get('peticiones-Susuario')
    async PeticionesUsuario(@Body() body:{nomuser:string})
    {
        try
        {
            const {nomuser} = body;
            return await this.peticionesService.peticionesusuario(nomuser);
        }catch(error)
        {
            manejoErrorDeCargaDBNube(error,'Hubo un problema al mostrar todas las peticiones de usuario. Intenta más tarde.');
        }
    }

    @Get('peticiones-todas')
    async mostrarTodasLasPeticiones()
    {
        try
        {
            return await this.peticionesService.mostrarTodasLasPeticiones();
        }catch(error)
        {
            manejoErrorDeCargaDBNube(error,'Hubo un problema al mostrar todas las peticiones. Intenta más tarde.')
        }
    }
    @Get('peticiones-pendientes')
    async verPeticionesPendientes()
    {
        try
        {
            return await this.peticionesService.verPeticionesPendientes();
        }catch(error)
        {
            manejoErrorDeCargaDBNube(error,'Hubo un problema al mostrar todas las peticiones pendientes. Intenta más tarde.');
        } 
    }
  
    @Patch('cambiar-estado')
    async cambiarEstadoPeticion(@Body () body :{nombreEvento:string,estatus:string})
    {
        try
        {
            const {nombreEvento,estatus} = body;
            return await this.peticionesService.cambiarEstadoPeticion(nombreEvento, estatus);
        }catch(error)
        {
           manejoErrorDeCargaDBNube(error,'Hubo un problema al cambiar el estado de la petición. Intenta más tarde.');
        }
    }
}
