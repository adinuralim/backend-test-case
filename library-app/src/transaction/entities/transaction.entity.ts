import { Member } from 'src/member/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TransactionStatusEnum {
  BORROW = 1,
  RETURN = 2,
}

@Entity({ name: 'transactions' })
@Index(['memberCode', 'bookCode'])
@Index(['memberCode', 'bookCode', 'status'])
@Index(['memberCode', 'status'])
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberCode: string;

  @Column()
  bookCode: string;

  @Column({
    default: 1,
  })
  qty: number;

  @Column({
    default: TransactionStatusEnum.BORROW,
  })
  status: TransactionStatusEnum;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  transactionDate: Date;

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

  // relations
  @ManyToOne(() => Member, (member) => member.transactions)
  @JoinColumn({ name: 'memberCode' })
  member?: Member;
}
