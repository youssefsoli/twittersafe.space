import './App.css';
import {
    TextField,
    Container,
    InputAdornment,
    Button,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useState } from 'react';
import { Tweet } from 'react-twitter-widgets';
import Lottie from 'react-lottie';
import animationData from './lotties/loading.json';

const getTweets = async (username) => {
    return fetch(`http://localhost:3000/api/tweets/${username}`)
        .then((res) => res.json())
        .then((tweets) => {
            if (tweets.err) throw new Error(tweets.err);
            return tweets;
        });
};

function App() {
    const [username, setUsername] = useState('');
    const [tweetData, setTweetData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div className="App">
            <Container justifyitems="center" alignitems="center">
                <div>
                    <img src="logo.svg" width="10%" alt="logo" />
                </div>
                <div>
                    <TextField
                        id="search"
                        label=""
                        variant="standard"
                        value={username}
                        onKeyPress={async (ev) => {
                            if (ev.key === 'Enter') {
                                setLoading(true);
                                let tweetData = false;
                                try {
                                    tweetData = await getTweets(username);
                                    setError(false);
                                } catch (e) {
                                    setError(e);
                                    setLoading(false);
                                }
                                setTweetData(tweetData || {});
                                ev.preventDefault();
                            }
                        }}
                        onInput={({ target }) => {
                            setUsername(target.value);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    @
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <Button
                    variant="contained"
                    onClick={async () => {
                        setLoading(true);
                        let tweetData = false;
                        try {
                            tweetData = await getTweets(username);
                            setError(false);
                        } catch (e) {
                            setError(e);
                            setLoading(false);
                        }
                        setTweetData(tweetData || {});
                    }}
                >
                    fetch
                </Button>
                {loading && (
                    <div>
                        <Lottie
                            options={defaultOptions}
                            height={200}
                            width={200}
                        />
                    </div>
                )}

                {error && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error.message}
                    </Alert>
                )}

                {tweetData.calculatedTweets &&
                    tweetData.calculatedTweets.map((tweet) => {
                        return (
                            <Tweet
                                key={tweet.id}
                                onLoad={() => setLoading(false)}
                                options={{ align: 'center' }}
                                tweetId={tweet.id}
                            />
                        );
                    })}
            </Container>
        </div>
    );
}

export default App;
