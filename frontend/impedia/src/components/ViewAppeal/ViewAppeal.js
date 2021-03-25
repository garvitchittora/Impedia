import React from 'react';
import {
    makeStyles
} from '@material-ui/core';
import axios from 'axios';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    
}));

const ViewAppeal = (props) => {

    const appealId = props.routerProps.match.params.id;
    
    return (
        <>
            Hello
        </>
    )
}

export default ViewAppeal;