import React, { useEffect } from 'react';
import axios from 'axios';
import LoginPage from './LoginPage';
import AdminLoginPic from '../../assets/Login/adminLogin.svg'
import  { useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AdminLogin = () => {
    const history = useHistory();

    const [cookies, setCookie] = useCookies(['user']);

    const [EmailValues, setEmailValues] = React.useState('');
    const [PasswordValues, setPasswordValues] = React.useState('');

    const [openAlert, setOpenAlert] = React.useState(false);

    useEffect(() => {
        if(cookies.user  && cookies.user["type"] === "ADMIN"){
            return history.push("/admin/dashboard");
        }
    }, []);

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            password: PasswordValues,
        }

        axios.post('/admin/auth',body)
        .then((res)=>{
            if(res.status === 200 || res.status === 201){
                let data = res.data;
                localStorage.setItem('key',data.authKey);
                setCookie('user', {key: data.authKey, type:"ADMIN", email:EmailValues}, { path: '/' });
                console.log(data.authKey);
                return history.push("/admin/dashboard");
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
                actor="Admin"
                EmailValues={EmailValues} 
                PasswordValues={PasswordValues}
                setEmailValues={setEmailValues}
                setPasswordValues={setPasswordValues}
                submitFunction={submitFunction}
                loginImage={AdminLoginPic}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />
        </>
    )
}

export default AdminLogin;
