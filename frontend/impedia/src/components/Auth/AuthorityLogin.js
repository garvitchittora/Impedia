import React, { useEffect } from 'react';
import axios from 'axios';
import LoginPage from './LoginPage';
import AuthorityLoginPic from '../../assets/Login/authLogin.svg'
import  { useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthorityLogin = () => {
    const history = useHistory();

    const [cookies, setCookie] = useCookies(['user']);

    const [EmailValues, setEmailValues] = React.useState('');
    const [PasswordValues, setPasswordValues] = React.useState('');
    
    const [openAlert, setOpenAlert] = React.useState(false);

    useEffect(() => {
        if(cookies.user  && cookies.user["type"] === "AUTHORITY"){
            return history.push("/authority/dashboard");
        }
    }, []);

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            password: PasswordValues,
        }

        axios.post('/authority/auth',body)
        .then((res)=>{
            let data = res.data;
            if(res.status === 200 || res.status === 201){
                localStorage.setItem('key',data.authKey);
                setCookie('user', {key: data.authKey, type:"AUTHORITY", email:EmailValues}, { path: '/' });
                console.log(data.authKey);

                return history.push("/authority/dashboard");
            }else{
                alert("Failed")
            } 
        })
        .catch((err)=>{
            if(err.response.status === 400 || err.response.status === 403)
                setOpenAlert(true);
        });
    }

    return (
        <>
            <LoginPage 
                actor="Authority"
                EmailValues={EmailValues} 
                PasswordValues={PasswordValues}
                setEmailValues={setEmailValues}
                setPasswordValues={setPasswordValues}
                submitFunction={submitFunction}
                loginImage={AuthorityLoginPic}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />
        </>
    )
}

export default AuthorityLogin;
