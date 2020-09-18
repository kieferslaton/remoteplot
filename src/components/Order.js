import React, { useState } from 'react'
import {TableRow, TableCell, IconButton, Collapse} from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa'
import Address from './Address'
import axios from 'axios'

const url = process.env.REACT_APP_URL

const Order = ({ order }) => {
    const [open, setOpen] = useState(false)

    const updateOrder = (index, labelUrl, tracking) => {
        let shipClone = order.ship
        shipClone[index].labelUrl = labelUrl
        shipClone[index].tracking = tracking
        axios.post(`${url}/orders/update/${order._id}`, {...order, ship: shipClone}).then(res => console.log(res)).catch(err => console.log(err))
    }

    return(
        <>
        <TableRow>
            <TableCell>
                <IconButton size="small" onClick={() => setOpen(!open)}>
                    {open ? <FaChevronCircleUp size={20} /> : <FaChevronCircleDown size={20} />}
                </IconButton>
            </TableCell>
            <TableCell>{order.orderNumber}</TableCell>
            <TableCell>{order.billingDetails.name}</TableCell>
            <TableCell>{order.ship.filter(addr => addr.tracking).length === order.ship.length ? "Yes" : "No"}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell colSpan={4} style={{padding: 0}}>
                <Collapse in={open} unmountOnExit>
                    {order.ship.map((addr, index) => (
                        <Address addr={addr} from={order.billingDetails} index={index} key={index} updateOrder={updateOrder}/>
                    ))}
                </Collapse>
            </TableCell>
        </TableRow>
        </>
    )
}

export default Order