// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //api:'https://cardnmore.ignatiuz.com/videorecorder/'
  //api:'http://localhost:8080/'
  //api:'http://71.185.249.62:8080/'
  api:'https://sara.webtalkx.com/api/',
  //domainApi:'https://platform.webtalkx.com/api/',
  domainApi:'https://stage.webtalkx.com/api/',
  domainStageApi: 'https://stage.webtalkx.com/api/',
  videoapi:'https://sara.webtalkx.com/',
  //domainCopyUrl : 'https://stage.webtalkx.com',
  domainCopyUrl : 'http://localhost:4200/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
