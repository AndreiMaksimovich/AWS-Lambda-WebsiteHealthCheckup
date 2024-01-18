import SSLCheck from "./SSLCheck.mjs";
import HttpCheck from "./HttpCheck.mjs";
import DomainCheck from "./DomainCheck.mjs";

export default [

    // // Google.com
    // [
    //     new DomainCheck('google.com'),
    //     new SSLCheck('google.com'),
    //     new HttpCheck('https://www.google.com'),
    //     new HttpCheck('https://www.google.com/404', 404), // code 404 is expected
    // ],

    // // Example-A.com
    // [
    //     new DomainCheck('example-a.com'),
    //     new SSLCheck('example-a.com'),
    //     new HttpCheck('https://example-a.com/privacy-policy/'),
    //     new HttpCheck('https://example-a.com/ping/', 200, "pong"),
    //     new HttpCheck('https://example-a.com/error-404', 404)
    // ],
        
];