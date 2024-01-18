import CheckBase from "./CheckBase.mjs";
import Config from "./__CONFIG__.mjs";
import Warning from "./Warning.mjs";
import {getSSLCertificateInfo} from "./getSSLCertificateInfo.mjs";
import CriticalError from "./CriticalError.mjs";

export default class SSLCheck extends CheckBase {

    constructor(hostname) {
        super();
        this.hostname = hostname;
    }

    async run() {

        console.log(` --- SSL Check: ${this.hostname}`);

        if (!Config.performSSLChecks) {
            console.log(' -> Skip');
            return;
        }

        let sslInfo = null;
        try {
            sslInfo = await getSSLCertificateInfo(this.hostname);
        } catch(error) {
            throw new CriticalError(`SSL Check failed: ${this.hostname} getSSLCertificateInfo failed: ${error.message}`);
        }

        console.log(sslInfo);

        if (!sslInfo.isValid) {
            throw new CriticalError(`SSL Check failed: ${this.hostname} SSL Certificate is not valid`);
        }

        if (sslInfo.daysBeforeExpiration < Config.daysBeforeSslCertificateExpirationError) {
            throw new Error(`SSL Check failed: ${this.hostname} SSL Certificate will be valid for next ${sslInfo.daysBeforeExpiration} days`);
        }

        if (sslInfo.daysBeforeExpiration < Config.daysBeforeSslCertificateExpirationWarning) {
            throw new Warning(`SSL Check failed: ${this.hostname} SSL Certificate will be valid for next ${sslInfo.daysBeforeExpiration} days`);
        }
    }
    
}