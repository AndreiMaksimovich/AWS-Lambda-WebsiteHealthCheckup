import CheckBase from "./CheckBase.mjs";
import Config from "./__CONFIG__.mjs";

export default class HttpCheck extends CheckBase {

    constructor(url, expectedResponseCode = 200, expectedResponseText = null, responseTextShouldContain = null) {
        super();
        this.url = url;
        this.expectedResponseCode = expectedResponseCode;
        this.expectedResponseText = expectedResponseText;
        this.responseTextShouldContain = responseTextShouldContain;
    }

    async run() {
        console.log(` --- Http Check: ${this.url}`);

        if (!Config.performHttpChecks) {
            console.log(' -> Skip');
            return;
        }

        let response = null;
        try {
            response = await fetch(this.url, { signal: AbortSignal.timeout(Config.httpCheckTimeout) });
        } catch (e) {
            throw new Error(`HttpCheck failed: url=${this.url}, url fetch failed`);
        }
        
        if (this.expectedResponseCode != null) {
            if (response.status != this.expectedResponseCode) {
                throw new Error(`HttpCheck failed: url=${this.url}, expectedResponseCode=${this.expectedResponseCode}, responseCodeReceived=${response.status}`);
            } else {
                console.log(`response code: ${response.status}`);
            }
        }

        if (this.expectedResponseText != null || this.responseTextShouldContain != null) {
            const responseText = await response.text();

            if (this.expectedResponseText != null) {
                if (responseText != this.expectedResponseText) {
                    throw new Error(`HttpCheck failed: url=${this.url}, expectedResponseText=${this.expectedResponseText}, responseTextReceived=${responseText}`);
                } else {
                    console.log(`response text: ${responseText}`);
                }   
            }

            if (this.responseTextShouldContain != null) {
                if (!responseText.includes(this.responseTextShouldContain)) {
                    throw new Error(`HttpCheck failed: url=${this.url}, responseTextShouldContain=${this.responseTextShouldContain}`);
                } else {
                    console.log(`response text contains: ${this.responseTextShouldContain}`);
                }
            }
        }
    }

}