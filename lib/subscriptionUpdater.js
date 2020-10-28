const Promise = require('bluebird')
const got = require('got')
const path = require('path')

const fhirServerBase = process.env.FHIR_SERVER_BASE ||'http://localhost:8081/hapi-fhir-jpaserver/fhir'
const message =  process.env.MESSAGE||' '

console.log('fhirServerBase', fhirServerBase)

const updateSubscriptionIfNeeded = (subscription => {
    if (subscription.resource.channel.type === 'email') {
        const emailAddress = subscription.resource.channel.endpoint.replace('mailto:','')
        var messageBuffer = Buffer.from(message, 'utf8');
        var base64Message = messageBuffer.toString('base64');

        subscription.resource.channel.payload = `;bodytext=${base64Message}`;
        console.log(`Changing payload for ${emailAddress}`)
        return Promise.delay(1000, got.put(path.join(fhirServerBase, 'Subscription', subscription.resource.id), {json: subscription.resource}).json())
            .then(res => {
                console.log(`Successfully updated subcription for ${emailAddress}`)
            })
            .catch(err => {
                console.error(`Failed to update subscription for ${emailAddress}`, err)
            })
        console.log(`Skipping subscription for ${emailAddress}`)
    }
    return Promise.resolve(subscription)
})

got(path.join(fhirServerBase, 'Subscription?type=email&_count=100')).json()
    .then(({entry}) => {
        console.log(`Found ${entry.length} subscriptions`)
        return Promise.each(entry, updateSubscriptionIfNeeded)
    })
    .then(() => {
        console.log('Finished')
    })
    .catch(console.error)
