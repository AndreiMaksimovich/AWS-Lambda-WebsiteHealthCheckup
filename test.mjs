import { run } from "./index.mjs";
import ExampleChecks from "./__CHECKS_EXAMPLE__.mjs";
import Checks from "./__CHECKS__.mjs";

run(
    {
        debug: true,
        performSSLChecks: true,
        performDomainChecks: true,
        performHttpChecks: true
    }, 
    ExampleChecks);