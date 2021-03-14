import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


import LoginPage from './components/Auth/LoginPage';
import AdminLogin from './components/Auth/AdminLogin';
import AuthorityLogin from './components/Auth/AuthorityLogin';
import StudentLogin from './components/Auth/StudentLogin';
import StudentRegister from './components/Auth/StudentRegister';
import ChangeDomain from './components/Admin/ChangeDomain';


function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login/admin" component={AdminLogin} />
          <Route exact path="/login/authority" component={AuthorityLogin} />
          <Route exact path="/login/student" component={StudentLogin} />
          <Route exact path="/StudentRegister" component={StudentRegister} />
          <Route exact path="/ChangeDomain" component={ChangeDomain} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
