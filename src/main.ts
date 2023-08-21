import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Chat Module')
    .setDescription(`<h4>This is Chat module ( common functionalities ) project.</h4><p>Contains features : <li>One to one realtime chat and it's related functionalities.</li></p><h4> NOTE :- Socket events need to be called using frontend or postman, using swagger it's not possible.</h4>`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
