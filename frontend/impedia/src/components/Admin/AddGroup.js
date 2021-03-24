import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    TextField,
    CircularProgress,
    Button,
    Typography
} from '@material-ui/core';
import {
    Autocomplete
} from '@material-ui/lab';
import axios from 'axios';
import ImpediaLogo from '../../assets/Logo-Impedia.png';
import DomainPic from '../../assets/Admin/addAuthoritiesPage.svg';
import addAuthIcon from '../../assets/Admin/addAuth.svg';
import TopBar from '../TopBar/TopBar';


const useStyles = makeStyles(theme => ({
    appealToText:{
        fontWeight:"600",
        fontSize:"20px"
    },
    setDomainPage: {
        margin: "2% 0"
    },
    Domainbody: {
        display: "flex",
        width: "90%",
        margin: "5% auto",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            margin: "15% auto",
        }
    },
    group: {
        background: "red"
    },
    domainArea: {
        flex: "50%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center"
    },
    domainTextArea: {
        flex: "100%",
        display: "flex",
        alignItems: "center",
    },
    textField: {
        width: "90%",
        margin: "auto 5%",
    },
    domainIcon: {
        width: "100px",
        backgroundColor: "#FFAC41",
        padding: "20px",
        borderRadius: "25px",
        [theme.breakpoints.down("md")]: {
            width: "50px"
        }
    },
    button: {
        margin: "auto",
        [theme.breakpoints.down("sm")]: {
            margin: "2% auto"
        }
    },
    submitButton: {
        background: "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
        width: "200px",
        fontWeight: "800",
        padding: "5%",
        fontSize: "16px"
    },
    sidePic: {
        flex: "50%",
        textAlign: "center",
        [theme.breakpoints.down("sm")]: {
            margin: "5% auto"
        }
    },
    domainPic: {
        maxWidth: "100%"
    },
    labelColor: {
        color: "rgb(244, 67, 54)"
    },
    formWrapper: {
        width: "100%",
    },
    fieldWrapper:{
        marginBottom: "20px",
    },
}));

const AddGroup = () => {
    const classes = useStyles();
    const [optionsAuth, setOptionsAuth] = useState([]);
    const [openAuth, setOpenAuth] = useState(false);
    const loadingAuth = openAuth && optionsAuth.length === 0;
    const [openGroup, setOpenGroup] = useState(false);
    const [optionsGroup, setOptionsGroup] = useState([]);
    const loadingGroup = openGroup && optionsGroup.length === 0;
    const [authorityIds, setAuthorityIds] = useState();
    const [groupSelected, setGroupSelected] = useState();

    useEffect(() => {
        let active = true;

        if (loadingGroup === true) {
            return undefined;
        }

        (async () => {
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                    authorization: AdminToken,
                }
            }
            const res = await axios.get("/group", config)
            const dataGroups = res.data;

            if (active) {
                setOptionsGroup(() => {
                    return dataGroups.map((option) => {
                        let firstLetter = option.name[0].toUpperCase();
                        return {
                            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                            ...option,
                        }
                    })
                });
            }
        })();

        return () => {
            active = false;
        };
    }, [loadingGroup]);

    useEffect(() => {
        let active = true;

        if (loadingAuth === true) {
            return undefined;
        }

        (async () => {
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                    authorization: AdminToken,
                }
            }
            const res = await axios.get("/authority", config)
            const dataAuth = res.data;
            if (active) {
                setOptionsAuth(() => {
                    return dataAuth.map((option) => {
                        let firstLetter = option.email[0].toUpperCase();
                        return {
                            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                            optionName: typeof option.name !== "undefined" ? (option.name + " | " + option.email) : (option.email),
                            ...option,
                        }
                    })
                });
            }
        })();

        return () => {
            active = false;
        };
    }, [loadingAuth])

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            emailIds: authorityIds.map((authority) => {
                return authority.email
            }),
            name: groupSelected.name
        }
        const AdminToken = localStorage.getItem("key");
        const config = {
            headers: {
                authorization: AdminToken,
            }
        }
        console.log(authorityIds, groupSelected)
        axios.post(`/admin/authoritygroup`, body, config)
            .then((res) => {
                console.log(res);
                if (res.status === 200 || res.status === 201) {
                    alert("Group Created Successfully")
                } else {
                    alert("Failed")
                }
            })
            .catch((err) => {
                console.log(err);
        });
    }

    return (
        <>
            <div className={classes.setDomainPage}>
                <TopBar useCase="Add Group" actor="ADMIN" />

                <div className={classes.Domainbody}>

                    <div className={classes.domainArea}>
                        <div className={classes.formWrapper}>
                            <div className={classes.domainTextArea}>
                                <div className={classes.icon} >
                                    <img src={addAuthIcon} alt="doamin" className={classes.domainIcon} />
                                </div>
                                <div className={classes.textField}>
                                    <div className={classes.fieldWrapper}>
                                    <Typography className={classes.appealToText}>
                                        Select Authority Group:
                                    </Typography>
                                        <Autocomplete
                                            freeSolo
                                            id="group"
                                            disableClearable
                                            getOptionSelected={(option, value) => option.name === value.name}
                                            getOptionLabel={(option) => option.name}
                                            loading={loadingGroup}
                                            options={optionsGroup.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                            groupBy={(option) => option.firstLetter}
                                            onChange={(e, v) => { setGroupSelected(v) }}
                                            onOpen={() => {
                                                setOpenGroup(true);
                                            }}
                                            onClose={() => {
                                                setOpenGroup(false);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Search Group"
                                                    margin="normal"
                                                    variant="outlined"
                                                    InputProps={{
                                                        ...params.InputProps, 
                                                        type: 'search', 
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loadingGroup ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className={classes.fieldWrapper}>
                                    <Typography className={classes.appealToText}>
                                        Select Authorities to add:
                                    </Typography>
                                        <Autocomplete
                                            multiple
                                            id="authority"
                                            open={openAuth}
                                            onOpen={() => {
                                                setOpenAuth(true);
                                            }}
                                            onClose={() => {
                                                setOpenAuth(false);
                                            }}
                                            getOptionSelected={(option, value) => option.optionName === value.optionName}
                                            getOptionLabel={(option) => option.optionName}
                                            loading={loadingAuth}
                                            options={optionsAuth.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                            groupBy={(option) => option.firstLetter}
                                            onChange={(e, v) => { setAuthorityIds(v) }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error
                                                    label="Authority"
                                                    variant="filled"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loadingAuth ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>


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

export default AddGroup;