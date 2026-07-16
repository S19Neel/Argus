import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
