// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// import { LogLevel } from 'angular-auth-oidc-client';

export const environment = {
  appVersion: require('../../package.json').version + '-dev',
  production: false,
  staging: false,
  qa: false,
  dev: false,
  local: true,
  encryptionKey: 'unifiedReports',
  secretKey: '(!@#Passcode!@#)',
  ADFBASEURL: 'https://uap-uat.azurewebsites.net',
  MICROCERTREDIRECT: 'https://certification.lntiggnite.com/myAssessment',
  API_URL: 'https://uapdev-api.lntiggnite.com',
  NODE_URL: 'https://uapqaedgeservice.lntedutech.com',
  SCHEDULE_SERVICE_URL:'https://uapscheduleqa.lntedutech.com',
  UNIFIED_REPORT: 'https://unifiedreport-dev.lntedutech.com/auth/reports/viewreport/',
  blobToken: "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2221-11-23T19:12:41Z&st=2021-11-23T11:12:41Z&spr=https,http&sig=R6%2BlZGrzjuFs1aAy2uUG%2BNkjVig5%2F8disv01i86VK8M%3D",
  // VideoAssementToken: 'https://uapcoreservice.lntedutech.com'
  //   OIDC_CONFIG: {
  //     issuer: 'https://uap-iam.lntiggnite.com/auth/realms/uap',
  //     clientId: 'uap-ui',
  //     logging: LogLevel.Error
  //   },
  //   TOKEN_URL: 'https://uap-iam.lntiggnite.com/auth/realms/uap/protocol/openid-connect/token'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
