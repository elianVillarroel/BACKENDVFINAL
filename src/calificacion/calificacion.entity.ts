import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { EventoEntity } from '../evento/evento.entity';

@Entity({ name: 'calificaciones' })
export class CalificacionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => EventoEntity, (evento) => evento.id, {nullable: false})
    @JoinColumn({ name: 'id_evento' })
    id_evento: EventoEntity;  

    @Column({ type: 'int', nullable: false })
    calificacion: number; 

    @Column({ type: 'varchar', nullable: false })
    comentario: string;
}