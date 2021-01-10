import './App.css';
import { TextField, Grid } from '@material-ui/core';
import { useState } from 'react';

function App() {
    const [value, setValue] = useState('');
    return (
        <div className="App">
            <Grid container spacing={1} alignItems="center" justify="center">
                <Grid item>@</Grid>
                <Grid item>
                    <TextField
                        id="search"
                        label=""
                        variant="standard"
                        value={value}
                        onInput={({ target }) => {
                            setValue(target.value);
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default App;
