import SSLCheck from "./SSLCheck.mjs";
import HttpCheck from "./HttpCheck.mjs";
import DomainCheck from "./DomainCheck.mjs";

export default [
    // Healthy website
    [
        new DomainCheck('google.com'),
        new SSLCheck('google.com'),
        new HttpCheck('https://www.google.com'),
        new HttpCheck('https://www.google.com/404', 404), // code 404 is expected
    ],

    // Expired SSL
    [
        new SSLCheck('expired.badssl.com')
    ],

    // Invalid SSL
    [
        new SSLCheck('wrong.host.badssl.com'),
        new HttpCheck('https://wrong.host.badssl.com')
    ],

    // Not existing domain
    [
        new DomainCheck('notexistingdomain.com')
    ],

    // Http check
    [
        new HttpCheck('https://www.google.com/404')
    ],

    // Http check
    [
        new HttpCheck('https://notexistingdomain.com')
    ]
];