import React, { useEffect, useState } from 'react';
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
import AppealIcon from '../../../assets/Admin/appealIcon.svg';
import PetitionIcon from '../../../assets/Admin/petitionIcon.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    dashboardPage: {
        width: "95%",
        margin: "1% auto"
    },
    dashTopBar: {
        display: "flex",
        alignItems: "center"
    },
    logo: {
        width: "250px"
    },
    logoAdmin: {
        flex: "20%",
        display: "flex",
        flexDirection: "column",
    },
    logoForAdmin: {
        marginLeft: "80px",
        letterSpacing: "3px",
        fontSize: "12px",
        fontWeight: "600",
        marginTop: "-10px",
        userSelect: "none"
    },
    dashboardText: {
        flex: "80%",
        fontSize: "25px",
        fontWeight: "800",
        letterSpacing: "8px",
        textAlign: "center",
        color: "#133B5C",
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    dashboardTextForMobile: {
        display: "none",
        flex: "80%",
        fontSize: "25px",
        fontWeight: "800",
        letterSpacing: "8px",
        textAlign: "center",
        color: "#133B5C",
        margin: "5% 0 0",
        [theme.breakpoints.down("xs")]: {
            display: "block"
        }
    },
    logoutButton: {
        flex: "20%",
        color: "#FF1E56",
        fontSize: "18px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        letterSpacing: "4px",
        [theme.breakpoints.down("xs")]: {
            marginRight: "20px"
        }
    },
    logoutText: {
        display: "inline",
        fontWeight: "600",
        fontSize: "15px",
        letterSpacing: "3px"
    },
    dashLine: {
        position: "relative",
        left: "0",
        marginTop: "-50px",
        marginLeft: "-5%",
        width: "100vw",
        [theme.breakpoints.down("xs")]: {
            marginTop: "0"
        }
    },
    recentsHeading: {
        fontSize: "15px",
        fontWeight: "800",
        textAlign: "center",
        margin: "8px 0",
        letterSpacing: "5px"
    },
    dashBoardBody: {
        display: "flex",
        justifyContent: "space-between",
        [theme.breakpoints.down("sm")]: {
            display: "block"
        }
    },
    recents: {
        // width:"20%",
        backgroundColor: "rgba(255,164,27,0.8)",
        padding: "1% 2% 2%",
        borderRadius: "15px",
        flex: "20%",
        maxWidth: "300px",
        // maxHeight:"60vh",
        [theme.breakpoints.down("sm")]: {
            maxWidth: "95%",
            margin: "20px auto",
            padding: "10px 20px 20px",
        },
        [theme.breakpoints.down("xs")]: {
            maxWidth: "100%"
        }
    },
    bodyRight: {
        flex: "70% !important",
        maxWidth: "1000px"
    },
    adminButtons: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
    link: {
        textTransform: "none",
        textDecoration: "none",
        color: "inherit"
    }
}));

const Dashboard = () => {
    const classes = useStyles();
    const [appeals, setAppeals] = useState([]);
    const [petitions, setPetitions] = useState([]);

    useEffect(async () => {
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                  authorization: AdminToken,
                }
            }
            const res = await axios.get("/student/appeals", config)
            const dataGroups = res.data;


            setAppeals(() => {
                return dataGroups.map((option) => {
                    return option;
                })
            });
    }, []);

    useEffect(async () => {
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                  authorization: AdminToken,
                }
            }
            const res = await axios.get("/student/petitions", config)
            const dataGroups = res.data;
            console.log(dataGroups);

            setPetitions(() => {
                return dataGroups.map((option) => {
                    return option;
                })
            });
    }, []);

    return (
        <div className={classes.dashboardPage}>
            <div className={classes.dashTopBar}>
                <div className={classes.logoAdmin}>
                    <Link to="#" className={classes.link}>
                        <img src={ImpediaLogo} alt="Impedia" className={classes.logo} />

                        <Typography className={classes.logoForAdmin}>
                            FOR STUDENT
                        </Typography>
                    </Link>
                </div>

                <Typography className={classes.dashboardText}>
                    DASHBOARD
                </Typography>

                <div className={classes.logoutButton} >
                    <LogOutIcon />
                    <Typography className={classes.logoutText}>
                        Logout
                        </Typography>
                </div>

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

                    <Recents type="APPEALS" data={appeals} />
                    <Recents type="PETITIONS" data={petitions} />
                </div>

                <div className={classes.bodyRight}>
                    <div className={classes.adminButtons} >
                        <Link to="/UpdateProfile" className={classes.link}>
                            <UseCase icon={AddAuthIcon} type="Update Profile" />
                        </Link>
                        <Link to="/petition/view" className={classes.link}>
                            <UseCase icon={PetitionIcon} type="View Petitions" />
                        </Link>
                        <Link to="/appeals/view" className={classes.link}>
                            <UseCase icon={AppealIcon} type="View Appeals" />
                        </Link>
                        <Link to="/appeals/create" className={classes.link}>
                            <UseCase icon={AppealIcon} type="Create Appeals" />
                        </Link>
                        <Link to="/petitions/create" className={classes.link}>
                            <UseCase icon={PetitionIcon} type="Create Petitions" />
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard;