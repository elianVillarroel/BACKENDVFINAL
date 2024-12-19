import { Injectable, NotFoundException } from '@nestjs/common';
import { EventoEntity } from './evento.entity';
import { EventoDto } from './dto/evento.dto';
import { DataSource, Not } from 'typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { EspacioEntity } from 'src/espacio/espacio.entity';
import { EventoDtoU } from './dto/evento.dtou';

@Injectable()
export class EventoService 
{

  private eventoRepository;
  private usuarioRepository;
  private espacioRepository;

  constructor(private dataSource: DataSource) 
  {
    this.eventoRepository = this.dataSource.getRepository(EventoEntity);
    this.usuarioRepository = this.dataSource.getRepository(UsuarioEntity);
    this.espacioRepository = this.dataSource.getRepository(EspacioEntity);
  }
  //**************************************//
  // Función para formatear horas al estilo HH:mm
  private formatearHora(hora: number): string 
  {
    const horas = Math.floor(hora).toString().padStart(2, '0'); // Formatea las horas
    const minutos = '00'; // Puedes ajustar si deseas incluir minutos reales
    return `${horas}:${minutos}`;
  }
  //**************************************//
  // Crear Evento
  async create(dto: EventoDto): Promise<any> 
  {
    // Verificar si ya existe un evento en el mismo espacio con la misma fecha
    const eventosMismaFecha = await this.eventoRepository.find({
      where: {fecha_evento: dto.fecha_evento,id_espacio: dto.id_espacio}});
    if(dto.hora_inicio < 6 || dto.hora_inicio > 21)
    {
      throw new NotFoundException(
        `Conflicto de horario: El evento no puede iniciar a esta hora`
      );
    }
    // Si existen eventos en la misma fecha, comprobar si las horas se superponen
    if (eventosMismaFecha.length > 0) 
    {
      const conflicto = eventosMismaFecha.some(evento => {
        return (
          (dto.hora_inicio >= evento.hora_inicio && dto.hora_inicio < evento.hora_fin) || // Comienza dentro de otro evento
          (dto.hora_fin > evento.hora_inicio && dto.hora_fin <= evento.hora_fin) || // Termina dentro de otro evento
          (dto.hora_inicio <= evento.hora_inicio && dto.hora_fin >= evento.hora_fin) // Cubre completamente otro evento
        );});
  
      if (conflicto) 
      {
        throw new NotFoundException(
          `Conflicto de horario: El evento se superpone con otro evento en el mismo espacio en la misma fecha.`
        );
      }
    }
    const evento = this.eventoRepository.create({dto});
    await this.eventoRepository.save(evento);
    return { message: `Evento: ${evento.nombre} creado`};
  }

  //**************************************//
  //EventosUsuarioNormal ()
  async EventosUsuarioNormal(): Promise<EventoEntity[]>
  {
    const eventos = await this.eventoRepository.find({relations: ['id_espacio'], order: {hora_inicio: 'ASC' }});  
    return eventos.map(evento => ({
        nombre: evento.nombre,
        tipo_evento: evento.tipo_evento,
        fecha_evento: evento.fecha_evento,
        hora_inicio: this.formatearHora(evento.hora_inicio),
        hora_fin: this.formatearHora(evento.hora_fin),
        espacio: evento.id_espacio?.nombre,
        urlmapa: evento.id_espacio?.urlmapa,
        img_evento:evento.img_evento}));
  }
  //**************************************//
  // EventosFechaUserNormal (fecha)
  async EventosFechaUserNormal(fecha: string): Promise<EventoEntity[]>
  {
    const eventos = await this.eventoRepository.find({
      where: { fecha_evento : fecha }, relations: ['id_espacio'], order: {hora_inicio: 'ASC' }}); 
    return eventos.map(evento => ({
      nombre: evento.nombre,
      fecha_evento: evento.fecha_evento,
      hora_inicio: this.formatearHora(evento.hora_inicio),
      hora_fin: this.formatearHora(evento.hora_fin),
      espacio: evento.id_espacio?.nombre}));
  }
  //**************************************//
  // EventosCreador (NombreCreador)
  async EventosCreador(NombreCreador: string): Promise<EventoEntity[]>
  {
    const usuarioCreador = await this.usuarioRepository.findOneBy({ nombre:NombreCreador });
    if(!usuarioCreador)
    {
      throw new NotFoundException({message: 'Usuario no registrado'});
    }
    const eventos = await this.eventoRepository.find({
      where: { id_usuario : usuarioCreador}, relations: ['id_espacio'], order: {hora_inicio: 'ASC' }});  
    return eventos
  }
  //**************************************//
  //eventosPendiente (nombreadmin)
  async eventosPendiente(): Promise<EventoEntity[]> 
  {
    return await this.eventoRepository.find({
      where: { estado: 'pendiente' }});
  }
  //**************************************//
  //changeuser (usuarioNombre, eventoNombre)
  async changeuser(usuarioNombre: string, eventoNombre: string): Promise<any> 
  {
    // Buscar al usuario por nombre
    const usuario = await this.dataSource.getRepository(UsuarioEntity).findOne({
    where: { nombre: usuarioNombre },});

    if (!usuario) 
    {
      throw new NotFoundException({ message: 'Usuario no encontrado' });
    }
    
    if(usuario.tipousuario != "Presidente OTB" && usuario.tipousuario != "Empresa")
    {
      throw new NotFoundException({ message: 'Usuario no se puede cambiar a este usuario' });
    }
    
    if(usuario.estado == "pendiende")
    {
      throw new NotFoundException({ message: 'Usuario no autorizado' });
    }

    // Buscar el evento por nombre
    const evento = await this.dataSource.getRepository(EventoEntity).findOne({
      where: { nombre: eventoNombre }, relations: ['id_usuario']});
    if (!evento) 
    {
      throw new NotFoundException({ message: 'Evento no encontrado' });
    }

    if(usuario.id == evento.id_usuario.id)
    {
      throw new NotFoundException({ message: 'Ya es el dueño del evento este usuario' });
    }
    // Actualizar el usuario de la reserva
    evento.id_usuario = usuario;
    await this.eventoRepository.save(evento);
    return { message: 'Usuario actualizado exitosamente en la reserva' };
  }

