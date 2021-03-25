import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    makeStyles
} from '@material-ui/core';
import Appeals from '../AppealsandPetitions/Appeals';
import TopBar from '../TopBar/TopBar';

const useStyles = makeStyles((theme) => ({
    container:{
        margin:"2% 0"
    },
    appeals:{
        width:"95vw",
        maxWidth:"1000px",
        margin:"5% auto"
    }
}))

const AllAppeals = () => {
    const classes=useStyles();

    const [data, setData] = useState([]);

    useEffect(()=>{
        const Token = localStorage.getItem("key");
        const config = {
            headers: {
              authorization: Token,
            }
        }

        axios.get("/authority/appeals", config)
        .then(res=>res.data)
        .then(data=>{
            console.log(data);
            setData(data.sort((a,b)=>(new Date(b.dateTime) - new Date(a.dateTime))));
        })

    },[])
   
    return (
        <>
            <div className={classes.container}>
                <TopBar actor="AUTHORITY" useCase="Appeals" />
                <div className={classes.appeals}>
                    <Appeals data={data} />
                </div>
            </div>
        </>
    )
}

export default AllAppeals;