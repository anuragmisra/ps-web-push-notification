const express = require('express')
const app = express()
const publisher = require('./publisher')
const port = 3000

// https://stackoverflow.com/a/10007542/379235
app.use(express.json());

const subscribers = new Map()
subscribers.set("Y5JXnr1iu8SAcOmyelLwfQ", { "endpoint": "https://fcm.googleapis.com/fcm/send/dAaAqYxkOpA:APA91bF7LW05uCdkJcFcLRPm9vNB5UUY0sseKWqKfK1PzZmUV0d39hXiyjMd8EmvJocpr7zDQeGr7zPR5wgOFJgd6TnfBcP8JZQ3ds_eOXp4pnHAVlaB97LN-7mylf6ihShARS8uoAu0", "expirationTime": null, "keys": { "p256dh": "BJweshYHlxCLAauzr5-JpasUDMrwcAT_rUG7zyLymJrSAUVu7EHRdIKvQfzB6IQEJFgVAKxpyoctwPlCQCP0aDM", "auth": "Y5JXnr1iu8SAcOmyelLwfQ" } })

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/subscribe', function (req, res) {
    console.log(req.body)
    res.send(req.body)
})


setInterval(() => publisher.notify(subscribers), 3000)
app.listen(port, () => console.log(`Server App is running at http://localhost:${port}`))