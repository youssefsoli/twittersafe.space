import './App.css';
import {
    TextField,
    Container,
    InputAdornment,
    IconButton,
    Grid,
    Typography,
    Tooltip,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import SentimentVerySatisfiedSharpIcon from '@material-ui/icons/SentimentVerySatisfiedSharp';
import SentimentDissatisfiedSharpIcon from '@material-ui/icons/SentimentDissatisfiedSharp';
import { Alert, AlertTitle } from '@material-ui/lab';
import { green, red } from '@material-ui/core/colors';
import InfoIcon from '@material-ui/icons/Info';
import { useState } from 'react';
import { Tweet } from 'react-twitter-widgets';
import Lottie from 'react-lottie';
import animationData from './lotties/loading.json';
import Graph from './components/Graph';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const getTweets = async (username) => {
    const host =
        process.env.NODE_ENV === 'production'
            ? 'https://twittersafe.space'
            : 'http://localhost:3000';
    return fetch(`${host}/api/tweets/${username}`)
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

const GrayTypography = withStyles({
    root: {
        color: '#d4d4d4',
        'padding-top': 5,
    },
})(Typography);

const BlueTypography = withStyles({
    root: {
        color: '#1ca4f4',
        'padding-top': 30,
    },
})(Typography);

const PTypography = withStyles({
    root: {
        'padding-right': 2,
    },
})(Typography);

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
                {!tweetObj.id && (
                    <div>
                        <img
                            src="logo.svg"
                            width="10%"
                            alt="logo"
                            className="logo"
                        />
                    </div>
                )}
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
                    <div style={{ maxWidth: '1000px', margin: 'auto' }}>
                        <Grid
                            container
                            direction="row"
                            // justify="space-between"
                            alignItems="flex-start"
                            spacing={2}
                        >
                            <Grid item xs={4}>
                                <Typography align="left">
                                    <SentimentDissatisfiedSharpIcon
                                        fontSize="large"
                                        style={{ color: red[500] }}
                                    ></SentimentDissatisfiedSharpIcon>
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <PTypography align="center">
                                    Tweet Sentiments
                                    <Tooltip
                                        title="Sentiments indicate the overall mood of the tweet"
                                        placement="right"
                                    >
                                        <IconButton aria-label="info">
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </PTypography>
                            </Grid>
                            <Grid item xs={4}>
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
                    </div>
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
                    <div style={{ maxWidth: '1000px', margin: 'auto' }}>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="flex-start"
                            spacing={2}
                        >
                            {!tweetLoading && (
                                <Grid item xs={4}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography align="center">
                                                <CircularProgressbar
                                                    value={
                                                        tweetObj.score < 0
                                                            ? tweetObj.score *
                                                              -1
                                                            : tweetObj.score
                                                    }
                                                    text={`${Math.round(
                                                        tweetObj.score * 100
                                                    )}%`}
                                                    minValue={0}
                                                    maxValue={1}
                                                    counterClockwise={
                                                        tweetObj.score < 0
                                                    }
                                                    styles={{
                                                        path: {
                                                            stroke:
                                                                tweetObj.score <
                                                                0
                                                                    ? red[500]
                                                                    : green[500],
                                                        },
                                                        text: {
                                                            fill:
                                                                tweetObj.score <
                                                                0
                                                                    ? red[500]
                                                                    : green[500],
                                                        },
                                                    }}
                                                />
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <GrayTypography
                                                align="center"
                                                variant="h4"
                                            >
                                                Score
                                            </GrayTypography>
                                        </Grid>
                                        {tweetObj.category.length > 0 && (
                                            <>
                                                <Grid item xs={12}>
                                                    <BlueTypography
                                                        align="center"
                                                        variant="h3"
                                                    >
                                                        {
                                                            tweetObj.category
                                                                .substr(1)
                                                                .split('/')[0]
                                                        }
                                                    </BlueTypography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <GrayTypography
                                                        align="center"
                                                        variant="h4"
                                                    >
                                                        Category
                                                    </GrayTypography>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                            <Grid item xs={8}>
                                <Typography align="right">
                                    <Tweet
                                        onLoad={() => setTweetLoading(false)}
                                        options={{ align: 'center' }}
                                        tweetId={tweetObj.id}
                                    />
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                )}
            </Container>
        </div>
    );
}

export default App;
