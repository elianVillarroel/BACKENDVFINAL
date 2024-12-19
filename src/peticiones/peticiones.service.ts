import { Injectable, NotFoundException } from '@nestjs/common';
import { PeticionesEntity } from './peticiones.entity';
import { DataSource } from 'typeorm';
import { PeticionesDto } from './dto/peticiones.dto';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { EventoEntity } from 'src/evento/evento.entity';

@Injectable()
export class PeticionesService 
{
    private peticionRepository;
    private usuarioRepository;
    private eventoRepository;

    constructor(private dataSource: DataSource) 
    {
        this.peticionRepository = this.dataSource.getRepository(PeticionesEntity);
        this.usuarioRepository = this.dataSource.getRepository(UsuarioEntity);
        this.eventoRepository = this.dataSource.getRepository(EventoEntity);
    }

    //**************************************//
    async registrar (dto:PeticionesDto): Promise<any>
    {
        const peticion = this.peticionRepository.create(dto);
        await this.peticionRepository.save(peticion);
        return { message: `Peticion: ${peticion.nombre} enviada` };
    }

    //**************************************//
    async peticionesusuario(nomuser:string): Promise<any>
    {
        const usuario = await this.usuarioRepository.findOneBy({nombre:nomuser});
        if(!usuario)
            {
              throw new NotFoundException({message: 'Usuario no registrado'});
            }
        const peticiones = await this.peticionRepository.find( { where: { usuario : usuario } } );
        return peticiones;
    }

    //**************************************//
    async mostrarTodasLasPeticiones(): Promise<any>
    {
        const peticiones = await this.peticionRepository.find();
        return peticiones;
    }

    //**************************************//
    async verPeticionesPendientes(): Promise<any>
    {
        const peticiones = await this.peticionRepository.find( { where: { estado: 'pendiente' } } );
        return peticiones;
    }

    //**************************************//
    async cambiarEstadoPeticion(nombreEvento:string, estatus:string):Promise<any>
    {
        const evento = await this.eventoRepository.findOneBy({nombre: nombreEvento})
        const peticion = await this.peticionRepository.findOneBy({id:evento.id});
        if (!peticion) 
        {
          throw new NotFoundException({ message: 'Evento no existente' });
        }
        // Actualizar el estado
        peticion.estado = estatus;
        await this.peticionRepository.save(peticion);

        return { message: `Peticion actualizada a ${estatus}`};
    }
}
