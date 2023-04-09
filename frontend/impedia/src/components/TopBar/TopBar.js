import React,{ useState , useEffect} from 'react';
import {
    makeStyles,
    Typography
} from '@material-ui/core';
import ImpediaLogo from '../../assets/Logo-Impedia.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
        letterSpacing:"3px",
        fontSize:"12px",
        fontWeight:"600",
        textAlign:"center",
    },
    logoImg:{
        maxWidth: "250px",
        maxHeight: "150px",
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
    },
    linkTag: {
        textDecoration: "none",
        color: "inherit",
        display: "grid",
        justifyContent: "center",
    }
}));

const TopBar = (props) => {
    const classes = useStyles();
    const [link, setLink] = useState();

    useEffect(() => {
        if(props.actor === "STUDENT"){
            setLink("/member/dashboard");
        }else if(props.actor === "ADMIN"){
            setLink("/admin/dashboard");
        }else{
            setLink("/authority/dashboard");
        }
    },[props.actor]);
    
    const [dynamicLogo, setDynamicLogo] = useState(ImpediaLogo);
    const AdminToken = localStorage.getItem("key");
    const config = {
      headers: {
        authorization: AdminToken,
      },
    };
    axios.get('/organization/get', config).then(res=>{
      if(res && res.data && res.data.logo){
        setDynamicLogo(res.data.logo);
      }
    });

    return (
        <>
                <div className={classes.topbar}>
                    <div className={classes.logo}>
                        <Link to={link} className={classes.linkTag}>
                            <img className={classes.logoImg} src={dynamicLogo} alt="Impedia Logo" />
                            <Typography className={classes.logoSubtext}>
                                FOR {props.actor == "STUDENT" ? "MEMBER" : props.actor}
                            </Typography>
                        </Link>
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