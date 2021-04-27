import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from '@material-ui/core';
import {
    Autocomplete
} from '@material-ui/lab';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
    FilterList
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown/with-html';
import gfm from 'remark-gfm';

const useStyles = makeStyles(theme => ({
    filterButton:{
        width:"90%",
        textAlign:"center",
        margin:"2% auto"
    },
    container:{
        display:"flex",
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"space-evenly"
    },
    apCard:{
        // width:"45%",
        borderRadius:"30px",
        margin:"5% auto",
        paddingBottom:"30px",
        cursor:"pointer",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        '&:hover':{
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
        },
        [theme.breakpoints.up("sm")]:{
            width:"40vw"
        },
        [theme.breakpoints.down("sm")]:{
            width:"90vw"
        }
    },
    titleSection:{
        backgroundColor:"rgba(255,164,27,0.75)",
        fontSize:"35px",
        fontWeight:"600",
        padding:"30px 30px",
        borderRadius:"30px 30px 0 0",
        textAlign:"center",
        overflow:"hidden",
        whiteSpace:"nowrap",
        textOverflow:"ellipsis"
    },
    mentions:{
        padding:"10px",
        fontSize:"18px",
        textAlign:"center",
        fontWeight:"600",
        letterSpacing:"2px",
        [theme.breakpoints.down("md")]:{
        }
    },
    red:{
        color:"#FF1E56",
    },
    body:{
        width:"90%",
        margin:"30px auto",
        padding:"20px",
        backgroundColor:"#f9f6f7",
        borderRadius:"20px",
        [theme.breakpoints.down("xs")]:{
            width:"80%"
        }
    },
    cont:{
        height:"250px",
        overflow:"scroll",
    },
    dateSection:{
        width:"90%",
        margin:"auto",
        display:"flex",
        justifyContent:"flex-end"
    },
    date:{
        backgroundColor: "#EAE9E9",
        borderRadius:"20px",
        padding:"10px 30px",
        fontWeight:"600"
    },
    link:{
        textDecoration:"none",
        textTransform:"none",
        color:"inherit"
    },
    filterInputs:{
        width:"500px",
        maxWidth:"90vw",
        [theme.breakpoints.down("xs")]:{
            width:"300px"
        }
    }
}));

const Appeals = (props) => {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [allRaisers, setAllRaisers] = useState([]);
    const [filterRaisedBy, setFilterRaisedBy] = useState(null);
    const [filterFromDate, setFilterFromDate] = useState();
    const [filterToDate, setFilterToDate] = useState();

    useEffect(() => {
        setData(props.data);
        if(!props.data || typeof props.data === 'undefined'){
            setAllRaisers([]);
            return;
        }
        if(props.data === []){
            setAllRaisers([]);
            return;
        }
        console.log("here");

        setAllRaisers(() => {
            return props.data.map((ap) => {
                return {
                    email: ap.appealFromId.email,
                    name: ap.appealFromId.name
                }
            })
        })
    },[props.data])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const filterRaisedByData = (usedata) => {
        if(filterRaisedBy === "" || filterRaisedBy === null){
            setData(usedata);
            return;
        }
        let arr = filterRaisedBy.split('|');
        console.log(arr);
        let email = arr[0].slice(0,-1);
        console.log(email);
        setData(() => {
            return usedata.filter((el) => (
                el.appealFromId.email === email
            ))
        })
    }
    const filterDateData = (usedata) => {
        let fromdate = new Date(filterFromDate).getTime();
        let todate = new Date(filterToDate).getTime();
        if(isNaN(fromdate)){
            return;
        }
        if(isNaN(todate)){
            setData(() => {
                return usedata.filter((el) => {
                    let dt = new Date(el.dateTime);
                    return +dt >= +fromdate
                })
            });
            return;
        }

        setData(() => {
            return usedata.filter((el) => {
                let dt = new Date(el.dateTime);
                return +dt >= +fromdate && +dt <= +todate
            })
        });
    }
    const applyFilters = () => {
        setOpen(false);
        filterRaisedByData(props.data);
        filterDateData(data);
    }

    const clearAllFilters = () => {
        setFilterRaisedBy(null);
        setFilterFromDate();
        setFilterToDate();
    }

    const Card = (ap, ind) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return (
            <Link to={`/appeals/${ap.id}`} className={classes.link} key={ind}>
            <div className={classes.apCard} >
                <div className={classes.titleSection} >
                    {ap.title}
                </div>
                <div className={classes.mentions} >
                    <span className={classes.red}>FROM : </span> {`${ap.appealFromId.name} | ${ap.appealFromId.email}`}
                </div>
                <div className={classes.mentions} >
                    <span className={classes.red}>TO : </span> {ap.appealToId.name}
                </div>
                <div className={classes.body} >
                    <ReactMarkdown plugins={[gfm]} allowDangerousHtml children={ap.content} className={classes.cont}/>
                </div>
                <div className={classes.dateSection} >
                    <div className={classes.date} >
                        {new Date(ap.dateTime).toLocaleDateString('en-US',options)}
                    </div>
                </div>
            </div>
            </Link>
        )
    }

    return (
        <>
            <div className={classes.filterButton} >
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<FilterList />}
                    onClick={handleClickOpen}
                >
                    Filters
                </Button>
            </div>
            <Dialog
                open={open}
                className={classes.dialog}
                onClose={handleClose}
                aria-labelledby="filters"
                aria-describedby="filters"
            >
                <DialogTitle className={classes.dialogTitle}>{"Create Filters"}</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        className={classes.filterInputs}
                        id="raised-by"
                        options={allRaisers.map((option) => `${option.email} | ${option.name}`)}
                        value={filterRaisedBy}
                        onChange={(e,v)=>{setFilterRaisedBy(v)}}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            error
                            label="Raised By"
                            margin="normal"
                            variant="outlined"
                            InputProps={{ ...params.InputProps, type: 'search' }}
                        />
                        )}
                    />

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                            margin="normal"
                            error
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-from"
                            label="From Date"
                            value={filterFromDate}
                            onChange={(date) => (setFilterFromDate(date))}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                            <br />
                            <KeyboardDatePicker
                            margin="normal"
                            error
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-to"
                            label="To Date"
                            value={filterToDate}
                            onChange={(date) => (setFilterToDate(date))}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                    </MuiPickersUtilsProvider>
                    <br /><br /><br />
                    <Button 
                        color="secondary"
                        onClick={clearAllFilters}
                    >
                        Clear All Filters
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={applyFilters} color="secondary" autoFocus>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
            <div className={classes.container}>
                {data.length===0?<h2>No Appeals</h2> : data.map(Card)}
            </div>
        </>
    )
}

export default Appeals;