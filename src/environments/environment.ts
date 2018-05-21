// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    apiEndpoint:'https://cipla.cdn.prismic.io/api/v2',
    firebase: {
        apiKey: "AIzaSyBn00EUtVLrGnva6Ti-5KchYxA01clFb9E",
        authDomain: "cipla-a6eb7.firebaseapp.com",
        databaseURL: "https://cipla-a6eb7.firebaseio.com",
        projectId: "cipla-a6eb7",
        storageBucket: "cipla-a6eb7.appspot.com",
        messagingSenderId: "882644981464"
    }
};
