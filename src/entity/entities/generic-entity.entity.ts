import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'genericentity' })
export class GenericEntity {
  @PrimaryGeneratedColumn({ name: 'entity_id' })
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', width: 3 })
  score: number;
}
