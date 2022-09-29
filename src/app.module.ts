import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { typeOrmConfig } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { SitesService } from './services/sites.service';
import { SitesController } from './controllers/sites.controller';
import { Site } from './entities/site.entity';
import { Article } from './entities/article.entity';
import { ArticlesController } from './controllers/articles.controller';
import { ArticlesService } from './services/articles.service';
import { Subscriber } from './entities/subscriber.entity';
import { SubscribersController } from './controllers/subscribers.controller';
import { SubscribersService } from './services/subscribers.service';
import { RankedSite } from './entities/rankedSite.entity';
import { RankedSitesService } from './services/rankedSites.service';
import { ParserService } from './services/parser.service';
import { EmailsService } from './services/emails.service';
import { EmailsController } from './controllers/emails.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from './mail.config';
import { RankedSitesController } from './controllers/rankedSites.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Site]),
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([Subscriber]),
    TypeOrmModule.forFeature([RankedSite]),
    MailerModule.forRoot(mailConfig),
  ],
  controllers: [
    AppController,
    SitesController,
    ArticlesController,
    SubscribersController,
    EmailsController,
    RankedSitesController,
  ],
  providers: [
    AppService,
    SitesService,
    ArticlesService,
    SubscribersService,
    RankedSitesService,
    ParserService,
    EmailsService,
  ],
})
export class AppModule {}
