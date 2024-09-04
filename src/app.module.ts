import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'


import { DocumentsModule } from './modules/documents/documents.module'
import { Template } from './modules/entities/template.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'documento',
      password: 'pass',
      database: 'documento',
      entities: [Template],
      synchronize: true,
      autoLoadEntities: true,
    }),
    DocumentsModule
  ],
})
export class AppModule {}
