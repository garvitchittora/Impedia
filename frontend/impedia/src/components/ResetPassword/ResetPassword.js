import React from 'react';
import axios from 'axios';
import ChangeForm from './ChangeForm';
import PasswordPic from '../../assets/Login/password.svg'
import {
    useLocation
} from "react-router-dom";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
    const [PasswordValues, setPasswordValues] = React.useState('');
    let query = useQuery();
    const [openAlert, setOpenAlert] = React.useState(false);
    const [successAlert, setSuccessAlert] = React.useState(false);

    const submitFunction = async (e) => {
        e.preventDefault();

        const resetToken = query.get("resetToken");

        const body = {
            resetToken: resetToken,
            password: PasswordValues
        }

        console.log(body);
        
        axios.post('/reset-password', body)
        .then((res)=>{
            if(res.status === 200){
                setSuccessAlert(true);
            }
        })
        .catch((err)=>{
            if(err.response.status === 400 || err.response.status === 404 || err.response.status === 410)
                setOpenAlert(true);
        });
        
    }

    return (
        <>
            <ChangeForm 
                PasswordValues={PasswordValues} 
                setPasswordValues={setPasswordValues}
                submitFunction={submitFunction}
                loginImage={PasswordPic}
                openAlert={openAlert}
                successAlert={successAlert}
                setOpenAlert={setOpenAlert}
                setSuccessAlert={setSuccessAlert}
            />
        </>
    )
}

export default ResetPassword;
