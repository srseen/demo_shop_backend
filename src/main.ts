import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // ลบ field ที่ไม่อยู่ใน DTO
      whitelist: true,
      // บล็อก field แปลก ๆ ที่ไม่ระบุใน DTO
      forbidNonWhitelisted: true,
      // แปลงชนิดให้อัตโนมัติ
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
