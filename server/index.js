const webPush = require('web-push');
const faker = require('faker');

// const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/cB2JUdnLbGs:APA91bGtZpqMz-Ee2klmnETpSvcOYQAS0TpKJEksVOYHeEq-DBYHyDuZTHXC5oLyHd7Oaz2djEVdnfDINSws1azfBLeqH9SSPZQmC65Zk89taSfhCh7xeTp2_mgyPa8-QaYxR4PFfcm2","expirationTime":null,"keys":{"p256dh":"BKhBx6DfXSuPWHXOQS-x1llZTK3T2FXT4Yk45MkpFuPHcrRjUWq-2eSBglED5Da6SHRoDlhDvFmV6r_RL_nBvVk","auth":"vzMOUXUtHgo13zE7Ujxhxw"}}
const pushSubscription = { "endpoint": "https://fcm.googleapis.com/fcm/send/d-VEFDorVmA:APA91bGpnr5X1LtCY26en4uWKzCBrvbrRXF3gaq_2HD576eINxwTvyJgpsoHZ8xgSQpoKjYRQuKMlmljV2q67q3kBBOIgIMi0k-84B4Pv4LmVdg0O5lDXJNivHqq-ybxVpxrMZjn4isA", "expirationTime": null, "keys": { "p256dh": "BJMguUJDFBcC2Awe9pupVM5fBDJHI6DzosjfLs7nv1XDTf7FEccoBQjV9h7LIxzoPZiZhGiXb58kPYGKP8zAJ6c", "auth": "LciGyc_-JkH-nFUz65M8mg" } }

// TODO 4.3a - include VAPID keys
const vapidPublicKey = 'BM4KIuyRbYzTHmkQ23ooGyXsK1E85C7cNPINtriy2vbz9KX4eLxu_8A-AXz8LUCHqp4vFqFPlmK_o4zS5kCa1Rg';
const vapidPrivateKey = 'uiObz_XpzmYN1WRJcrQsm-EzhfUzqOAoGgilr9A47R0';

const payload = 'Hello from server!';

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

let f = (transaction) => webPush.sendNotification(
    pushSubscription,
    JSON.stringify(transaction),
    options
);

// f(randomTransaction())
setInterval(() => f(randomTransaction()), 5000)