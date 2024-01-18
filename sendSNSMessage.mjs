import Config from "./__CONFIG__.mjs";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export default async function(message) {
    if (!Config.useSns || Config.snsTopicArn == null) return;

    if (Config.debug) {
      console.log(`DEBUG: Send SNS Message:\n${message}`);
      console.log('');
      return;
    }

    try {
        const snsClient = new SNSClient({region: Config.snsAwsRegion});
        const response = await snsClient.send(
            new PublishCommand({
              Message: message,
              TopicArn: Config.snsTopicArn
            }),
          );
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}