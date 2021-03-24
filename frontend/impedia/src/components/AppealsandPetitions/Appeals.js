import React,{ useState , useEffect} from 'react';
import {
    makeStyles,
    Button,
    Typography,
    TextField
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown/with-html';
import gfm from 'remark-gfm';

const useStyles = makeStyles(theme => ({
    container:{

    },
    apCard:{
        backgroundColor:"rgba(255,164,27,0.75)",
        display:"flex",
        flexDirection:"column",
        padding:"20px 20px",
        borderRadius:"15px",
        margin:"5% auto"
    },
    mentions:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        width:"80%",
        margin:"auto",
        fontSize:"20px"
    },
    mentionHelper:{
        color:"black",
        fontWeight:"600"
    },
    from:{
        fontWeight:"600",
        fontSize:"18px"
    },
    to:{
        fontWeight:"600",
        fontSize:"18px"
    },
    body:{
        width:"90%",
        margin:"30px auto",
        padding:"20px",
        backgroundColor:"#f9f6f7",
        borderRadius:"20px",
    },
    title:{
        fontSize:"25px",
        fontWeight:"600"
    },
    cont:{
        height:"200px",
        overflow:"scroll",
    },
    status:{
        width:"auto",
        margin:"auto",
        padding:"15px 20px",
        background: "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
        borderRadius:"10px"
    },
    statusText:{
        fontWeight:"800"
    },
    dateTime:{
        fontWeight:"600",
        width:"95%",
        textAlign:"right",
        marginTop:"-10px"
    }
}));

const Appeals = (props) => {

    const classes = useStyles();

    const Card = (ap, ind) => {
        return (
            <div className={classes.apCard} key={ind} >
                <div className={classes.mentions}>
                    <Typography className={classes.from} color="secondary">
                        <span className={classes.mentionHelper}>FROM:</span> {ap.appealFromId}
                    </Typography>
                    <Typography className={classes.to} color="secondary">
                    <span className={classes.mentionHelper}>TO:</span> {ap.appealToId}
                    </Typography>
                </div>
                <div className={classes.body}>
                    <Typography className={classes.title}>
                        {ap.title}
                    </Typography>
                    <ReactMarkdown plugins={[gfm]} allowDangerousHtml children={ap.content} className={classes.cont}/>
                </div>
                <div className={classes.dateTime}>
                        {new Date(ap.dateTime).toLocaleString("en-US")}
                </div>
                <div className={classes.status}>
                    <Typography className={classes.statusText}>
                        STATUS : PENDING
                    </Typography>
                </div>
            </div>
        )
    }
    
    return (
        <>
            <div className={classes.container}>
                {props.data.map(Card)}
            </div>
        </>
    )
}

export default Appeals;