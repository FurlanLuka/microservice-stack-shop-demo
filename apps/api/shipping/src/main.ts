import { AppModule } from './app.module';
import { startService } from '@microservice-stack/nest-application';
import { SERVICE_NAME } from '@microservice-stack-shop-demo/api/shipping/constants';
import { Logger } from '@nestjs/common';

import { generateMigration } from '@microservice-stack/nest-typeorm-migrations';

async function bootstrap(): Promise<void> {
  const shouldGenerateMigrations: boolean = process.argv.some(
    (arg) => arg === 'generate-migrations'
  );

  if (shouldGenerateMigrations) {
    await generateMigration(SERVICE_NAME, AppModule);
  } else {
    await startService(SERVICE_NAME, AppModule);
  }
}

bootstrap().catch((error) => {
  Logger.error(error);
  throw error;
});
