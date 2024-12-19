import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity]),
  JwtModule.register({
    secret: 'mi_secreto', // Cambia esto por una clave más segura (usa variables de entorno en producción)
    signOptions: { expiresIn: '1h' }, // Opcional: configuración del tiempo de expiración del token
  }),],
  providers: [UsuarioService],
  controllers: [UsuarioController]
})
export class UsuarioModule {}
