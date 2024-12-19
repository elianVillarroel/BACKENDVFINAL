import { Column, Entity, PrimaryGeneratedColumn, Check, ManyToOne, JoinColumn } from "typeorm";
import { EspacioEntity } from '../espacio/espacio.entity';
import { UsuarioEntity } from "src/usuario/usuario.entity";
@Entity({ name: 'eventos' })
@Check("capacidad_personas > 0")
export class EventoEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false , unique :true})
    nombre: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    tipo_evento: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    descripcion: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    fecha_reserva: Date;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.id, {nullable: false})
    @JoinColumn({ name: 'id_usuario' })
    id_usuario: UsuarioEntity; 

    @ManyToOne(() => EspacioEntity, (espacio) => espacio.id, {nullable: false})
    @JoinColumn({ name: 'id_espacio' })
    id_espacio: EspacioEntity;

    @Column({ type: 'varchar', length: 100, nullable: false })
    fecha_evento: string;

    @Column({ type: 'int', nullable: false })
    capacidad_personas: number;

    @Column({ type: 'int', nullable: false })
    hora_inicio: number;

    @Column({ type: 'int', nullable: false })
    hora_fin: number;

    @Column({type: 'int', nullable:false, default:0})
    costo:number;

    @Column ({type: 'varchar', length: 100, nullable: true, default: "ninguno"})
    urlpermisos: string; 

    @Column ({type: 'varchar', length: 10, nullable: false})
    tipo_pago: string; 

    @Column ({type: 'varchar', length: 500, nullable: true})
    img_evento: string; 
    
    @Column({ type: 'varchar', length: 20, nullable: false, default: 'pendiente'})
    estado: string;   
}