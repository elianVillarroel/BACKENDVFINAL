import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('peticiones')
export class PeticionesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.id, {nullable: false})
    @JoinColumn({ name: 'id_usuario' })
    usuario: UsuarioEntity;  

    @Column({ type: 'varchar', length: 255, nullable: false })
    descripcion: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;

    @Column({ type: 'varchar', length: 50, default: 'pendiente', nullable: false }) // Valor predeterminado
    estado: string;
}