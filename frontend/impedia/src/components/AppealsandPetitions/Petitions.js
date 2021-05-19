import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { FilterList } from "@material-ui/icons";
import UpvoteIcon from "@material-ui/icons/ThumbUp";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown/with-html";
import gfm from "remark-gfm";
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
  filterButton: {
    width: "90%",
    textAlign: "center",
    margin: "2% auto",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  apCard: {
    // width:"45%",
    borderRadius: "15px",
    margin: "5% auto",
    paddingBottom: "30px",
    cursor: "pointer",
    transition: "all 0.15s ease-in",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
    "&:hover": {
      boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.12)",
      //   transform: "translateY(-1.5px)",
    },
    [theme.breakpoints.up("sm")]: {
      width: "40vw",
    },
    [theme.breakpoints.down("sm")]: {
      width: "90vw",
    },
  },
  apCardDark: {
    backgroundColor:"#161b22",
    borderRadius: "15px",
    margin: "5% auto",
    paddingBottom: "30px",
    cursor: "pointer",
    transition: "all 0.15s ease-in",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
    "&:hover": {
      boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.12)",
      //   transform: "translateY(-1.5px)",
    },
    [theme.breakpoints.up("sm")]: {
      width: "40vw",
    },
    [theme.breakpoints.down("sm")]: {
      width: "90vw",
    },
  },
  titleSection: {
    backgroundColor: "rgba(255,164,27,0.75)",
    fontSize: "35px",
    fontWeight: "600",
    padding: "30px 30px",
    borderRadius: "15px 15px 0 0",
    textAlign: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  mentions: {
    padding: "10px",
    fontSize: "18px",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: "2px",
    [theme.breakpoints.down("md")]: {},
  },
  red: {
    color: "#FF1E56",
  },
  body: {
    width: "90%",
    margin: "30px auto",
    padding: "20px",
    backgroundColor: "#f9f6f7",
    borderRadius: "10px",
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  cont: {
    height: "250px",
    overflow: "scroll",
    color:"black"
  },
  dateSection: {
    width: "90%",
    margin: "auto",
    display: "flex",
    justifyContent: "flex-end",
    color:"black"
  },
  date: {
    backgroundColor: "#EAE9E9",
    borderRadius: "15px",
    padding: "10px 20px",
    fontWeight: "600",
  },
  link: {
    textDecoration: "none",
    textTransform: "none",
    color: "inherit",
  },
  petnextras: {
    marginTop: "20px",
    width: "90%",
    margin: "auto",
    display: "flex",
    fontWeight: "600",
    justifyContent: "space-between",
  },
  upvotes: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "15px",
    background:
      "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
  },
  status: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "15px",
    background:
      "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
    letterSpacing: "3px",
    fontWeight:"800",
    textTransform:"uppercase"
  },
  filterInputs: {
    width: "500px",
    maxWidth: "90vw",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  Approved:{
    background:"#81b214"
  },
  Rejected:{
    background:"#ec0101"
  }
}));

