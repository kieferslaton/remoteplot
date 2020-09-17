import React, { useEffect, useState } from 'react'
import { Container, Grid, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

import Order from './Order'

const useStyles = makeStyles((theme) => ({
    row: {
      justifyContent: "center",
    },
    card: {
      maxWidth: 1200,
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

const url = process.env.REACT_APP_URL

const Ship = () => {
    const classes = useStyles()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        axios.get(`${url}/orders`).then(res => setOrders(res.data)).catch(err => console.log(err))
    }, [])

    return(
        <Container className="container">
            <Grid container className={classes.card} style={{margin: '0 auto'}}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>
                                    Order Number
                                </TableCell>
                                <TableCell>
                                    Customer Name
                                </TableCell>
                                <TableCell>
                                    Complete
                                </TableCell>
                            </TableRow>
                        </TableHead>
                            <TableBody>
                                {orders.map(order => (
                                    <Order order={order} />
                                ))}
                            </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Container>
    )
}

export default Ship