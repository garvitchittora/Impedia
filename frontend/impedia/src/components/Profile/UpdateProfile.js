import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { makeStyles, FilledInput } from "@material-ui/core";
import axios from "axios";
import TopBar from "../TopBar/TopBar";
import {useCookies} from 'react-cookie';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "2% 0",
  },
  appeals: {
    width: "95vw",
    maxWidth: "1000px",
    margin: "5% auto",
  },
  submitButton: {
    background:
      "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
    width: "200px",
    fontWeight: "800",
    padding: "1%",
    fontSize: "16px",
    border: "none",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const UpdateProfile = () => {
  const classes = useStyles();
  const [cookies] = useCookies(['user'])
  const [key, setKey] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setKey(cookies.user['key']);
  }, []);

  useEffect(() => {
    if (key) {
      const exec = async () => {
        const config = {
          headers: {
            authorization: key,
          },
        };
        const res = await axios.get("/student/profile", config);
        setUserData(res.data);
      };
      exec();
    }
  }, [key]);

  const updateUserData = async () => {
    const config = {
      headers: {
        authorization: key,
      },
    };
    const student = await axios.put("/student/profile", userData, config);
    student.status === 200
      ? console.log("Student data updated ", student)
      : console.log("Something went wrong");
  };

  return (
    <>
      {key !== null ? (
        <div className={classes.container}>
          <TopBar actor="STUDENT" useCase="Update Profile" />
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
          <input
            type="text"
            value={userData.semester}
            onChange={(e) =>
              setUserData({ ...userData, semester: e.target.value })
            }
          />
          <input
            type="text"
            value={userData.branch}
            onChange={(e) =>
              setUserData({ ...userData, branch: e.target.value })
            }
          />
          <input
            type="text"
            value={userData.section}
            onChange={(e) =>
              setUserData({ ...userData, section: e.target.value })
            }
          />
          <button className={classes.submitButton} onClick={updateUserData}>
            Update Profile
          </button>
        </div>
      ) : (
        <Redirect to="/login/student" />
      )}
    </>
  );
};

export default UpdateProfile;