const Petitions = (props) => {
  const classes = useStyles();
  const [cookies] = useCookies(['theme']);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [allRaisers, setAllRaisers] = useState([]);
  const [filterRaisedBy, setFilterRaisedBy] = useState(null);
  const [filterFromDate, setFilterFromDate] = useState();
  const [filterToDate, setFilterToDate] = useState();
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    setData(props.data);
    if (!props.data || typeof props.data === "undefined") {
      setAllRaisers([]);
      return;
    }
    if (props.data === []) {
      setAllRaisers([]);
      return;
    }

    setAllRaisers(() => {
      let arr = [];
      let emails = [];
      props.data.forEach((ap) => {
        let obj = {
          email: ap.petitionFromId.email,
          name: ap.petitionFromId.name,
        };
        if (!emails.includes(obj.email)) {
          arr = [...arr, obj];
          emails.push(obj.email);
        }
      });
      return arr;
    });
  }, [props.data]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const applyFilters = () => {
    setOpen(false);
    let arr1 = props.data;
    let arr2 = [];
    if (filterRaisedBy === "" || filterRaisedBy === null) {
      arr1 = props.data;
      arr2 = props.data;
    } else {
      let temp = filterRaisedBy.split("|");
      let email = temp[0].slice(0, -1);
      console.log(email);
      arr2 = arr1.filter((el) => el.petitionFromId.email === email);
    }
    let tempfrom = new Date(filterFromDate).setHours(0,0,0,0);
    let tempto = new Date(filterToDate).setHours(23,59,59,999);
    let fromdate = new Date(tempfrom).getTime();
    let todate = new Date(tempto).getTime();
    // fromdate.setHours(0,0,0,0);
    // fromdate
    // fromdate-=86400000;
    // todate+=86400000;
    console.log(fromdate);
    console.log(todate);
    console.log(new Date(fromdate));
    console.log(new Date(todate));
    let arr3 = [];
    if (isNaN(fromdate)) {
      arr3 = arr2;
    } else if (isNaN(todate)) {
      arr3 = arr2.filter((el) => {
        let dt = new Date(el.dateTime);
        return +dt >= +fromdate;
      });
    } else {
      arr3 = arr2.filter((el) => {
        let dt = new Date(el.dateTime);
        return +dt >= +fromdate && +dt < +todate;
      });
    }
    console.log(arr3);
    let arr4=arr3;
    console.log(filterStatus);
    if(filterStatus===null || filterStatus==="All"){
      arr4=arr3;
    }
    else{
      arr4 = arr3.filter((el) => {
        return el.decision === filterStatus;
      })
    }
    console.log(arr4);

    setData(arr4);
  };

  const clearAllFilters = () => {
    setFilterRaisedBy(null);
    setFilterFromDate();
    setFilterToDate();
    setFilterStatus(null);
  };

  const Card = (ap, ind) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return (
      <Link to={`/petitions/${ap.id}`} className={classes.link} key={ind}>
        <div className={cookies.theme==="dark" ? classes.apCardDark : classes.apCard}>
          <div className={classes.titleSection}>{ap.title}</div>
          <div className={classes.mentions}>
            <span className={classes.red}>FROM : </span>{" "}
            {`${ap.petitionFromId.name} | ${ap.petitionFromId.email}`}
          </div>
          <div className={classes.mentions}>
            <span className={classes.red}>TO : </span> {ap.petitionToId.name}
          </div>
          <div className={classes.body}>
            <ReactMarkdown
              plugins={[gfm]}
              allowDangerousHtml
              children={ap.content}
              className={classes.cont}
            />
          </div>
          <div className={classes.dateSection}>
            <div className={classes.date}>
              {new Date(ap.dateTime).toLocaleDateString("en-US", options)}
            </div>
          </div>
          <div className={classes.petnextras}>
            <div className={classes.upvotes}>
              <UpvoteIcon /> &nbsp; {ap.signees.length}
            </div>
            <div className={`${classes.status} ${classes[ap.decision]}`} >
                {ap.decision ? ap.decision : "Pending"}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <div className={classes.filterButton}>
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
        <DialogTitle className={classes.dialogTitle}>
          {"Create Filters"}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            className={classes.filterInputs}
            id="raised-by"
            options={allRaisers.map(
              (option) => `${option.email} | ${option.name}`
            )}
            value={filterRaisedBy}
            onChange={(e, v) => {
              setFilterRaisedBy(v);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error
                label="Raised By"
                margin="normal"
                variant="outlined"
                InputProps={{ ...params.InputProps, type: "search" }}
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
              onChange={(date) => setFilterFromDate(date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
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
              onChange={(date) => setFilterToDate(date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <br />
          </MuiPickersUtilsProvider>
          
          <br />
          <TextField
              error
              id="status-filter"
              name="status"
              className={classes.filterInputs}
              InputLabelProps={{ shrink: true }}
              label="Status"
              select
              variant="outlined"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
          >
              {[
                {label:"All", value:"All"},
                {label:"Pending", value:"Pending"},
                {label:"Approved", value:"Approved"},
                {label:"Rejected", value:"Rejected"}
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                      {option.label}
                  </MenuItem>
              ))}
          </TextField>
          <br />
          <br />
          <br />
          <Button color="secondary" onClick={clearAllFilters}>
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
        {data ? (data.length === 0 ? <h2>No Petitions</h2> : data.map(Card)) : <CircularProgress /> }
        {/* {data.length === 0 ? <h2>No Petitions</h2> : data.map(Card)} */}
      </div>
    </>
  );
};

export default Petitions;
