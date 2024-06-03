// import { LogLevel } from "angular-auth-oidc-client";

export const environment = {
  production: false,
  staging: true,
  qa: false,
  dev: false,
  local: false,
  ADFBASEURL: 'https://uap-uat.azurewebsites.net',
  MICROCERTREDIRECT: 'https://certification.lntedutech.com/myAssessment',
  API_URL: 'https://uapcore.lntedutech.com',
  NODE_URL: 'https://uapedgeservice.lntiggnite.com',
  blobToken: "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2221-11-23T19:12:41Z&st=2021-11-23T11:12:41Z&spr=https,http&sig=R6%2BlZGrzjuFs1aAy2uUG%2BNkjVig5%2F8disv01i86VK8M%3D",
  SCHEDULE_SERVICE_URL:'https://scheduleservicedev.lntedutech.com',
  //   OIDC_CONFIG: {
  //     issuer: 'https://uap-iam.lntiggnite.com/auth/realms/uap',
  //     clientId: 'uap-ui',
  //     logging : LogLevel.Error
  //   },
  //   TOKEN_URL: 'https://uap-iam.lntiggnite.com/auth/realms/uap/protocol/openid-connect/token'
};
