import React from 'react';
import {
    makeStyles,
    Button,
    Typography,
    TextField
} from '@material-ui/core';
import axios from 'axios';
import ImpediaLogo from '../../assets/Logo-Impedia.png';
import DomainPic from '../../assets/Admin/domainPic.svg';
import domainIcon from '../../assets/Admin/domainIcon.svg';


const useStyles = makeStyles(theme => ({
    topbar:{
        display:"flex",
        alignContent:"center",
        alignItems:"center",
        [theme.breakpoints.down("xs")]:{
            flexDirection:"column"
        }
    },
    logo:{
        margin:"auto 5%",
        flex:"40%",
    },
    logoSubtext:{
        marginLeft:"80px",
        letterSpacing:"3px",
        fontSize:"15px",
        fontWeight:"600",
        marginTop:"-10px"
    },
    logoImg:{
        width: "250px"
    },
    heading:{
        flex:"60%",
        textAlign:"center",
        background:" linear-gradient(87.74deg, #FFAC41 4.75%, #FF1E56 140.54%)",
        padding:"1.5%",
        borderRadius:"30px 0 0 30px",
        [theme.breakpoints.down("sm")]:{
            width:"85%",
            marginLeft:"auto",
            marginTop:"10%"
        }
    },
    headingText:{
        fontWeight:"800",
        fontSize:"30px",
        color:"white",
        userSelect:"none"
    }
}));

const TopBar = (props) => {
    const classes = useStyles();

    
    return (
        <>
                <div className={classes.topbar}>
                    <div className={classes.logo}>
                        <img className={classes.logoImg} src={ImpediaLogo} alt="Impedia Logo" />
                        <Typography className={classes.logoSubtext}>
                            FOR {props.actor}
                        </Typography>
                    </div>

                    <div className={classes.heading}>
                        <Typography className={classes.headingText}>
                            {props.useCase}
                        </Typography>
                    </div>
                </div>
        </>
    )
}

export default TopBar;