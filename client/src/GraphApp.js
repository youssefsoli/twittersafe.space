import './App.css';
import {
    TextField,
    Container,
    InputAdornment,
    IconButton,
    Grid,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import SentimentVerySatisfiedSharpIcon from '@material-ui/icons/SentimentVerySatisfiedSharp';
import SentimentDissatisfiedSharpIcon from '@material-ui/icons/SentimentDissatisfiedSharp';
import { Alert, AlertTitle } from '@material-ui/lab';
import { green, red } from '@material-ui/core/colors';
import { useState } from 'react';
import { Tweet } from 'react-twitter-widgets';
import Lottie from 'react-lottie';
import animationData from './lotties/loading.json';
import Graph from './components/Graph';

const getTweets = async (username) => {
    return fetch(`http://localhost:3000/api/tweets/${username}`)
        .then((res) => res.json())
        .then((tweets) => {
            if (tweets.err) throw new Error(tweets.err);
            return tweets;
        });
};

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

function App() {
    const [username, setUsername] = useState('');
    const [tweetData, setTweetData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tweetLoading, setTweetLoading] = useState(false);
    const [error, setError] = useState(false);
    const [tweetObj, setTweetObj] = useState(false);
    const classes = useStyles();
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
                {!tweetObj.id && (<div>
                    <img
                        src="logo.svg"
                        width="10%"
                        alt="logo"
                        className="logo"
                    />
                </div>)}
                <div>
                    <TextField
                        id="search"
                        label=""
                        variant="standard"
                        value={username}
                        onKeyPress={async (ev) => {
                            if (ev.key === 'Enter') {
                                setTweetObj(false);
                                setTweetData(false);
                                setLoading(true);
                                let tweetData = false;
                                try {
                                    tweetData = await getTweets(username);
                                    setError(false);
                                } catch (e) {
                                    setError(e);
                                }
                                setLoading(false);
                                setTweetData(tweetData || false);
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
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        type="submit"
                                        className={classes.iconButton}
                                        aria-label="search"
                                        onClick={async () => {
                                            setTweetObj(false);
                                            setTweetData(false);
                                            setLoading(true);
                                            let tweetData = false;
                                            try {
                                                tweetData = await getTweets(
                                                    username
                                                );
                                                setError(false);
                                            } catch (e) {
                                                setError(e);
                                            }
                                            setLoading(false);
                                            setTweetData(tweetData || false);
                                        }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                {loading && (
                    <div>
                        <Lottie
                            options={defaultOptions}
                            height={150}
                            width={150}
                        />
                    </div>
                )}

                {error && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error.message}
                    </Alert>
                )}

                {tweetData && (
                    <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="flex-start"
                        spacing={2}
                    >
                        <Grid item xs={2}>
                            <Typography align="left">
                                <SentimentDissatisfiedSharpIcon
                                    fontSize="large"
                                    style={{ color: red[500] }}
                                ></SentimentDissatisfiedSharpIcon>
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography align="center">
                                Tweet Sentiments
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography align="right">
                                <SentimentVerySatisfiedSharpIcon
                                    fontSize="large"
                                    style={{ color: green[500] }}
                                ></SentimentVerySatisfiedSharpIcon>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Graph
                                tweetData={tweetData}
                                setTweetObj={setTweetObj}
                                setTweetLoading={setTweetLoading}
                            />
                        </Grid>
                    </Grid>
                )}

                {tweetLoading && (
                    <div>
                        <Lottie
                            options={defaultOptions}
                            height={100}
                            width={100}
                        />
                    </div>
                )}

                {tweetObj.id && (
                    <>
                        <div>
                            <Alert severity="info">
                                This tweet has a sentiment score of {tweetObj.score.toFixed(2)}, a magnitude of {tweetObj.magnitude.toFixed(2)}, and a sentiment product of {tweetObj.product.toFixed(2)}
                                </Alert>
                        </div>
                        <div>
                        <Tweet
                            onLoad={() => setTweetLoading(false)}
                            options={{ align: 'center' }}
                            tweetId={tweetObj.id}
                        />
                        </div>
                    </>
                )}
            </Container>
        </div>
    );
}

export default App;
