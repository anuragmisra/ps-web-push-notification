'use strict';

const client = (() => {
    let serviceWorkerRegObject = undefined;
    const notificationButton = document.getElementById("btn-notify");

    const showNotificationButton = () => {
        notificationButton.style.display = "block"
        notificationButton.addEventListener('click', sendNotification)
    }

    const sendNotification = () => {
        // todo - start here
        console.log("sending notification!")
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
                console.log("ServiceWorker and Push API support is available.")
            })
        } else {
            return Promise.reject("serviceWorker support is not available.")
        }

        // 02 - register serviceWorker
        return navigator.serviceWorker.register('service-worker.js').then(swRegObj => {
            console.log("ServiceWorker is registered", swRegObj)
            serviceWorkerRegObject = swRegObj;

            // 03 - Enable Notifications Subscribe Button
            showNotificationButton();
        })
    }

    const requestNotificationPermission = () => {
        // 04 - Request Notification Permission
        return Notification.requestPermission(status => {
            console.log("Notification Permission Status: ", status)

            if (status !== 'granted') {
                notificationButton.style.backgroundColor = "#4cd3c2"
                notificationButton.style.cursor = "not-allowed"
                notificationButton.removeEventListener('click', sendNotification, false)
            }
        })
    }

    checkNotificationsSupport()
        .then(registerServiceWorker)
        .then(requestNotificationPermission)
        .then(() => console.log("registered service worker and requested notification permission"))
        .catch(err => console.error(err))
})()