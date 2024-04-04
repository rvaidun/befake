import hmacSHA256 from 'crypto-js/hmac-sha256';
import encBase64 from 'crypto-js/enc-base64';

const key = "$ecretKey123456";
const device_id = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const timezone = "America/Los_Angeles";
const unixts = "1707480228";

const data = device_id + timezone + unixts;
const base64_string = Buffer.from(data).toString('base64');

const signature = hmacSHA256(base64_string, key).toString(encBase64);

const s2 = "1:" + unixts + ":" + signature;
const s3 = Buffer.from(s2).toString('base64');

console.log("bereal-timezone:", timezone);
console.log("bereal-device-id:", device_id);
console.log("bereal-signature:", s3);