import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    Button,
} from '@material-ui/core'
import {useHistory} from 'react-router-dom'
import ImpediaLogo from '../assets/Logo-Impedia.png';
import Error from '../assets/404.svg';

const useStyles = makeStyles((theme) => ({
    logo:{
        width:"90vw",
        maxWidth: "400px",
        display:"block",
        margin: "30px auto"
    },
    grid:{
        display:"flex",
        flexDirection:"row",
        [theme.breakpoints.down("md")]:{
            flexDirection: "column-reverse"
        }
    },
    col2:{
        flex:"40%",
        textAlign:"center"
    },
    error:{
        flex:"50%",
    },
    title:{
        fontSize:"60px"
    },
    desc:{
        fontSize:"40px",
        fontStyle: "italic"
    },
    button:{
        fontSize:"20px",
        letterSpacing: "3px"
    },
    buttonContainer:{
        // width:""
        margin:"20% auto",
        textAlign:"center"
    }
  }));

const Error404 = () => {
    const classes = useStyles();
    const history = useHistory();
    
    return (
        <div>
            <img 
                src={ImpediaLogo}
                className={classes.logo} 
                alt="impedia"
            /> 
            <div className={classes.grid} >
                <img 
                    src={Error}
                    className={classes.error} 
                    alt="404"
                /> 
                <div className={classes.col2}>
                    <h3 className={classes.desc}> "Not all those who wander are lost ..." </h3>
                    <h1 className={classes.title}> But you are !</h1>
                    <div className={classes.buttonContainer} >
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            className={classes.button}
                            onClick={() => {history.push("/")}}
                        >
                            BACK TO HOME
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error404;