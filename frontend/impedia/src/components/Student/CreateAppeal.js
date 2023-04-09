import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateTemplate from "./CreateTemplate/CreateTemplate";
import {useCookies} from 'react-cookie';
import  { useHistory} from 'react-router-dom';

const CreateAppeal = () => {
  const [cookies] = useCookies(['user']);
  const [openAlert, setOpenAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [newAppeal, setNewAppeal] = useState({
    title: "Sample Title",
    content: "Sample Content",
  });
  const [appealTo, setAppealTo] = useState("");
  const [sendToId, setId] = useState();
  const history = useHistory();

  useEffect(() => {
      if(! cookies.user || cookies.user["type"] !== "STUDENT"){
          return history.push("/login/member");
      }
  }, []);

  const submitFunction = (e) => {
    e.preventDefault();

    if (typeof sendToId !== "undefined" && sendToId !== null) {
      const Token = cookies.user['key'];
      const config = {
        headers: {
          authorization: Token,
        },
      };

      const body = {
        ...newAppeal,
        appealToId: sendToId.id,
      };

      axios.post("/student/createappeal", body, config).then((res) => {
        console.log(res);
        if (res.status === 201) {
          setOpenAlert(true);
          setNewAppeal({
            title:"Sample Title",
            content:"Sample Content"
          })
        }
      });
    } else {
      setOpenErrorAlert(true);
    }
  };

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
  );
};

export default CreateAppeal;
