'use strict';

const client = (() => {
    let serviceWorkerRegObject = undefined;
    const notificationButton = document.getElementById("btn-notify");
    const pushButton = document.getElementById("btn-push");

    const showNotificationButton = () => {
        notificationButton.style.display = "block"
        notificationButton.addEventListener('click', sendNotification)
    }

    const sendNotification = () => {
        // 05 - Show Text Notification
        const simpleTextNotification = (reg => reg.showNotification("Yay! It works!"))

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
            .then(registration => imageWithTextNotification(registration))
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
        let isUserSubscribed = false;

        const unsubscribeUser = () => {
            console.log("unsubscribing user")
            serviceWorkerRegObject.pushManager.getSubscription()
                .then(subscription => {
                    if (subscription) return subscription.unsubscribe()
                })
                .then(() => {
                    isUserSubscribed = false
                    pushButton.innerText = "ENABLE PUSH NOTIFICATIONS"
                    pushButton.style.backgroundColor = "#efb1ff"
                })
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
            pushButton.innerText = "DISABLE PUSH NOTIFICATIONS"
            pushButton.style.backgroundColor = "#ea9085"

            // Note: get using web-push command
            const applicationServerPublicKey = 'BFCV2QdN0JH3f5EAf6PaA4lEOsKZTcmxI9f4aLyNv3paUF-NOf6dt-6uulkwYaq2q6017X1G3Tga4sKkPVv0gtI';
            const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
            serviceWorkerRegObject.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            })
                .then(subscription => {
                    console.log(JSON.stringify(subscription))
                    isUserSubscribed = true
                    // todo: HTTP POST to save subscription on server
                })
                .catch(err => console.err("Failed to subscribe to Push Service.", err))

        }

        pushButton.addEventListener('click', () => {
            if (isUserSubscribed) unsubscribeUser()
            else subscribeUser()
        })
    }
    setupPush()
})()