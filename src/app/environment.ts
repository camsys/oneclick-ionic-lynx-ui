export const environment = {
  // BASE_ONECLICK_URL: 'http://occ-lynx-dev.herokuapp.com/api/v2/',
  BASE_ONECLICK_URL: 'http://localhost:3000/api/v2/',
  AWS_LOCALE_BUCKET: 'https://s3.us-east-2.amazonaws.com/occ-lynx-dev/i18n/',
  AWS_IMAGE_ASSET_BUCKET: 'https://s3.us-east-2.amazonaws.com/occ-lynx-dev/assets/img/',
  DEFAULT_LOCATION: {
    lat: 28.538336,
    lng: -81.379234
  },
  AVAILABLE_LOCALES: [ 'en', 'es', 'keys' ],
  DEFAULT_LOCALE: 'en',
  GUEST_USER_EMAIL_DOMAIN: 'example.com'
};
