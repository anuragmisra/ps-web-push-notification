const webPush = require('web-push');
const faker = require('faker');

// const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/cB2JUdnLbGs:APA91bGtZpqMz-Ee2klmnETpSvcOYQAS0TpKJEksVOYHeEq-DBYHyDuZTHXC5oLyHd7Oaz2djEVdnfDINSws1azfBLeqH9SSPZQmC65Zk89taSfhCh7xeTp2_mgyPa8-QaYxR4PFfcm2","expirationTime":null,"keys":{"p256dh":"BKhBx6DfXSuPWHXOQS-x1llZTK3T2FXT4Yk45MkpFuPHcrRjUWq-2eSBglED5Da6SHRoDlhDvFmV6r_RL_nBvVk","auth":"vzMOUXUtHgo13zE7Ujxhxw"}}
const pushSubscription = { "endpoint": "https://fcm.googleapis.com/fcm/send/dygxfeC4r8w:APA91bHT3jeJs4BaiTCTzSwwyNZOO21ynoLrlDIp5PVh4JDHia_wGHN7DkG4V9k2IE6D5zevQT5FfHIE9EEKeqS4msNUiZnRHOWAjrOo6zX7Kl17bymitSQGN0vomStyDzPyBTt65ub4", "expirationTime": null, "keys": { "p256dh": "BJWpvUGf4RUsLVew7gHv0lDfN_NSwgLSaHS8Bgdao9doFTJge6l1dZcMsMBoP0gfxuenfDvGvUm0e_t36XGVY_I", "auth": "VIVry7xo8gOR_WqDHTz1sw" } }

// TODO 4.3a - include VAPID keys
const vapidPublicKey = 'BM4KIuyRbYzTHmkQ23ooGyXsK1E85C7cNPINtriy2vbz9KX4eLxu_8A-AXz8LUCHqp4vFqFPlmK_o4zS5kCa1Rg';
const vapidPrivateKey = 'uiObz_XpzmYN1WRJcrQsm-EzhfUzqOAoGgilr9A47R0';

const options = {
    // gcmAPIKey: 'YOUR_SERVER_KEY',
    TTL: 60,
    vapidDetails: {
        subject: 'mailto: harit.subscriptions@gmail.com',
        publicKey: vapidPublicKey,
        privateKey: vapidPrivateKey
    }
};

const randomTransaction = () => faker.helpers.createTransaction();

let f = (subscriber, transaction) => webPush.sendNotification(
    subscriber,
    JSON.stringify(transaction),
    options
);

const notify = (subscribers) => {
    if (subscribers.length < 1) {
        console.log("No Subscribers to Notify")
        return
    }
    const transaction = randomTransaction()
    subscribers.forEach((subscriber, id) => f(subscriber, transaction))
    console.log(`${subscribers.size} subscribers notified.`)
}

module.exports = {
    notify: notify
}