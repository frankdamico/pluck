const axios = require('axios');

const ipLookUp = () => {
  // search for videos based on the query
  return axios({
    method: 'get',
    url: 'http://ip-api.com/json',
  }).then((response) => {
    console.log('here', response.data);
    const userLoc = [response.data.lon, response.data.lat];
    return userLoc;
  }).catch((err) => {
    console.log(err);
  });
};
ipLookUp();

// const getUserLoc = () => {
//   ipLookUp();
// };

// const getAddress = (latitude, longitude) => {

//   return axios({
//     method: 'get',
//     url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude}, ${longitude}&key=${GOOGLE_MAP_KEY}`,
//   }).then((response) => {
//     console.log('User\'s Address Data is ', response)
//   }).catch((err) => {
//     console.log('Request failed.  Returned status of', err);
//   });
// };

// if ('geolocation' in navigator) {
//   // check if geolocation is supported/enabled on current browser

//   navigator.geolocation.getCurrentPosition((position) => {
//     console.log(position.coords.latitude, position.coords.longitude);
//     getAddress(position.coords.latitude,
//       position.coords.longitude);
//   }, (error) => {
//     console.error('An error has occured while retrieving location', error);
//     ipLookUp();
//   });

// } else {
//   // geolocation is not supported
//   // get your location some other way
//   console.log('geolocation is not enabled on this browser');
//   ipLookUp();
// }
// module.exports.getUserLoc = getUserLoc;
