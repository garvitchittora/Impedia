import React, { useState } from 'react';

import axios from 'axios';
import CreateTemplate from './CreateTemplate/CreateTemplate';
import {useCookies} from 'react-cookie';


const CreatePetition = () => {
    const [cookies] = useCookies(['user'])
    const [openAlert, setOpenAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [newPetition, setNewPetition] = useState({
        title:"Sample Title",
        content:"Sample Content"
    })

    const [petitionTo, setPetitionTo] = useState("");

    const[sendToId,setId] = useState();

    const submitFunction = (e) => {
        e.preventDefault();

        if(typeof sendToId !== "undefined" && sendToId !== null){
            const Token = cookies.user['key'];
            const config = {
                headers: {
                  authorization: Token,
                }
            }

            const body = {
                ...newPetition,
                petitionToId: sendToId.id,
            }

            axios.post("/student/createpetition", body, config)
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
               type="Petition"
               newAP={newPetition}
               setNewAP={setNewPetition}
               APTo={petitionTo}
               setAPTo={setPetitionTo}
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

export default CreatePetition;