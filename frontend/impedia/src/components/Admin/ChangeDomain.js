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
import TopBar from '../TopBar/TopBar';


const useStyles = makeStyles(theme => ({
    setDomainPage:{
        margin: "2% 0"
    },
    Domainbody:{
        display:"flex",
        width:"90%",
        margin:"5% auto",
        [theme.breakpoints.down("sm")]:{
            flexDirection:"column",
            margin:"15% auto",
        }
    },
    group:{
        background:"red"
    },
    domainArea:{
        flex:"50%",
        display:"flex",
        flexWrap:"wrap",
        alignItems:"center"
    },
    domainTextArea:{
        flex:"100%",
        display:"flex",
        alignItems:"center",
    },
    textField:{
        width: "90%",
        margin:"auto 5%",
    },
    domainIcon:{
        width:"100px",
        backgroundColor:"#FFAC41",
        padding:"20px",
        borderRadius:"25px",
        [theme.breakpoints.down("md")]:{
           width:"50px"
        }
    },
    button:{
        margin:"auto",
        [theme.breakpoints.down("sm")]:{
            margin:"2% auto"
         }
    },
    submitButton:{
        background: "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
        width:"200px",
        fontWeight:"800",
        padding:"5%",
        fontSize:"16px"
    },
    sidePic:{
        flex:"50%",
        textAlign:"center",
        [theme.breakpoints.down("sm")]:{
            margin:"5% auto"
        }
    },
    domainPic:{
        maxWidth:"100%"
    },
    labelColor:{
        color:"rgb(244, 67, 54)"
    },
    formWrapper:{
        width:"100%"
    }

}));

const ChangeDomain = () => {
    const classes = useStyles();

    const re = new RegExp(/^(((?!-))(xn--|_{1,1})?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/); 

    const [DomainValues, setDomainValues] = React.useState('');
    const [validDomain, setValidDomain] = React.useState(true);

    const handleDomainChange = (e) => {
        setDomainValues(e.target.value);
        setValidDomain(DomainValues.match(re));
    }

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            domain: DomainValues,
        }

        if(!validDomain){
            return;
        }

        const AdminToken = localStorage.getItem("key");
        const config = {
            headers: {
              authorization: AdminToken,
            }
        }

        axios.post('/admin/setemaildomain',body,config)
        .then((res)=>{
            console.log(res);
            if(res.status === 200 || res.status === 201){
                alert("Domain Name Changed")
            }else{
                alert("Failed")
            } 
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    return (
        <>
            <div className={classes.setDomainPage}>
                <TopBar useCase="Set Domain" />

                <div className={classes.Domainbody}>
                    <div className={classes.domainArea}>
                        <div className={classes.domainTextArea}>
                                <div className={classes.icon} >
                                    <img src={domainIcon} alt="doamin" className={classes.domainIcon} />
                                </div>
                                <TextField
                                    className={classes.textField}
                                    error
                                    id="filled-error-helper-text"
                                    label="Domain Name"
                                    variant="filled"
                                    value={DomainValues}
                                    helperText={!validDomain && "Not a valid Domain"}
                                    onChange={handleDomainChange}
                                />
                        </div>
                        <div className={classes.button}>
                            <Button variant="contained" className={classes.submitButton} onClick={submitFunction}>
                                UPDATE
                            </Button>
                        </div>
                    </div>
                    

                    <div className={classes.sidePic}>
                        <img src={DomainPic} className={classes.domainPic} alt="Set/Update Domain" />
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default ChangeDomain;