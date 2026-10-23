#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/8d39d4690b1311669651727c395a90c42ffbb545fe91d56828ba8f3ed193a274/contract';
import startContract from '../../snapshots/8d39d4690b1311669651727c395a90c42ffbb545fe91d56828ba8f3ed193a274/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/eb8e66f4052c533a89be1b7b82f1ed2fbd0e4f000b43c4397c01e541f9f2d339/contract';
import endContract from '../../snapshots/eb8e66f4052c533a89be1b7b82f1ed2fbd0e4f000b43c4397c01e541f9f2d339/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
