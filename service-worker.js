/**
 * notificationclose and notificationclick are 2 events which are handled by serviceWorker
 * https://notifications.spec.whatwg.org/#dom-serviceworkerregistration-shownotification
 */

// 08 - Handle notificationclose and notificationclick events
self.addEventListener('notificationclose', event => {
    console.log("notification closed", event)
})

self.addEventListener('notificationclick', event => {
    // console.log("notification click", event)
    
    // console.log(`action=${event.action}`)
    // console.log(`data=${JSON.stringify(event.notification.data)}`)

    // https://w3c.github.io/ServiceWorker/#clients
    if (event.action === "search") {
        clients.openWindow(`https://github.com/${event.notification.data.githubUser}`)
    } else if (event.action === "close") {
        clients.openWindow(`https://giphy.com/gifs/the-secret-life-of-pets-happy-relax-26hisjy85ML01lqH6/fullscreen`)
    }
})