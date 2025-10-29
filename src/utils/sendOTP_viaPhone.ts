
import { config } from '../config/generalconfig';
import axios from 'axios'
const { AUTHENTIC_KEY: authentic_key } = config.SMS;


export const sendSMS = async (
    phoneNumber: string,
    otp: string
) => {
    try {
        await axios.post(`http://sms.smsindori.com/http-tokenkeyapi.php?authentic-key=${authentic_key}&senderid=LESPAY&route=06&number=${phoneNumber}&message=Your%20Less%20Pay%20verification%20code%20is%20${otp}%20Do%20not%20share%20it%20with%20anyone.%20Less%20Pay.&templateid=1607100000000299162`)
    } catch (error) {
        throw new Error(`Failed to send SMS ${error}`);
    }
};