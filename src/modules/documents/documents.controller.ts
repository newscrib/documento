import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger'

import { DocumentsService } from './documents.service'

@Controller()
export class DocumentsController {
  public constructor(private readonly _documentsService: DocumentsService) {}

  @Post('/upload/file')
  @ApiOperation({
    description: 'Upload file to S3 Minio service',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        alias: {
          type: 'string',
          description:
            'File alias, can be used only by `admin` role. Allows to get document by alias in `/api/store/:uuid`',
        },
        public: {
          type: 'boolean',
          description:
            '`isPublic` bool flad, can be used only by `admin` role. Public files will be available for all users',
        },
        directory: {
          type: 'string',
          description: 'Virtual directory to separate files with equal names',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return await this._documentsService.uploadDocTemplate(file)
  }
}
