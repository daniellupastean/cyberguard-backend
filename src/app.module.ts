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
import { keycloakConfig } from './keycloak.config';
import { ContactController } from './controllers/contact.controller';
import { ContactService } from './services/contact.service';
import { ContactMessage } from './entities/contact-message.entity';
import { DashboardController } from './controllers/dashboard.controller';
import { TranslateService } from './services/translate.service';
import { ClassifiedDomain } from './entities/classified-domains.entity';
import { PhishingController } from './controllers/phishing.controller';
import { PhishingService } from './services/phishing.service';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfilesController } from './controllers/user-profiles.controller';
import { UserProfilesService } from './services/user-profiles.service';

@Module({
  imports: [
    // KeycloakConnectModule.register(keycloakConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Site]),
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([Subscriber]),
    TypeOrmModule.forFeature([RankedSite]),
    TypeOrmModule.forFeature([ContactMessage]),
    TypeOrmModule.forFeature([ClassifiedDomain]),
    TypeOrmModule.forFeature([UserProfile]),
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
    PhishingController,
    UserProfilesController,
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
    TranslateService,
    PhishingService,
    UserProfilesService,
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
