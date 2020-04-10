'use strict';

const client = (() => {
    let isUserSubscribed = false;
    let serviceWorkerRegObject = undefined;
    const notificationButton = document.getElementById("btn-notify");
    const pushButton = document.getElementById("btn-push");
    const pushNotification = document.getElementById("push-notification");

    const post = (subscription) => {
        return fetch('http://localhost:3000/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const showNotificationButton = () => {
        notificationButton.style.display = "block"
        notificationButton.addEventListener('click', sendNotification)
    }

    const enablePushNotificationButton = () => {
        isUserSubscribed = false
        pushButton.innerText = "ENABLE PUSH NOTIFICATIONS"
        pushButton.style.backgroundColor = "#efb1ff"
    }

    const disablePushNotificationButton = () => {
        isUserSubscribed = true
        pushButton.innerText = "DISABLE PUSH NOTIFICATIONS"
        pushButton.style.backgroundColor = "#ea9085"
    }

    const notifyInApp = (transaction) => {
        const html = `<div>
            <div>Amount  :   <b>${transaction.amount}</b></div>
            <div>Business: <b>${transaction.business}</b></div>
            <div>Name    :  <b>${transaction.name}</b></div>
            <div>Type    : <b>${transaction.type}</b></div>
            <div>Account : <b>${transaction.account}</b></div>
        </div>
        `
        pushNotification.style.display = "flex"
        pushNotification.innerHTML = html
    }

    let count = 0
    const sendNotification = () => {
        // 05 - Show Text Notification
        // const simpleTextNotification = (reg => reg.showNotification("Yay! It works!"))

        // 06-01: Using Tag to group
        const simpleTextNotification = (reg => reg.showNotification("Count=" + count++, { tag: "id1" }))

        // 06 - Notification with Image
        const imageWithTextNotification = (reg) => {
            // more options at https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification#Syntax
            const options = {
                icon: "imgs/notification.png",

                // 07 - Notification with a body
                body: "Alert!! This is image notification",

                // 09 - Actions on notification click (see sw.js for log)
                actions: [
                    { action: "search", title: "Try Searching!" },
                    // 10 - More Actions
                    { action: "close", title: "Forget it!" },
                ],
                data: {
                    notificationTime: Date.now(),
                    githubUser: "hhimanshu"
                }
            }
            reg.showNotification("Yay! It works", options)
        }

        navigator.serviceWorker.getRegistration()
            .then(registration => simpleTextNotification(registration))
    }

    const checkNotificationsSupport = () => {
        // 00 - Check for Notifications API support
        if (!('Notification' in window)) {
            return Promise.reject("The browser does not have Notifications Support")
        }
        return Promise.resolve()
    }

    const registerServiceWorker = () => {
        // 01 - check for serviceWorker support
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // https://developer.mozilla.org/en-US/docs/Web/API/Push_API#Push_concepts_and_usage
                // console.log("ServiceWorker and Push API support is available.")
            })
        } else {
            return Promise.reject("serviceWorker support is not available.")
        }

        // 02 - register serviceWorker
        return navigator.serviceWorker.register('service-worker.js').then(swRegObj => {
            // console.log("ServiceWorker is registered", swRegObj)
            serviceWorkerRegObject = swRegObj;

            // 03 - Enable Notifications Subscribe Button
            showNotificationButton();

            // 05-04 Enable/Disable Push Button
            swRegObj.pushManager.getSubscription()
                .then(subs => {
                    if (subs) disablePushNotificationButton()
                    else enablePushNotificationButton()
                })

            // 06-01 Add listener to receive message if client is open
            navigator.serviceWorker.addEventListener('message', e => notifyInApp(e.data))
        })
    }

    const requestNotificationPermission = () => {
        // 04 - Request Notification Permission
        return Notification.requestPermission(status => {
            // console.log("Notification Permission Status: ", status)

            if (status !== 'granted') {
                notificationButton.disabled = true
                notificationButton.style.cursor = "not-allowed"
                notificationButton.removeEventListener('click', sendNotification, false)
            }
        })
    }

    checkNotificationsSupport()
        .then(registerServiceWorker)
        .then(requestNotificationPermission)
        // .then(() => console.log("registered service worker and requested notification permission"))
        .catch(err => console.error(err))


    // 05.01 - Setup Push
    const setupPush = () => {


        // 05.03 - unsubscribe
        const unsubscribeUser = () => {
            console.log("unsubscribing user")
            serviceWorkerRegObject.pushManager.getSubscription()
                .then(subscription => {
                    if (subscription) return subscription.unsubscribe()
                })
                .then(() => enablePushNotificationButton())
                .catch(err => console.err("Failed to unsubscribe from Push Service.", err))
        }

        function urlB64ToUint8Array(url) {
            const padding = '='.repeat((4 - url.length % 4) % 4);
            const base64 = (url + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

        // 05.02 - Subscribe user with Public Key
        const subscribeUser = () => {
            // Note: get using web-push command
            const applicationServerPublicKey = 'BM4KIuyRbYzTHmkQ23ooGyXsK1E85C7cNPINtriy2vbz9KX4eLxu_8A-AXz8LUCHqp4vFqFPlmK_o4zS5kCa1Rg';
            const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
            serviceWorkerRegObject.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            })
                .then(subscription => {
                    console.log(JSON.stringify(subscription))
                    // todo: HTTP POST to save subscription on server
                    post(subscription)

                    disablePushNotificationButton()

                })
                .catch(err => console.error("Failed to subscribe to Push Service.", err))

        }

        pushButton.addEventListener('click', () => {
            serviceWorkerRegObject.pushManager.getSubscription()
                .then(subs => {
                    if (subs) isUserSubscribed = true
                })

            if (isUserSubscribed) unsubscribeUser()
            else subscribeUser()
        })

    }
    setupPush()
})()