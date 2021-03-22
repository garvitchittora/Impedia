import React from 'react';
import {
    makeStyles,
    Button,
    Typography,
    FormControl,
    InputLabel,
    FilledInput,
} from '@material-ui/core';
import axios from 'axios';
import ImpediaLogo from '../../assets/Logo-Impedia.png';
import DomainPic from '../../assets/Admin/domainPic.svg';
import domainIcon from '../../assets/Admin/domainIcon.svg';


const useStyles = makeStyles(theme => ({
    setDomainPage:{
        margin: "2% 0"
    },
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
        [theme.breakpoints.down("xs")]:{
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
    Domainbody:{
        display:"flex",
        width:"90%",
        margin:"5% auto",
        [theme.breakpoints.down("xs")]:{
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
        [theme.breakpoints.down("xs")]:{
           width:"50px"
        }
    },
    button:{
        margin:"auto"
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
        [theme.breakpoints.down("xs")]:{
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
                <div className={classes.topbar}>
                    <div className={classes.logo}>
                        <img className={classes.logoImg} src={ImpediaLogo} alt="Impedia Logo" />
                        <Typography className={classes.logoSubtext}>
                            FOR ADMIN
                        </Typography>
                    </div>

                    <div className={classes.heading}>
                        <Typography className={classes.headingText}>
                            Add Authority
                        </Typography>
                    </div>
                </div>

                <div className={classes.Domainbody}>
                    <div className={classes.domainArea}>
                        <div className={classes.formWrapper}>
                            <div className={classes.domainTextArea}>
                                <div className={classes.icon} >
                                    <img src={domainIcon} alt="doamin" className={classes.domainIcon} />
                                </div>
                                <FormControl variant="filled" className={classes.textField}>
                                    <InputLabel htmlFor="email" className={classes.labelColor}>
                                        Emails
                                    </InputLabel>

                                    <FilledInput
                                        id="email"
                                        name="email"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                                
                            <div>
                                <p>* for multiple emails type emails separate by comma (,)</p>
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