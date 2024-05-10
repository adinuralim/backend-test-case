import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'members' })
export class Member {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({
    default: false,
  })
  isPenalized: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  penalizedDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // relations
  @OneToMany(() => Transaction, (transactions) => transactions.member)
  transactions?: Transaction[];
}
