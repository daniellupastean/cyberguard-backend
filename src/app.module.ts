import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { SitesService } from './services/sites.service';
import { SitesController } from './controllers/sites.controller';
import { Site } from './entities/site.entity';
import { Article } from './entities/article.entity';
import { ArticlesController } from './controllers/articles.controller';
import { ArticlesService } from './services/articles.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Site]),
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [AppController, SitesController, ArticlesController],
  providers: [AppService, SitesService, ArticlesService],
})
export class AppModule {}
