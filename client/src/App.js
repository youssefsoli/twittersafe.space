import './App.css';
import {
    TextField,
    Container,
    InputAdornment,
    Button,
} from '@material-ui/core';
import { useState } from 'react';
import { Tweet } from 'react-twitter-widgets';
import Lottie from 'react-lottie';
import animationData from './lotties/loading.json';

const getTweets = async (username) => {
    return fetch(`http://localhost:3000/api/tweets/${username}`)
        .then((res) => res.json())
        .then((tweets) => tweets);
};

function App() {
    const [username, setUsername] = useState('');
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
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
                        setTweets((await getTweets(username)).calculatedTweets);
                    }}
                >
                    fetch
                </Button>
                {loading && (
                    <div>
                        <Lottie
                            options={defaultOptions}
                            height={400}
                            width={400}
                        />
                    </div>
                )}

                {tweets.length &&
                    tweets.map((tweet) => {
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
