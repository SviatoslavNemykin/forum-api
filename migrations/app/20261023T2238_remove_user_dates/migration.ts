#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/0a878a248e93dbbaa1152b47679cc273b31252b66fdc31f54bf5a8e1885980fd/contract';
import startContract from '../../snapshots/0a878a248e93dbbaa1152b47679cc273b31252b66fdc31f54bf5a8e1885980fd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/eb8e66f4052c533a89be1b7b82f1ed2fbd0e4f000b43c4397c01e541f9f2d339/contract';
import endContract from '../../snapshots/eb8e66f4052c533a89be1b7b82f1ed2fbd0e4f000b43c4397c01e541f9f2d339/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'User', column: 'createdAt' }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'updatedAt' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
