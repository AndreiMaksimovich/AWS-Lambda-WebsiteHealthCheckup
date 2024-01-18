import SSLCheck from './SSLCheck.mjs';
import DomainCheck from './DomainCheck.mjs';
import Checks from "./__CHECKS__.mjs";
import Warning from './Warning.mjs';
import Config from './__CONFIG__.mjs';
import sendSlackMessage from './sendSlackMessage.mjs';
import sendSnsMessage from './sendSNSMessage.mjs';
import CriticalError from './CriticalError.mjs';

export const handler = async(event) => 
{
    await run(event, Checks);
}

export async function run(event, checks) {

    console.log('event: ');
    console.log(event);
    console.log('');

    if (event.debug != undefined) {
        Config.debug = event.debug;
    }

    if (event.performSSLChecks != undefined) {
        Config.performSSLChecks = event.performSSLChecks;
    }

    if (event.performDomainChecks != undefined) {
        Config.performDomainChecks = event.performDomainChecks;
    }

    if (event.performHttpChecks != undefined) {
        Config.performHttpChecks = event.performHttpChecks;
    }

    const errors = [];
    const warnings = [];
    
    async function process(checks) {
        for (var i=0; i<checks.length; i++) {
            const check = checks[i];

            if (check instanceof Array) {
                await process(check);
                continue;
            }

            try {
                console.log('');
                await check.run();
            } catch (error) {
                if (error instanceof Warning) {
                    warnings.push(error);
                    console.warn(error);
                } else {
                    errors.push(error);
                    console.error(error);
                    if (error instanceof CriticalError) {
                        return; // critical error => stop iterating
                    }
                }
            }
        }
    }

    await process(checks);

    if (errors.length > 0 || warnings.length > 0) {
        const message = buildErrorMessage(errors, warnings);
        if (Config.debug) {
            console.log(' ---- Errors & Warnings');
            console.log(message);
            console.log('\n\n');
        }
        await sendSlackMessage(message);
        await sendSnsMessage(message);
    }
}

function buildErrorMessage(errors, warnings) {
    let result = "";
    errors.forEach(error => {
        result += `ERROR: ${error.message}\n`;
    });
    warnings.forEach(warning => {
        result += `WARNING: ${warning.message}\n    `;
    });
    return result;
}