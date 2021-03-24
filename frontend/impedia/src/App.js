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
import ViewAppeal from './components/ViewAppeal/ViewAppeal'
import ViewPetition from './components/ViewPetition/ViewPetition'
import AdminAllAppeals from './components/Admin/AllAppeals';
import AuthorityAllAppeals from './components/Authority/AllAppeals';
import StudentAllAppeals from './components/Student/AllAppeals';
import AdminAllPetitions from './components/Admin/AllPetitions';
import AuthorityAllPetitions from './components/Authority/AllPetitions';
import StudentAllPetitions from './components/Student/AllPetitions';

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
          <Route exact path="/student/appeals/create" component={CreateAppeal} />
          <Route exact path="/student/petitions/create" component={CreatePetition} />
          <Route exact path="/admin/AddGroup" component={AddGroup} />
          <Route exact path="/admin/appeals" component={AdminAllAppeals} />
          <Route exact path="/authority/appeals" component={AuthorityAllAppeals} />
          <Route exact path="/student/appeals" component={StudentAllAppeals} />
          <Route exact path="/admin/petitions" component={AdminAllPetitions} />
          <Route exact path="/authority/petitions" component={AuthorityAllPetitions} />
          <Route exact path="/student/petitions" component={StudentAllPetitions} />
          <Route path="/appeals/:id" render={(props)=>(
            <ViewAppeal routerProps={props} />
          )} />
          <Route path="/petitions/:id" render={(props)=>(
            <ViewPetition routerProps={props} />
          )} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
