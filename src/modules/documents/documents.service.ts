import { writeFile } from 'fs/promises'
import * as path from 'path'

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DOMParser } from '@xmldom/xmldom'
import admZip from 'adm-zip'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { inBracketsRegExp } from '../constants/regExp'
import { Template } from '../entities/template.entity'

@Injectable()
export class DocumentsService {
  public constructor(@InjectRepository(Template) private _templateRepository: Repository<Template>) {}

  public async uploadDocTemplate(file: Express.Multer.File): Promise<string> {
    const variables = await this._extractVariablesFromDoc(file)

    const filePath = await this._uploadFile(file.buffer)

    const template = this._templateRepository.create({
      name: file.originalname,
      url: filePath,
      variables: variables.toString(),
    })

    await this._templateRepository.save(template)

    return filePath
  }

  private async _extractVariablesFromDoc(doc: Express.Multer.File): Promise<string[]> {
    // Парсим XML
    const parser = new DOMParser()
    const zip = new admZip(doc.buffer)
    const zipEntries = zip.getEntries()

    // Предполагаем, что внутри архива есть файл document.xml, содержащий текст документа
    const documentXmlEntry = zipEntries.find((entry) => entry.entryName === 'word/document.xml')

    if (!documentXmlEntry) {
      throw new Error('Document.xml not found in the zip archive')
    }

    const documentXml = zip.readAsText(documentXmlEntry)
    const xmlDoc = parser.parseFromString(documentXml, 'application/xml')

    // Ищем все текстовые узлы в документе
    const textNodesLiveList = xmlDoc.getElementsByTagName('w:t')

    const textNodes = Array.from(textNodesLiveList)
    const variables: string[] = []

    // Проходим по каждому текстовому узлу
    for (const node of textNodes) {
      const textContent = node.textContent

      if (!textContent) {
        return variables
      }

      // Ищем переменные в формате {variable}
      const matches = textContent.match(inBracketsRegExp)

      if (matches) {
        // Извлекаем и сохраняем значения переменных
        matches.forEach((match) => {
          const variableName = match.slice(1, -1) // Убираем фигурные скобки
          variables.push(variableName)
        })
      }
    }

    return variables
  }

  private async _uploadFile(file: Buffer): Promise<string> {
    const fileName = uuidv4() + '.docx'
    const diskStorageFilePath = path.join(process.cwd(), '/uploads/templates', fileName)

    await writeFile(diskStorageFilePath, file)

    return diskStorageFilePath
  }
}
