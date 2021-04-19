import React, { useState, useEffect } from 'react';
import {
    makeStyles,
    Typography
} from '@material-ui/core';
import LogOutIcon from '@material-ui/icons/PowerSettingsNew';
import ImpediaLogo from '../../../assets/Logo-Impedia.png';
import DashBoardLine from '../../../assets/Admin/dashboardLine.svg';
import Recents from '../../Recents/Recents';
import UseCase from './UseCase';
import AddAuthIcon from '../../../assets/Admin/addAuth.svg';
import DomainIcon from '../../../assets/Admin/domainIcon.svg';
import MakeGroupIcon from '../../../assets/Admin/makeGroup.svg';
import AppealIcon from '../../../assets/Admin/appealIcon.svg';
import PetitionIcon from '../../../assets/Admin/petitionIcon.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import  { useHistory} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    dashboardPage:{
        width:"95%",
        margin:"1% auto"
    },
    dashTopBar:{
        display:"flex",
        alignItems:"center"
    },
    logo:{
        width:"250px"
    },
    logoAdmin:{
        flex:"20%",
        display:"flex",
        flexDirection:"column",
    },
    logoForAdmin:{
        marginLeft:"80px",
        letterSpacing:"3px",
        fontSize:"12px",
        fontWeight:"600",
        marginTop:"-10px",
        userSelect:"none"
    },
    dashboardText:{
        flex:"80%",
        fontSize:"25px",
        fontWeight:"800",
        letterSpacing:"8px",
        textAlign:"center",
        color:"#133B5C",
        [theme.breakpoints.down("xs")]:{
            display:"none"
        }
    },
    dashboardTextForMobile:{
        display:"none",
        flex:"80%",
        fontSize:"25px",
        fontWeight:"800",
        letterSpacing:"8px",
        textAlign:"center",
        color:"#133B5C",
        margin:"5% 0 0",
        [theme.breakpoints.down("xs")]:{
            display:"block"
        }
    },
    logoutButton:{
        flex:"20%",
        color:"#FF1E56",
        fontSize:"18px",
        fontWeight:"600",
        display:"flex",
        alignItems:"center",
        justifyContent:"flex-end",
        zIndex:"1000",
        letterSpacing:"4px",
        [theme.breakpoints.down("xs")]:{
            marginRight:"20px"
        }
    },
    logoutText:{
        display:"inline",
        fontWeight:"600",
        fontSize:"15px",
        letterSpacing:"3px",
        zIndex:"1000",
    },
    dashLine:{
        position:"relative",
        left:"0",
        marginTop:"-50px",
        marginLeft:"-5%",
        width:"100vw",
        [theme.breakpoints.down("xs")]:{
            marginTop:"0"
        }
    },
    recentsHeading:{
        fontSize:"15px",
        fontWeight:"800",
        textAlign:"center",
        margin:"8px 0",
        letterSpacing:"5px"
    },
    dashBoardBody:{
        display:"flex",
        justifyContent:"space-between",
        [theme.breakpoints.down("sm")]:{
            display:"block"
        }
    },
    recents:{
        // width:"20%",
        backgroundColor:"rgba(255,164,27,0.8)",
        padding:"1% 2% 2%",
        borderRadius:"15px",
        flex:"20%",
        maxWidth:"300px",
        // maxHeight:"60vh",
        [theme.breakpoints.down("sm")]:{
            maxWidth:"95%",
            margin:"20px auto",
            padding:"10px 20px 20px",
        },
        [theme.breakpoints.down("xs")]:{
            maxWidth:"100%"
        }
    },
    bodyRight:{
        flex:"70% !important",
        maxWidth: "1000px"
    },
    adminButtons:{
        display:"flex",
        flexWrap:"wrap",
        justifyContent:"space-around"
    },
    link:{
        textTransform:"none",
        textDecoration: "none",
        color:"inherit"
    }
}));

const Dashboard = () => {
    const classes = useStyles();
    const [AppealsPetitions, setAppealsPetitions] = useState([]);
    const [cookies] = useCookies(['user'])
    const history = useHistory();

    useEffect(() => {
            if(! cookies.user || cookies.user["type"] !== "ADMIN"){
                return history.push("/login/admin");
            }

            const Token = cookies.user['key'];
            const config = {
                headers: {
                  authorization: Token,
                }
            }
            axios.get("/admin/appealspetitions", config)
            .then(res=>res.data)
            .then(data=>{
                setAppealsPetitions(data);
            })
    }, []);

    return(
        <div className={classes.dashboardPage}>
            <div className={classes.dashTopBar}>
                <div className={classes.logoAdmin}>
                    <img src={ImpediaLogo} alt="Impedia" className={classes.logo} />

                    <Typography className={classes.logoForAdmin}>
                        FOR ADMIN
                    </Typography>
                </div>

                <Typography className={classes.dashboardText}>
                    DASHBOARD
                </Typography>
                
                <Link to="/logout" className={classes.link}>
                    <div className={classes.logoutButton} >
                        <LogOutIcon />
                        <Typography className={classes.logoutText}>
                            Logout
                        </Typography>
                    </div>
                </Link>
                
            </div>
            {/* Dashboard Text for Mobile Screens */}
            <Typography className={classes.dashboardTextForMobile}>
                    DASHBOARD
            </Typography>
            <img src={DashBoardLine} alt="dash-line" className={classes.dashLine} />

            <div className={classes.dashBoardBody}>
                <div className={classes.recents}>
                    <Typography className={classes.recentsHeading}>
                        RECENT
                    </Typography>

                    <Recents type="APPEALS" data={AppealsPetitions.appeals || []} />
                    <Recents type="PETITIONS" data={AppealsPetitions.petitions || []} />
                </div>

                <div className={classes.bodyRight}>
                    <div className={classes.adminButtons} >
                        <Link to="/admin/addauthority" className={classes.link}>
                            <UseCase icon={AddAuthIcon} type="Add Authority" />
                        </Link>
                        <Link to="/admin/changedomain" className={classes.link}>
                            <UseCase icon={DomainIcon} type="Set Domain" />
                        </Link>
                        <Link to="/admin/groups/edit" className={classes.link}>
                            <UseCase icon={MakeGroupIcon} type="Edit Groups" />
                        </Link> 
                        <Link to="/admin/groups/add" className={classes.link}>
                            <UseCase icon={MakeGroupIcon} type="Make Group" />
                        </Link>
                        <Link to="/admin/appeals" className={classes.link}>
                            <UseCase icon={AppealIcon} type="Appeals" />
                        </Link>
                        <Link to="/admin/petitions" className={classes.link}>
                            <UseCase icon={PetitionIcon} type="Petitions" />
                        </Link>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Dashboard;