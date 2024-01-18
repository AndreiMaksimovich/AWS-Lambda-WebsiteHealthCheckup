import CheckBase from "./CheckBase.mjs";
import Config from "./__CONFIG__.mjs";
import { getWhoisInfo } from "./getWhoisInfo.mjs";
import Warning from "./Warning.mjs";
import CriticalError from "./CriticalError.mjs";

export default class DomainCheck extends CheckBase {

    constructor(domainName) {
        super();
        this.domainName = domainName;
    }

    async run() {
        console.log(` --- Domain Check: ${this.domainName}`);

        if (!Config.performDomainChecks) {
            console.log(' -> Skip');
            return;
        }

        let whoisInfo = null;
        try {
            whoisInfo = await getWhoisInfo(this.domainName);
        } catch(error) {
            throw new CriticalError(`Domain Check failed: ${this.domainName} getWhoisInfo failed: ${error.message}`);
        }

        console.log(whoisInfo);

        if (whoisInfo.domainName == null) {
            throw new CriticalError(`Domain Check failed: ${this.domainName}: whois request failed`);
        }

        if (whoisInfo.daysBeforeExpiration < Config.daysBeforeDomainExpirationError) {
            throw new Error(`Domain Check failed: ${this.domainName} domain will expire in ${whoisInfo.daysBeforeExpiration} days`);
        }

        if (whoisInfo.daysBeforeExpiration < Config.daysBeforeDomainExpirationWarning) {
            throw new Warning(`Domain Check failed: ${this.domainName} domain will expire in ${whoisInfo.daysBeforeExpiration} days`);
        }
    }
    
}