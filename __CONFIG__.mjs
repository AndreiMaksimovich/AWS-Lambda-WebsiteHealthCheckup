
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