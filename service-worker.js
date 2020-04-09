/**
 * notificationclose and notificationclick are 2 events which are handled by serviceWorker
 * https://notifications.spec.whatwg.org/#dom-serviceworkerregistration-shownotification
 */

// 08 - Handle notificationclose and notificationclick events
self.addEventListener('notificationclose', event => {
    // console.log("notification closed", event)
})

self.addEventListener('notificationclick', event => {
    // console.log("notification click", event)
    event.notification.close()

    // console.log(`action=${event.action}`)
    // console.log(`data=${JSON.stringify(event.notification.data)}`)

    // https://w3c.github.io/ServiceWorker/#clients
    if (event.action === "search") {
        clients.openWindow(`https://github.com/${event.notification.data.githubUser}`)
    } else if (event.action === "close") {
        clients.openWindow(`https://giphy.com/gifs/the-secret-life-of-pets-happy-relax-26hisjy85ML01lqH6/fullscreen`)
    } else if (event.action === "") {
        event.waitUntil(
            clients.matchAll().then(cs => {
                const client = cs.find(c => c.visibilityState === "visible")
                if (client !== undefined) {
                    /* not working */
                    client.navigate(client.url);
                    client.focus();
                } else {
                    clients.openWindow('http://localhost:9999')
                    //event.notification.close()
                }
            })
        )
    }
})

let count = 0
self.addEventListener('push', event => {
    const transaction = JSON.parse(event.data.text());

    const options = { body: transaction.business, tag: 'id' + count++ }
    const transactionType = transaction.type === "deposit" ? '+' : '-'

    console.log(JSON.stringify(options))

    self.registration.showNotification(`${transactionType} ` + transaction.amount, options)

})

// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API#Dealing_with_repeated_notifications