import React from 'react';
import {
    makeStyles,
    Collapse,
    IconButton
} from '@material-ui/core';
import {
    Alert,
    AlertTitle
} from '@material-ui/lab';
import {
    Close as CloseIcon
 } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    Alert:{
        width:"80vw",
        position:"fixed",
        top:"5%",
        margin:"auto",
        left:"10vw",
        zIndex:"100"
    }
}));

const SuccessAlert = ({open, message, setOpen}) => {
    const classes = useStyles();
    return (
    <div className={classes.Alert}>
        <Collapse in={open}>
            <Alert
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setOpen(false);
                }}
                >
                <CloseIcon fontSize="inherit" />
                </IconButton>
            }
            severity="success"
            variant="filled"
            >
            <AlertTitle><strong>Success !</strong></AlertTitle>
                {message}
            </Alert>
        </Collapse>
    </div>  )  
}

export  default SuccessAlert;

