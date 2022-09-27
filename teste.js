// var axios = require('axios');

// var config = {
//   method: 'get',
//   url: 'http://localhost:3000/1',
//   headers: { }
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.parse(JSON.stringify(response.data)));
// })
// .catch(function (error) {
//   console.log(error);
// });

var axios = require('axios');
var data = JSON.stringify({
  "name": "Rifa para RAS",
  "responsible": "Jade",
  "dateRun": "2022-10-15",
  "responsibleNumber": "75988718531"
});

var config = {
  method: 'post',
  url: 'http://localhost:3000/',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
