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

self.addEventListener('push', event => {
    const transaction = JSON.parse(event.data.text());
    // console.log(event.data.text())

    const options = { body: transaction.business }
    const transactionType = transaction.type === "deposit" ? '+' : '-'

    // https://stackoverflow.com/questions/37902441/what-does-event-waituntil-do-in-service-worker-and-why-is-it-needed
    event.waitUntil(
        // 06-01 Only notify if client is away (also see client/index.js)
        clients.matchAll().then(cs => {
            if (cs.length === 0) {
                self.registration.showNotification(`${transactionType} ` + transaction.amount, options)
            } else {
                // Inform the first client
                cs[0].postMessage(transaction)
            }
        })
    )
})