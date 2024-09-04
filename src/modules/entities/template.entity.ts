import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Template {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public name: string

  @Column()
  public url: string

  @Column({ type: 'text' })
  public variables: string
}
