import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { Template } from './modules/entities/template.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'documento',
  password: 'pass',
  database: 'documento',
  synchronize: false,
  logging: false,
  entities: [Template],
  migrations: ['src/db/migrations/**/*.ts'],
  subscribers: [],
})
