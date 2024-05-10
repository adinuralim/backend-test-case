import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // open Api
  const config = new DocumentBuilder()
    .setTitle('Library App - API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  // End setup open Api

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {});

  await app.listen(3000);
}
bootstrap();
