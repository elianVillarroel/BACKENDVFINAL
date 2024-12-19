import { Injectable, NotFoundException } from '@nestjs/common';
import { EspacioEntity } from './espacio.entity';
import { EspacioDto } from './dto/espacio.dto';
import { DataSource } from 'typeorm';
import { EventoEntity } from 'src/evento/evento.entity';

@Injectable()
export class EspacioService {

  private espacioRepository;
  private eventoRepository;

  constructor(private dataSource: DataSource) 
  {
    this.espacioRepository = this.dataSource.getRepository(EspacioEntity);
    this.eventoRepository = this.dataSource.getRepository(EventoEntity);
  }
  //**************************************//
  private formatHora(hora: number): string 
  {
    return `${hora.toString().padStart(2, '0')}:00`;
  }

  //**************************************//
  //Registrar espacio
  async create(dto: EspacioDto): Promise<any> 
  {
    const espacio = this.espacioRepository.create(dto);
    await this.espacioRepository.save(espacio);
    return { message: `Espacio ${espacio.nombre} creado exitosamente` };
  }

  //**************************************//
  //Obtener todos los espacios
  async getespacios(): Promise<any[]>
  {
    const espacios = await this.espacioRepository.find();
    return espacios;
  }

  //**************************************//
  //Espacios libres segun una fecha
  async findAvailableSpaces(fecha: string): Promise<any[]> 
  {
    // EVENTOS EN FECHA
    const eventos = await this.eventoRepository.find({
      where: { fecha_evento:fecha },
      relations: ['id_espacio'],
      order: {hora_inicio: 'ASC' }});
    // ESPACIOS
    const espacios = await this.espacioRepository.find();
    const espaciosDisponibles = [];
    // ESPACIOS CON EVENTOS
    const espaciosSet = new Set<EspacioEntity>();
    eventos.forEach(evento => {
    espaciosSet.add(evento.id_espacio)});
    const espacioseventos = Array.from(espaciosSet);
    // ESPACIOS LIBRES
    const espaciosLibres = espacios.filter(espacio => 
    !espacioseventos.some(espacioseventos => espacioseventos.id === espacio.id));
    espaciosLibres.forEach((espacio) => {
      espaciosDisponibles.push({
      espacio,
      disponibilidad: ['06:00 - 21:00']})});
    espacioseventos.forEach((espacio) => {
    const eventosEspacio = eventos.filter((evento) => evento.id_espacio.id === espacio.id);  
    const disponibilidad = [];
    let lastEndTime = 6; // Inicio del horario (6:00 AM)
    eventosEspacio.forEach((evento) => {
      if (lastEndTime < evento.hora_inicio) 
      {
        const inicio = this.formatHora(lastEndTime);
        const fin = this.formatHora(evento.hora_inicio);
        disponibilidad.push(`${inicio} - ${fin}`);
      }
    lastEndTime = evento.hora_fin});
    // Agregar disponibilidad después del último evento hasta las 21:00
    if (lastEndTime < 21)
    {
      disponibilidad.push(`${this.formatHora(lastEndTime)} - 21:00`);
    }  
    espaciosDisponibles.push({espacio,disponibilidad})});
    return espaciosDisponibles;
  }


}