  //**************************************//
  //updateStatus (id_evento,status)
  async updateStatus(eventoNombre: string, estatus: string): Promise<any> 
  {
    // Validar la reserva
    const evento = await this.eventoRepository.findOne({
      where: { nombre:eventoNombre}});
    
    if (!evento) 
    {
      throw new NotFoundException({ message: 'Evento no existente' });
    }

    // Actualizar el estado
    evento.estado = estatus;
    await this.eventoRepository.save(evento);

    return { message: `Reserva actualizada a ${estatus}`};
  }
  //**************************************//
  // calcularDiasHastaEvento (nomevento)
  async calcularDiasHastaEvento(eventoNombre:string): Promise<number> 
  {
    // Convertir la fecha del evento a un objeto Date
    const evento = await this.eventoRepository.findOneBy( {nombre: eventoNombre});
    if (!evento) 
    {
      throw new NotFoundException({ message: 'evento no encontrado' });
    }
    if (evento.estado === 'confirmado') 
    {
      throw new NotFoundException({ message: 'Evento ya esta confirmado' });
    }
    if (evento.estado === 'rechazado') 
    {
      throw new NotFoundException({ message: 'Evento rechazado' });
    }
    const fechaEvento = new Date(evento.fecha_evento);
    // Restar un día a la fecha del evento
    const unDiaAntesDelEvento = new Date(fechaEvento);
    unDiaAntesDelEvento.setDate(unDiaAntesDelEvento.getDate() - 1);
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Calcular la diferencia en milisegundos y convertir a días
    const diferenciaMilisegundos = unDiaAntesDelEvento.getTime() - fechaActual.getTime();
    const diasRestantes = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    // Retornar el número de días restantes (0 si ya pasó o es hoy)
    return Math.max(0, diasRestantes);
  }
  //**************************************//
  // reubicar (eventoNombre,espacioNombre)
  async reubicar(eventoNombre:string,espacioNombre:string):Promise<any>
  {
    const evento = await this.eventoRepository.findOneBy( {nombre: eventoNombre});
    if (!evento) 
    {
      throw new NotFoundException({ message: 'evento no encontrado' });
    }
    const espacio = await this.espacioRepository.findOneBy( {nombre: espacioNombre});
    if (!espacio) 
    {
      throw new NotFoundException({ message: 'espacio no encontrado' });
    }
    evento.id_espacio = espacio;
    await this.eventoRepository.save(evento);
    return { message: 'Actualizacion exitosa'};
  }

  //**************************************//
  // deleteevento (id_evento)
  async deleteevento(nombreEvento: string):Promise<any>
  {
    const result = await this.eventoRepository.delete({ nombre: nombreEvento });
    if (result.affected === 0) {
      throw new NotFoundException({ message: 'Evento no encontrado' });
    }
    return { message: 'Evento eliminado exitosamente' };
  }

  async actualizar(eventoDto: EventoDtoU): Promise<any> 
  {
    // Buscar el evento por ID
    const evento = await this.eventoRepository.findOneBy({ id: eventoDto.id });
    if (!evento) {
        throw new NotFoundException('El evento no existe');
    }
    // Actualizar los campos que vienen en el DTO
    Object.assign(evento, eventoDto);
    // Guardar los cambios
    await this.eventoRepository.save(evento);
    return { message: 'Evento actualizado correctamente', evento };
  }

  async findid(id_evento: number): Promise<any> {
    const evento = await this.eventoRepository.findOne({
      where: { id: id_evento },
      relations: ['id_espacio'], // Relación con la tabla espacio
    });
  
    if (!evento) {
      throw new NotFoundException('El evento no existe');
    }
  
    // Retornar toda la información del evento y solo el nombre del espacio
    const resultado = {
      ...evento,
      id_espacio: evento.id_espacio ? { nombre: evento.id_espacio.nombre } : null,
    };
  
    return resultado;
  }
}
