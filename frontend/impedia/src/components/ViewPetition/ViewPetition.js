import React,{ useState , useEffect} from 'react';
import {
    makeStyles,
    Button,
    Typography,
    TextField
} from '@material-ui/core';
import axios from 'axios';
import ImpediaLogo from '../../assets/Logo-Impedia.png';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    
}));

const ViewPetition = (props) => {

    const appealId = props.routerProps.match.params.id;
    
    return (
        <>
            Hello
        </>
    )
}

export default ViewPetition;