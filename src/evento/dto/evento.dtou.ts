export class EventoDtoU {
    id?: number;
    nombre?: string;
    tipo_evento?: string;
    descripcion?: string;
    fecha_reserva?:Date;
    id_usuario?: string; 
    id_espacio?: string;
    fecha_evento?: Date;
    capacidad_personas?: number;
    hora_inicio?: number;
    hora_fin?: number;
    costo?:number;
    urlpermisos?: string;
    tipo_pago?: string; 
    img_evento?: string;
    estado?: string;
}

