import { Role } from "src/auth/enum/role.enum";
import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true})
    email!: string;

    @Column({ nullable: false})
    name!: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER})
    role!: Role

    @Column({ nullable: false})
    password!: string;

    @Column({ nullable: true, type: 'varchar'})
    hashedRefreshToken!: string | null;

    @Column({ unique: true })
    phone!: string;

    @OneToMany(() => Product, product => product.user, { onDelete: 'CASCADE' })
    products!: Product[]

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
