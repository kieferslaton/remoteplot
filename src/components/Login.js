import React, { useState } from 'react'
import { Container, Button, TextField, Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    row: {
      justifyContent: "center",
    },
    card: {
      maxWidth: 400,
      padding: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1),
      },
    },
    paper: {
      border: "1px solid #d3d3d3",
      padding: theme.spacing(2),
      justifyContent: "center",
      borderRadius: 0,
    },
    inputLine: {
      display: "flex",
      margin: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(2),
    }, 
  }));

const Login = ({handleLogin}) => {
    const classes = useStyles()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <Container className="container">
            <Grid container className={classes.row}>
            <Grid item xs={12} className={classes.card}>
            <Paper className={classes.paper}>
            <form onSubmit={(e) => {
               e.preventDefault()
               handleLogin(username, password)
            }}>
                <h2>Sign In</h2>
                <TextField  style={{margin: '5px 0'}} variant="outlined" fullWidth type="text" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)}/>
                <TextField style={{margin: '5px 0'}} variant="outlined" fullWidth type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
                <Button style={{margin: '15px 0'}} variant="outlined" color="primary" fullWidth type="submit">Log In</Button>
            </form>
            </Paper>
            </Grid>
            </Grid>
        </Container>
    )
}

export default Login