import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Template } from '../entities/template.entity'

import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'


@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
