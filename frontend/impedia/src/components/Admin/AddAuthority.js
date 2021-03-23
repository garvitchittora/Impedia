import React from 'react';
import {
    makeStyles,
    Button,
    Typography,
    FormControl,
    InputLabel,
    FilledInput,
    TextField
} from '@material-ui/core';
import axios from 'axios';
import ImpediaLogo from '../../assets/Logo-Impedia.png';
import DomainPic from '../../assets/Admin/addAuthoritiesPage.svg';
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

const StudentRegister = () => {
    const classes = useStyles();

    const [EmailValues, setEmailValues] = React.useState('');

    const handleChange = (event) => {
        if (event.target.name === "email") {
            setEmailValues(event.target.value);
        }
    }

    const submitFunction = async (e) => {
        e.preventDefault();
        
        let emailArray = EmailValues.replaceAll(" ","").split(",");

        const body = {
            emailIds: emailArray,
        }
        const AdminToken = localStorage.getItem("key");
        const config = {
            headers: {
              authorization: AdminToken,
            }
        }

        axios.post(`/admin/addauthorities`,body,config)
        .then((res)=>{
            console.log(res);
            if(res.status === 200 || res.status === 201){
                alert("Authorities added Successfully")
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
                <TopBar useCase="Add Authority" />

                <div className={classes.Domainbody}>
                    <div className={classes.domainArea}>
                        <div className={classes.formWrapper}>
                            <div className={classes.domainTextArea}>
                                <div className={classes.icon} >
                                    <img src={domainIcon} alt="doamin" className={classes.domainIcon} />
                                </div>
                                    <TextField
                                        error
                                        id="email"
                                        name="email"
                                        label="Emails"
                                        variant="filled"
                                        onChange={handleChange}
                                        multiline
                                        rows={4}
                                        helperText="for multiple emails type emails separate by comma (,)"
                                        className={classes.textField}
                                    />
                            </div>
                        </div>
                        
                        <div className={classes.button}>
                            <Button variant="contained" className={classes.submitButton} onClick={submitFunction}>
                                ADD
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

export default StudentRegister;