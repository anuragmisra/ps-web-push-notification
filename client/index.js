'use strict';

const client = (() => {
    let serviceWorkerRegObject = undefined;

    console.log("client/index.js executed")

    // check for serviceWorker support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            console.log("ServiceWorker and Push API support is available.")
        })
    }

    // register serviceWorker
    navigator.serviceWorker.register('service-worker.js').then(swRegObj => {
        console.log("ServiceWorker is registered", swRegObj)
        serviceWorkerRegObject = swRegObj;
    })
})()