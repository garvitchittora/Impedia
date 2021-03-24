import React, { useEffect, useState } from 'react';

import axios from 'axios';
import CreateTemplate from './CreateTemplate/CreateTemplate';


const CreateAppeal = () => {

    const [openAlert, setOpenAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [newAppeal, setNewAppeal] = useState({
        title:"Sample Title",
        content:"Sample Content"
    })

    const [appealTo, setAppealTo] = useState("");

    const[sendToId,setId] = useState();

    const submitFunction = (e) => {
        e.preventDefault();

        if(typeof sendToId !== "undefined" && sendToId !== null){
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                  authorization: AdminToken,
                }
            }

            const body = {
                ...newAppeal,
                appealToId: sendToId.id,
            }

            axios.post("/student/createappeal", body, config)
            .then((res) => {
                console.log(res);
                if(res.status === 201){
                    setOpenAlert(true);
                }
            })
        }
        else{
            setOpenErrorAlert(true);
        }
    }   

    return (
        <>
           <CreateTemplate 
               type="Appeal"
               newAP={newAppeal}
               setNewAP={setNewAppeal}
               APTo={appealTo}
               setAPTo={setAppealTo}
               sendToId={sendToId}
               setId={setId}
               openAlert={openAlert}
               setOpenAlert={setOpenAlert}
               openErrorAlert={openErrorAlert}
               setOpenErrorAlert={setOpenErrorAlert}
               submitFunction={submitFunction}
           />
        </>
    )
}

export default CreateAppeal;