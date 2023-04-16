// This function returns the country of the user based on their IP address
// It uses the ipregistry API to get the user's IP address and then searches for the country in the countries.js file
// It returns the country information in an object
// It uses the fetch API to make the request to ipregistry
// It uses the async/await syntax to wait for the fetch API to return the response
// It uses the findIndex method to search for the country in the countries array
// It uses an arrow function to define the callback function for findIndex
// It uses destructuring to get the country code from the response
// It uses a template literal to print the country object
// It uses the return statement to return the country object
// The country object contains the country's name, its ISO code, and its phone code

import countries from "./countries.js";
const defcountry = async () => {
  let countrycode;
  await fetch("https://api.ipregistry.co/?key=tryout")
    .then((response) => response.json())
    .then((payload) => {
      countrycode = payload.location.country.code;
    });

  const index = countries.findIndex((x) => x.isoCode === countrycode);
  console.log(countries[index]);
  return countries[index];
};
export default defcountry;
