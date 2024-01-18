import { IncomingWebhook } from '@slack/webhook';
import Config from './__CONFIG__.mjs';

export default async function(message) {
    if (!Config.useSlack || Config.slackWebhookUrl == null) return;

    if (Config.debug) {
        console.log(`DEBUG: Send Slack Message:\n${message}`);
        console.log('');
        return;
    }

    try {
        const slackWebhook = new IncomingWebhook(Config.slackWebhookUrl);
        await slackWebhook.send({text: message});
    } catch (error) {
        console.error(error);
    }
}