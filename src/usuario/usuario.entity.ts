import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'usuarios'})

export class UsuarioEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 20, nullable: false, unique:true})
    nombre: string;

    @Column({type: 'varchar', length: 20, nullable: false, unique:true})
    contrasena: string;

    @Column({type: 'varchar', length: 30, nullable: false, unique: true})
    email: string;

    @Column({type: 'int', nullable: false, unique:true})
    numcontacto: number;

    @Column({type: 'varchar', length: 20, nullable: false})
    tipousuario: string;

    @Column({type : 'varchar', length: 20, nullable: false, default: 'pendiente' })
    estado: string;//Rechazado, Aprobado, Pendiente
}