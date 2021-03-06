const express = require('express');
const Twitter = require('twitter-v2');
const language = require('@google-cloud/language');
const langClient = new language.LanguageServiceClient();

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

const sanitizeTweet = (text) => {
    return text
        .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '') // remove any urls
        .replace(/\n/g, ' ')
        .replace(/&amp;/g, '')
        .replace(/@[A-Za-z0-9_]+/g, '')
        .replace(/\s\s+/g, ' ');
};

const addSentiments = (tweetsData) => {
    return Promise.all(
        tweetsData.map(async (tweet) => {
            const text = sanitizeTweet(tweet.text);
            const doc = {
                content: text,
                type: 'PLAIN_TEXT',
            };
            const [result] = await langClient.analyzeSentiment({
                document: doc,
            });

            let classification = false;
            if (text.split(' ').length >= 20) {
                [classification] = await langClient.classifyText({
                    document: doc,
                });
            }
            return Promise.resolve({
                id: tweet.id,
                text: text,
                product:
                    result.documentSentiment.score *
                    result.documentSentiment.magnitude,
                score: result.documentSentiment.score,
                magnitude: result.documentSentiment.magnitude,
                category:
                    classification && classification.categories.length
                        ? classification.categories[0].name
                        : '',
            });
        })
    );
};

router.get('/:id', (req, res) => {
    const client = getTwitterClient();
    // TODO: account for more than 800 tweets
    // getTweets(req.params.id, client)
    //     .then((tweets) => {
    //         addSentiments(tweets.data).then((calculatedTweets) => {
    //             calculatedTweets = calculatedTweets.filter(
    //                 (tweet) => tweet.score && tweet.magnitude
    //             ); // Filter out tweets with no score or magnitude
    //             const averageScore =
    //                 calculatedTweets.reduce(
    //                     (acc, curr) => acc + curr.score,
    //                     0
    //                 ) / calculatedTweets.length;
    //             res.send(finalObj);
    //         }).catch(err => {
    //             console.log(err);
    //             res.status(500);
    //             res.send({err: 'Invalid language'});
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.status(500);
    //         res.send({err: 'Invalid username'});
    //     });

    res.send(require('../barackobama.json'));
});

router.get('/', (req, res) => {
    res.status(500);
    res.send({err: 'Empty username'});
})

module.exports = router;
