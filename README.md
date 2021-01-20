# TwitterSafe.space
🏥 nwHacks 2021 Entry - Identify the most toxic Twitter users in your feed using natural language sentiment analysis to start 2021 with a boost of positivity!

> 🏆 Honourable mention out of 200 projects in nwHacks

> [View the project's Devpost page here.](https://devpost.com/software/twittersafe-space-analyze-the-timeline-of-twitter-users)

> [Live Demo](https://twittersafe.space/)

Team Members: Youssef Soliman and Michael Xu

## Inspiration
Twitter has become an integral part of our lives. It has the power to influence political outcomes and organize landmark events. However, rather than being a community that allows for users to share ideas and learn from each other, radical individuals—who openly spread hatred and silence discourse—have turned Twitter into an unsafe site. We wanted to change that. 
The issue is that Twitter users are not held accountable for their actions. As such, we created a web app that allows users to view the sentiments of a user's tweets.

## What it does
We use the Twitter API to fetch a user's tweets. Then run it through the Google Cloud Natural Language API to get a sentiment analysis and classification. We then display the tweets using a graph visualization tool sorted by sentiments. Users can click a specific tweet and view the sentiment score of it as well as the tweet itself.

## How we built it
We used React for the front end and Node.js + Express for the backend. The project is hosted on heroku and is linked to our domain retrieved from Domain.com.

## Challenges we ran into
We initially had trouble understand the output of the Natural Language API. In the end, we were able to understand the output and use the data accordingly.

## Accomplishments that we're proud of
Displaying the Tweets in a very visually appealing manner with D3.js and building a smooth UI with React.

## What we learned
How to use React to build a responsive web app. 

## What's next for TwitterSafe.Space
Using OAuth with the Twitter API to let users sign into their own accounts and perform an analysis on private accounts that they have access to. As well, we are hoping to make it into a chrome extension so it can be accessed directly from twitter.
