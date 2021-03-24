import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AdminLogin from './components/Auth/AdminLogin';
import AuthorityLogin from './components/Auth/AuthorityLogin';
import StudentLogin from './components/Auth/StudentLogin';
import StudentRegister from './components/Auth/StudentRegister';
import Dashboard from './components/Admin/Dashboard/Dashboard';
import ChangeDomain from './components/Admin/ChangeDomain';
import AddAuthority from './components/Admin/AddAuthority';
import CreateAppeal from './components/Student/CreateAppeal';
import AddGroup from './components/Admin/AddGroup';
import CreatePetition from './components/Student/CreatePetition';
import StudentDashboard from './components/Student/Dashboard/Dashboard';
import AuthorityDashboard from './components/Authority/Dashboard/Dashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login/admin" component={AdminLogin} />
          <Route exact path="/login/authority" component={AuthorityLogin} />
          <Route exact path="/login/student" component={StudentLogin} />
          <Route exact path="/register/student" component={StudentRegister} />
          <Route exact path="/admin/dashboard" component={Dashboard} />
          <Route exact path="/student/dashboard" component={StudentDashboard} />
          <Route exact path="/authority/dashboard" component={AuthorityDashboard} />
          <Route exact path="/admin/ChangeDomain" component={ChangeDomain} />
          <Route exact path="/admin/AddAuthority" component={AddAuthority} />
          <Route exact path="/appeals/create" component={CreateAppeal} />
          <Route exact path="/petitions/create" component={CreatePetition} />
          <Route exact path="/admin/AddGroup" component={AddGroup} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
