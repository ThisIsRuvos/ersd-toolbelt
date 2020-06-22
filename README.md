# ersd-toolbelt

> Tools for eRSD operations

## Disable Subscription Payloads

Currently this is the only tool and is therefore set as the script that runs via `npm start`.  The Dockerfile also sets `npm start` as the command for the built image.

One environment variable, `FHIR_SERVER_BASE`, is expected and will be used to construct URLs for HTTP requests to the HAPI-FHIR server.

Execute in one of the following ways:

* `node lib/disablePayloadInSubscriptions.js`
* `npm start`
* docker build -t ersd-toolbelt . && docker run -it ersd-toolbelt
