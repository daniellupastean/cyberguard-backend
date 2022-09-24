import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
};
