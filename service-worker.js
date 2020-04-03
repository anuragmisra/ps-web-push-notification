/**
 * notificationclose and notificationclick are 2 events which are handled by serviceWorker
 * https://notifications.spec.whatwg.org/#dom-serviceworkerregistration-shownotification
 */

self.addEventListener('notificationclose', event => {
    console.log("notification closed", event)
})

self.addEventListener('notificationclick', event => {
    console.log("notification click", event)
})