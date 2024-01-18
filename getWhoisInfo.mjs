import whois from 'whois';
import Config from './__CONFIG__.mjs';

export class DomainWhoisInfo {
    constructor(domainName, expirationDate) {
        this.domainName = domainName;
        this.expirationDate = expirationDate;
        this.daysBeforeExpiration = ((expirationDate - Date.now()) / 86400000).toFixed(2);
    }
}

/**
 * 
 * @param {string} hostname 
 * @returns {Promise<DomainWhoisInfo>}
 */
export async function getWhoisInfo(hostname) {
    return new Promise((resolve, reject) => {
        try {
            whois.lookup(hostname, { timeout: Config.getWhoisTimeout }, (error, result) => {
                if (error != null) {
                    reject(error);
                } else {
                    if (Config.debug) {
                        console.log(` ---- Whois Response ${hostname}`);
                        console.log(result);
                        console.log('\n\n');
                    }
                    resolve(parseWhoisResponse(result));
                }
            })
        } catch (error) {
            reject(error);
        }
    });
}

function parseWhoisResponse(response) {
    const lines = response.split('\n');
    const params = [];

    lines.forEach(element => {
        const position = element.indexOf(':');
        if (position > 0) {
            params[element.substring(0, position).toLowerCase().trim()] = element.substring(position + 1).toLowerCase().trim();
        }
    });

    function getWhoisResponseParam(keyVariants, defaultReponse = null) {
        for (var i=0; i<keyVariants.length; i++) {
            if (params[keyVariants[i]] != undefined) {
                return params[keyVariants[i]];
            }
        }
        return defaultReponse;
    }

    const domainName = getWhoisResponseParam(Config.whoisResponseDomainNameVariants, null);
    const expirationDate = getWhoisResponseParam(Config.whoisResponseExpirationDateVariants, null);

    return new DomainWhoisInfo(domainName, new Date(expirationDate));
}

