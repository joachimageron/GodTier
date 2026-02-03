import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('logos')
export class LogoEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    imageUrl: string;

    @Column()
    createdAt: Date;
}
