# AWS-Lambda-WebsiteHealthCheckup
Lambda function that verifies the health status of the website: the number of days until the end of domain registration, the status of the ssl certificate, the correctness of the http request response and informs about errors using AWS SNS Topic (email, sms, ...) or Slack WebHook.

## Local Installation

The lambda function locally works like a normal NodeJS application. Use `npm install` to install package dependencies.

## Local Testing

You can test the function locally using terminal command:
```
npm test
```
or
```
node test.mjs
```

You can change test parameters and test steps by modifying the test.mjs file.

Notice: The run function accepts a configuration and an array of checks as arguments.
During testing, the configuration is passed from the test.mjs file, and during normal operation in AWS, the configuration is passed as an event from the EventBridge schedule.

Notice: `debug: true` in configuration replaces sending errors via Slack WebHook and SNS to console output.
```
run(
    {
        debug: true,
        performSSLChecks: true,
        performDomainChecks: true,
        performHttpChecks: true
    }, 
    ExampleChecks);
```

## Function Configuration

### `__CONFIG__.mjs`

```
export default {

    debug: false,
    performSSLChecks: true,
    performDomainChecks: false,
    performHttpChecks: true,

    // SNS
    snsAwsRegion: "[YOUR_AWS_REGION_ID]",
    useSns: false,
    snsTopicArn: "[YOUR_AWS_SNS_TOPIC_ARN]",

    // Slack Webhook
    useSlack: false,
    slackWebhookUrl: "[YOUR_SLACK_WEB_HOOK_URL]",

    // Timeouts
    getCertificateTimeout: 10000,
    getWhoisTimeout: 10000,
    httpCheckTimeout: 5000,

    // Domain expiration
    daysBeforeDomainExpirationWarning: 30,
    daysBeforeDomainExpirationError: 3,

    // SSL expiration
    daysBeforeSslCertificateExpirationWarning: 21,
    daysBeforeSslCertificateExpirationError: 3,

    // DNS response params
    whoisResponseDomainNameVariants: ['domain name'],
    whoisResponseExpirationDateVariants: ['registrar registration expiration date', 'renewal date']
};
```

#### SNS
If you plan to use SNS, replace `[YOUR_AWS_REGION_ID]` with the identifier of the AWS region in which your SNS Topic is configured (f.e. us-east-1), replace `[YOUR_AWS_SNS_TOPIC_ARN]` with your SNS Topic Arn, set `useSns` to true. Otherwise, set useSns to false.

#### Slack WebHook
If you plan to use Slack WebHook, replace `[YOUR_SLACK_WEB_HOOK_URL]` with the your Slack WebHook Url, set `useSlack` to true. Otherwise, set useSlack to false.

#### DNS Response Parameters
Depending on the domain registrar, the parameter keys for hostname and registration expiration date may be different. 
If the function does not work properly, analyze the whois response for your domain (in debug mode it will be in the console) and add the appropriate parameter keys.

### `__CHECKS__.mjs`
Notice: You can use `__CHECKS_EXAMPLE__.mjs` as an example.

The `__CHECKS__.mjs` file contains an array of checks that will be performed during the operation of the function. 
This array of checks can be nested (contain other arrays).

Nested arrays can be used to validate multiple websites (if the check throws a critical error, subsequent checks from the block are not performed).

Example of `__CHECKS__.mjs` file:
```
import SSLCheck from "./SSLCheck.mjs";
import HttpCheck from "./HttpCheck.mjs";
import DomainCheck from "./DomainCheck.mjs";

export default [

    // Google.com
    [
        new DomainCheck('google.com'),
        new SSLCheck('google.com'),
        new HttpCheck('https://www.google.com'),
        new HttpCheck('https://www.google.com/404', 404), // code 404 is expected
    ],

    // Example-A.com
    [
        new DomainCheck('example-a.com'),
        new SSLCheck('example-a.com'),
        new HttpCheck('https://example-a.com/privacy-policy/'),
        new HttpCheck('https://example-a.com/ping/', 200, "pong"),
        new HttpCheck('https://example-a.com/error-404', 404)
    ],
        
];
```
**DomainCheck** - checks the end date of domain registration.

**SSLCheck** - checks the validity of an SSL certificate and its expiration date.

**HttpCheck** - checks the response code of an HTTP request or/and its contents.

## Preparation of the Function for AWS

AWS accepts lambda functions as a zip archive. Archive the entire function code folder (including node_modules).

Linux and macOS: `zip -r ../WebsiteHealthCheckup.zip .`

## AWS Lambda

**Runtime:** Node.js 20.x

To send messages using SNS, the function requires the sns:Publish permission:
```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "VisualEditor0",
			"Effect": "Allow",
			"Action": "sns:Publish",
			"Resource": "[YOUR_arn:aws:sns]"
		}
	]
}
```

## Event Bridge: Schedules

There is no practical need to do frequent domain checks.

Here's an example of configurations for the function, along with a cron entry for the schedules:

* **Domain Check (once a week on Monday at 9am)**

    Cron: `0 9 ? * 2 *`
    
    Payload:
    ```
    {
      "performSSLChecks": false,
      "performDomainChecks": true,
      "performHttpChecks": false
    }
    ```

* **SSL and Http Checks (every 4 hours)**

    Cron: `0 */4 * * ? *`
    
    Payload:
    ```
    {
      "performSSLChecks": true,
      "performDomainChecks": false,
      "performHttpChecks": true
    }
    ```

## AWS Lambda Testing

Test the function on AWS using the Lambda Test tab, passing the configuration as Event.

```
{
    debug: true,
    performSSLChecks: true,
    performDomainChecks: true,
    performHttpChecks: true
}
```

## CloudWatch Log Group

Don't forget to change the retention time of the CloudWatch Log Group for the function (otherwise the logs will be stored forever and create unwanted overhead).

## Learn More

* Introduction to Node.js: https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
* Amazon SNS Tutorial for Sending Email Notifications: https://mailtrap.io/blog/amazon-sns-guide/
* Sending messages using Incoming Slack Webhooks: https://api.slack.com/messaging/webhooks
* AWS EventBridge Scheduler User Guide: https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html
* Getting started with AWS Lambda: https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html