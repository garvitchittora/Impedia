import React , { useEffect } from 'react';
import axios from 'axios';
import LoginPage from './LoginPage';
import StudentLoginPic from '../../assets/Login/studentLogin.svg'
import  { useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';

const StudentLogin = () => {
    const history = useHistory();

    const [cookies, setCookie] = useCookies(['user']);

    const [EmailValues, setEmailValues] = React.useState('');
    const [PasswordValues, setPasswordValues] = React.useState('');
    
    const [openAlert, setOpenAlert] = React.useState(false);
    
    useEffect(() => {
        if(cookies.user && cookies.user["type"] === "STUDENT"){
            return history.push("/member/dashboard");
        }
    }, []);

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            password: PasswordValues,
        }

        axios.post('/student/auth',body)
        .then((res)=>{
            let data = res.data;

            if(res.status === 200 || res.status === 201){
                localStorage.setItem('key',data.authKey);
                console.log(data.authKey);
                setCookie('user', {key: data.authKey, type:"STUDENT", email:EmailValues}, { path: '/' });
                return history.push("/member/dashboard");
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
                actor="Members"
                EmailValues={EmailValues} 
                PasswordValues={PasswordValues}
                setEmailValues={setEmailValues}
                setPasswordValues={setPasswordValues}
                submitFunction={submitFunction}
                loginImage={StudentLoginPic}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />
        </>
    )
}

export default StudentLogin;
