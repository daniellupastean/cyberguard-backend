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
import { APP_GUARD } from '@nestjs/core';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { ContactController } from './controllers/contact.controller';
import { ContactService } from './services/contact.service';
import { ContactMessage } from './entities/contact-message.entity';
import { keycloakConfig } from './keycloak.config';
import { DashboardController } from './controllers/dashboard.controller';

@Module({
  imports: [
    // KeycloakConnectModule.register(keycloakConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Site]),
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([Subscriber]),
    TypeOrmModule.forFeature([RankedSite]),
    TypeOrmModule.forFeature([ContactMessage]),
    MailerModule.forRoot(mailConfig),
  ],
  controllers: [
    AppController,
    SitesController,
    ArticlesController,
    SubscribersController,
    EmailsController,
    RankedSitesController,
    ContactController,
    DashboardController,
  ],
  providers: [
    AppService,
    SitesService,
    ArticlesService,
    SubscribersService,
    RankedSitesService,
    ParserService,
    EmailsService,
    ContactService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: ResourceGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
  ],
})
export class AppModule {}
