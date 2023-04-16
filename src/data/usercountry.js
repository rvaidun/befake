import countries from "./countries.js";
const defcountry = async () => {
    let countrycode
    await fetch('https://api.ipregistry.co/?key=tryout')
        .then((response) => response.json())
        .then((payload) => {
            countrycode = payload.location.country.code;
        });

    const index = countries.findIndex(x => x.isoCode === countrycode);
    console.log(countries[index]);
    return countries[index];
}
export default defcountry;