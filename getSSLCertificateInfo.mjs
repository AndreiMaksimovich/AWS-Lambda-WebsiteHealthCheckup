
import https from 'https';
import Config  from './__CONFIG__.mjs';

export class SSLCertificateInfo {
    constructor(isValid, validFrom, validTo, timeBeforeExpiration, hostname) {
        this.isValid = isValid;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.timeBeforeExpiration = timeBeforeExpiration;
        this.daysBeforeExpiration = (timeBeforeExpiration / 86400000).toFixed(2);
        this.hostname = hostname;
    }
}

/**
 * @returns {Promise<SSLCertificateInfo>}
 */
export async function getSSLCertificateInfo(hostname) 
{
    const options = 
    {
        agent: false,
        method: 'HEAD',
        port: 443,
        rejectUnauthorized: false,
        hostname: hostname,
        timeout: Config.getCertificateTimeout
    };

    return new Promise((resolve, reject) => {
        try {
            const req = https.request(options, res => {
                const crt = res.socket.getPeerCertificate();
                resolve(
                    new SSLCertificateInfo(
                        res.socket.authorized || false,
                        crt.valid_from,
                        crt.valid_to,
                        new Date (crt.valid_to) - Date.now(), 
                        crt.subject.CN));
            });
            req.on('error', reject);
            req.end();
        } catch (e) {
            reject(e);
        }
    });
};