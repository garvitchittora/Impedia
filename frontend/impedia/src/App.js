import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


import AdminLogin from './components/Auth/AdminLogin';
import AuthorityLogin from './components/Auth/AuthorityLogin';
import StudentLogin from './components/Auth/StudentLogin';
import StudentRegister from './components/Auth/StudentRegister';



function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/AdminLogin" component={AdminLogin} />
          <Route exact path="/AuthorityLogin" component={AuthorityLogin} />
          <Route exact path="/StudentLogin" component={StudentLogin} />
          <Route exact path="/StudentRegister" component={StudentRegister} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
