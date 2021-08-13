import axios from "axios";

const options = {
  method: "GET",
  url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
  params: { limit: "10" },
  headers: {
    "x-rapidapi-key": "bceed802e9msh2560a342ad927a0p12a4efjsn3afb62f2a9ed",
    "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
  },
};

let cities = [];

axios
  .request(options)
  .then(function (response) {
    cities = [...response.data.data];
    console.log(cities, " <= res");
  })
  .catch(function (error) {
    console.error(error);
  });
