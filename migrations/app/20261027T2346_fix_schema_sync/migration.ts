#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/8d39d4690b1311669651727c395a90c42ffbb545fe91d56828ba8f3ed193a274/contract';
import startContract from '../../snapshots/8d39d4690b1311669651727c395a90c42ffbb545fe91d56828ba8f3ed193a274/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a37fe4a4a65337a092424eaed556e150be880c5d0781d4d18e9e26423114fcaf/contract';
import endContract from '../../snapshots/a37fe4a4a65337a092424eaed556e150be880c5d0781d4d18e9e26423114fcaf/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  placeholder,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations():any {
    return [
      this.dropColumn({ schema: 'public', table: 'Post', column: 'author' }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Post',
        column: col('authorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-Post-authorId', {
        check: () => placeholder('backfill-Post-authorId:check'),
        run: () => placeholder('backfill-Post-authorId:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Post', column: 'authorId' }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
