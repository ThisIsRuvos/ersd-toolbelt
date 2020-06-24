const Promise = require('bluebird')
const got = require('got')
const path = require('path')

const fhirServerBase = process.env.FHIR_SERVER_BASE

console.log('fhirServerBase', fhirServerBase)

const updateSubscriptionIfNeeded = (subscription => {
  const emailAddress = subscription.resource.channel.endpoint.replace('mailto:','')
  if (subscription.resource.channel.payload) {
    console.log(`Removing payload on subscription for ${emailAddress}`)
    delete subscription.resource.channel.payload
    return Promise.delay(1000, got.put(path.join(fhirServerBase, 'Subscription', subscription.resource.id), { json: subscription.resource }).json())
    .then(res => {
      console.log(`Successfully updated subcription for ${emailAddress}`)
    })
    .catch(err => {
      console.error(`Failed to update subscription for ${emailAddress}`, err)
    })
  }
  console.log(`Skipping subscription for ${emailAddress}`)
  return Promise.resolve(subscription)
})

got(path.join(fhirServerBase, 'Subscription?type=email&_count=100')).json()
.then(({ entry }) => {
  console.log(`Found ${entry.length} subscriptions`)
  return Promise.each(entry, updateSubscriptionIfNeeded)
})
.then(() => {
  console.log('Finished')
})
.catch(console.error)
