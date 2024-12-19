import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioDto } from './dto/usuario.dto';
import { DataSource, In } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuarioService 
{
  private usuarioRepository;

  constructor(private dataSource: DataSource, private readonly jwtService: JwtService)
  {
    this.usuarioRepository = this.dataSource.getRepository(UsuarioEntity);
  }

  async getusuarios(): Promise<UsuarioEntity[]>
  {
    const usuarios = await this.usuarioRepository.find();
    return usuarios
  }
  
  async findid(id: number): Promise<UsuarioEntity> 
  {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) 
    {
      throw new NotFoundException({ message: 'usuario no existente' });
    }
    return usuario;
  }

  async findnombre(nombre: string, contrasena: string): Promise<any> 
  {
    if (!nombre || !contrasena) 
    {
      throw new NotFoundException({ message: 'Nombre y contraseña son obligatorios' });
    }
    
    const usuario = await this.usuarioRepository.findOne({
      where: { nombre: nombre, contrasena: contrasena }});
    
    if (!usuario) 
    {
      throw new NotFoundException({ message: 'Usuario no existente o contraseña incorrecta' });
    }
    // Generar el token
    const token = this.jwtService.sign({ id: usuario.id, nombre: usuario.nombre });

    return { 
      message: 'Inicio de sesión exitoso',
      usuario: { id: usuario.id, nombre: usuario.nombre },
      token,
    };
  }
    
  async create(dto: UsuarioDto): Promise<any> 
  {
    const usuario = this.usuarioRepository.create(dto);
    await this.usuarioRepository.save(usuario);
    return { message: `usuario ${usuario.nombre} creado` };
  }


  async userAdmins(): Promise<any>
  {
    const usuarios = await this.usuarioRepository.find({where: {tipousuario: In(['Admin', 'SuperAdmin'])}})
    return usuarios;
  }

  async cambiarestatus( nombreUser:string,estatus:string):Promise<any>
  {
    const user = await this.usuarioRepository.findOneBy({nombre:nombreUser});
    if(!user)
    {
      throw new NotFoundException('No existe el usuario');
    }
    user.estado = estatus;
    await this.usuarioRepository.save(user);
    return { message: `Estatus del usuario cambiado` };
  }

  async cambiartipo( nombreUser:string,tipo:string):Promise<any>
  {
    const user = await this.usuarioRepository.findOneBy({nombre:nombreUser});
    if(!user)
    {
      throw new NotFoundException('No existe el usuario');
    }
    user.tipousuario = tipo;
    await this.usuarioRepository.save(user);
    return { message: `Tipo del usuario cambiado` };
  }

  async getpendientes(): Promise<UsuarioEntity[]>
  {
    const usuarios = await this.usuarioRepository.find({where:{estado:'pendiente'}});
    return usuarios;
  }
}