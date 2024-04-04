import hmacSHA256 from 'crypto-js/hmac-sha256';
import { Buffer } from "buffer";
import { getHeaders } from './happyheaders';
export function generateSignature() {
    // make a new signature
    const device_id = import.meta.env.VITE_BEREAL_DEVICE_ID;
    const tz = "America/Los_Angeles";
    const key = import.meta.env.VITE_BEREAL_SECRET_KEY
    if (!key)
        return getHeaders()
    // get current unix time in seconds
    const unixtime = `${Math.floor(Date.now() / 1000)}`;
    const data = `${device_id}${tz}${unixtime}`;
    // base64 encode the data
    const b64data = btoa(data);

    // create a SHA256 HMAC with the signature and the key
    const signature = hmacSHA256(b64data, key);
    console.log(signature.toString())

    const s2 = Buffer.concat([Buffer.from("1:"), Buffer.from(unixtime), Buffer.from(":"), Buffer.from(signature.toString(), "hex")]);
    const s3 = s2.toString('base64');
    console.log(s3)
    return {
        'bereal-signature': s3,
        'bereal-timezone': tz,
        'bereal-device-id': device_id,
    }
}