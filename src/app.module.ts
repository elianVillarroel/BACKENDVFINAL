import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config/constants';
import { UsuarioModule } from './usuario/usuario.module';
import { UsuarioEntity } from './usuario/usuario.entity';
import { EspacioEntity } from './espacio/espacio.entity';
import { EventoEntity } from './evento/evento.entity';
import { CalificacionEntity } from './calificacion/calificacion.entity';
import { EspacioModule } from './espacio/espacio.module';
import { EventoModule } from './evento/evento.module';
import { CalificacionModule } from './calificacion/calificacion.module';
import { PeticionesModule } from './peticiones/peticiones.module';
import { PeticionesEntity } from './peticiones/peticiones.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        driver: require('mysql2'),
        host: configService.get(DB_HOST),
        port: +configService.get(DB_PORT),
        username: configService.get(DB_USER),
        password: configService.get(DB_PASSWORD),
        database: configService.get(DB_DATABASE),
        entities: [
          UsuarioEntity,
          EspacioEntity,
          EventoEntity,
          CalificacionEntity,
          PeticionesEntity
        ],
        synchronize: false,
        logging: true
      }),
      inject: [ConfigService],
    }),
    UsuarioModule, EspacioModule,EventoModule,CalificacionModule,PeticionesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
