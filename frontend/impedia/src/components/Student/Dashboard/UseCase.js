import React, { useState } from 'react';
import {
    makeStyles,
    Typography
} from '@material-ui/core';
const useStyles = makeStyles(theme => ({
   useCaseCard:{
    background: "linear-gradient(254.87deg, rgba(255, 30, 86, 0.7524) 1.39%, rgba(255, 164, 27, 0.76) 98.69%)",
    // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    boxShadow:" rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
    borderRadius: "15px",
    textAlign:"center",
    width:"250px",
    padding:"20px 10px",
    marginBottom:"20px",
    userSelect:"none",
    cursor:"pointer",
    height:"100px"
   },
   useCaseIcon:{
       width:"50px",
       height:"50px"
   },
   useCaseText:{
       color:"#fff",
       fontWeight:"600",
       width:"50%",
       whiteSpace:"wrap",
       margin:"8px auto 0",
       fontSize:"18px",
       lineHeight:"1"
   }
}));

const UseCase = (props) => {
    const classes = useStyles();

    return(
        <div className={classes.useCaseCard}>
            <img src={props.icon} alt="admin-usecase" className={classes.useCaseIcon} />
            <Typography className={classes.useCaseText} >
                {props.type}
            </Typography>
        </div>
    )
}

export default UseCase;