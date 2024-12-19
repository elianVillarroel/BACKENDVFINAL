import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'espacios' })
export class EspacioEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    nombre: string;

    @Column({ type: 'varchar', length: 200, nullable: false })
    ubicacion: string;

    @Column({ type: 'int', nullable: false})
    costo: number;

    @Column({ type: 'varchar', length: 100, nullable: false})
    urlmapa: number;
}
