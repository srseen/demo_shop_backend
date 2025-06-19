import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresqlModule } from './database/postgresql.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [PostgresqlModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
