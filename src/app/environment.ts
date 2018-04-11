export const environment = {  
  BASE_ONECLICK_URL: 'https://occ-lynx-dev.herokuapp.com/api/v2/',
  AWS_LOCALE_BUCKET: 'https://s3.us-east-1.amazonaws.com/occ-lynx-prod/i18n/',
  AWS_IMAGE_ASSET_BUCKET: 'https://s3.us-east-1.amazonaws.com/occ-lynx-prod/assets/img/',
  DEFAULT_LOCATION: {
    lat: 28.538336, 
    lng: -81.379234
  },
  AVAILABLE_LOCALES: [ 'en', 'es', 'pt', 'vi', 'ht'],
  DEFAULT_LOCALE: 'en'
};
