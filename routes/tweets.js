const Twitter = require('twitter-v2');
const express = require('express');

const router = express.Router();

const getTwitterClient = () => {
    const key = process.env.CONSUMER_KEY;
    const secret = process.env.CONSUMER_SECRET;
    const client = new Twitter({
        consumer_key: key,
        consumer_secret: secret,
    });

    return client;
};

const getTweets = async (username, client) => {
    const user = await client.get(`users/by/username/${username}`);
    const endpoint = `users/${user.data.id}/tweets`;
    const params = {
        max_results: 100,
        exclude: 'retweets',
    };

    const tweets = client.get(endpoint, params);

    return tweets;
};

router.get('/:id', (req, res) => {
    const client = getTwitterClient();
    // TODO: account for more than 800 tweets
    getTweets(req.params.id, client)
        .then((tweets) => {
            res.send(tweets);
        })
        .catch((err) => console.log(err));
});

module.exports = router;
