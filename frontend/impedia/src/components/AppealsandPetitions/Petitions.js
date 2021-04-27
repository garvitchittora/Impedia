import React from 'react';
import {
    makeStyles,
    Typography
} from '@material-ui/core';
import UpvoteIcon from '@material-ui/icons/ThumbUp';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown/with-html';
import gfm from 'remark-gfm';

const useStyles = makeStyles(theme => ({
    container:{
        display:"flex",
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"space-evenly"
    },
    apCard:{
        // width:"45%",
        borderRadius:"30px",
        margin:"5% auto",
        paddingBottom:"30px",
        cursor:"pointer",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        '&:hover':{
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
        },
        [theme.breakpoints.up("sm")]:{
            width:"40vw"
        },
        [theme.breakpoints.down("sm")]:{
            width:"90vw"
        }
    },
    titleSection:{
        backgroundColor:"rgba(255,164,27,0.75)",
        fontSize:"35px",
        fontWeight:"600",
        padding:"30px 30px",
        borderRadius:"30px 30px 0 0",
        textAlign:"center",
        overflow:"hidden",
        whiteSpace:"nowrap",
        textOverflow:"ellipsis"
    },
    mentions:{
        padding:"10px",
        fontSize:"18px",
        textAlign:"center",
        fontWeight:"600",
        letterSpacing:"2px",
        [theme.breakpoints.down("md")]:{
        }
    },
    red:{
        color:"#FF1E56",
    },
    body:{
        width:"90%",
        margin:"30px auto",
        padding:"20px",
        backgroundColor:"#f9f6f7",
        borderRadius:"20px",
    },
    cont:{
        height:"250px",
        overflow:"scroll",
    },
    dateSection:{
        width:"90%",
        margin:"auto",
        display:"flex",
        justifyContent:"flex-end"
    },
    date:{
        backgroundColor: "#EAE9E9",
        borderRadius:"20px",
        padding:"10px 30px",
        fontWeight:"600"
    },
    link:{
        textDecoration:"none",
        textTransform:"none",
        color:"inherit"
    },
    petnextras:{
        marginTop:"20px",
        width:"90%",
        margin:"auto",
        display:"flex",
        fontWeight:"600",
        justifyContent:"space-between"
    },
    upvotes:{
        display:"flex",
        alignItems:"center",
        padding:"5px 30px",
        borderRadius:"20px",
        background: "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)"
    },
    status:{
        display:"flex",
        alignItems:"center",
        padding:"5px 30px",
        borderRadius:"20px",
        background: "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
        letterSpacing:"3px"
    }
}));

const Petitions = (props) => {

    const classes = useStyles();

    const Card = (ap, ind) => {
        console.log(ap);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return (
            <Link to={`/petitions/${ap.id}`} className={classes.link}>
            <div className={classes.apCard} key={ind} >
                <div className={classes.titleSection} >
                    {ap.title}
                </div>
                <div className={classes.mentions} >
                    <span className={classes.red}>FROM : </span> {`${ap.petitionFromId.name} | ${ap.petitionFromId.email}`}
                </div>
                <div className={classes.mentions} >
                    <span className={classes.red}>TO : </span> {ap.petitionToId.name}
                </div>
                <div className={classes.body} >
                    <ReactMarkdown plugins={[gfm]} allowDangerousHtml children={ap.content} className={classes.cont}/>
                </div>
                <div className={classes.dateSection} >
                    <div className={classes.date} >
                        {new Date(ap.dateTime).toLocaleDateString('en-US',options)}
                    </div>
                </div>
                <div className={classes.petnextras} >
                    <div className={classes.upvotes} >
                        <UpvoteIcon /> &nbsp; {ap.signees.length}
                    </div>
                    <div className={classes.status} >
                        PENDING
                    </div>
                </div>
            </div>
            </Link>
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

export default Petitions;