import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import ResetPasswordTrigger from "./components/ResetPassword/ResetPasswordTrigger";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import AdminLogin from "./components/Auth/AdminLogin";
import AuthorityLogin from "./components/Auth/AuthorityLogin";
import StudentLogin from "./components/Auth/StudentLogin";
import StudentRegister from "./components/Auth/StudentRegister";
import AdminRegister from "./components/Auth/AdminRegister";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import ChangeDomain from "./components/Admin/ChangeDomain";
import AddAuthority from "./components/Admin/AddAuthority";
import CreateAppeal from "./components/Student/CreateAppeal";
import AddGroup from "./components/Admin/AddGroup";
import EditGroup from "./components/Admin/EditGroup";
import CreatePetition from "./components/Student/CreatePetition";
import StudentDashboard from "./components/Student/Dashboard/Dashboard";
import AuthorityDashboard from "./components/Authority/Dashboard/Dashboard";
import ViewAppeal from "./components/ViewAppeal/ViewAppeal";
import ViewPetition from "./components/ViewPetition/ViewPetition";
import AdminAllAppeals from "./components/Admin/AllAppeals";
import AuthorityAllAppeals from "./components/Authority/AllAppeals";
import StudentAllAppeals from "./components/Student/AllAppeals";
import AdminAllPetitions from "./components/Admin/AllPetitions";
import AuthorityAllPetitions from "./components/Authority/AllPetitions";
import StudentAllPetitions from "./components/Student/AllPetitions";
import UpdateStudentProfile from "./components/Student/UpdateProfile";
import UpdateAuthorityProfile from "./components/Authority/UpdateProfile";
import GetStarted from "./components/GetStarted";
import Home from "./components/Home/Home";
import Logout from "./components/Logout";
import DarkTheme from './components/DarkTheme';
import Error404 from './components/Error404';
import {useCookies} from 'react-cookie'

function App() {
  const [cookies] = useCookies(["user"]);

  const AdminRoute = (takeprops) => {
    const { component: Component, ...props } = takeprops
    return(
      <Route 
        {...props} 
        render={props => (
          cookies.user ? (
          cookies.user["type"] === "ADMIN" ?
            <Component {...props} /> :
            <Redirect to='/login/admin' /> ) : (
              <Redirect to='/login/admin' />
            )
        )} 
      />
    )
  }

  const AuthorityRoute = (takeprops) => {
    const { component: Component, ...props } = takeprops
    return(
      <Route 
        {...props} 
        render={props => (
          cookies.user ? (
          cookies.user["type"] === "AUTHORITY" ?
            <Component {...props} /> :
            <Redirect to='/login/authority' /> ) : (
              <Redirect to='/login/authority' />
            )
        )} 
      />
    )
  }

  const StudentRoute = (takeprops) => {
    const { component: Component, ...props } = takeprops
    return(
      <Route 
        {...props} 
        render={props => (
          cookies.user ? (
          cookies.user["type"] === "STUDENT" ?
            <Component {...props} /> :
            <Redirect to='/login/member' /> ) : (
              <Redirect to='/login/member' />
            )
        )} 
      />
    )
  }
  // console.log(cookies.user["type"]);
  return (
    <>
      
      <DarkTheme />
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/get-started" component={GetStarted} />
          <Route exact path="/reset-password/trigger" component={ResetPasswordTrigger} />
          <Route exact path="/reset-password" component={ResetPassword} />
          <Route exact path="/login/admin" component={AdminLogin} />
          <Route exact path="/login/authority" component={AuthorityLogin} />
          <Route exact path="/login/member" component={StudentLogin} />
          <Route exact path="/register/member" component={StudentRegister} />
          <Route exact path="/register/admin" component={AdminRegister} />
          {/* <Route 
            path="/admin"
            
            > */}
            <AdminRoute exact path="/admin/dashboard" component={Dashboard} />
            <AdminRoute exact path="/admin/ChangeDomain" component={ChangeDomain} />
            <AdminRoute exact path="/admin/AddAuthority" component={AddAuthority} />
            <AdminRoute exact path="/admin/petitions" component={AdminAllPetitions} />
            <AdminRoute exact path="/admin/groups/edit" component={EditGroup} />
            <AdminRoute exact path="/admin/groups/add" component={AddGroup} />
            <AdminRoute exact path="/admin/appeals" component={AdminAllAppeals} />
          {/* </Route> */}
          
          <StudentRoute exact path="/member/dashboard" component={StudentDashboard} />
          <StudentRoute
            exact
            path="/member/appeals/create"
            component={CreateAppeal}
          />
          <StudentRoute
            exact
            path="/member/petitions/create"
            component={CreatePetition}
          />
          <StudentRoute
            exact
            path="/member/petitions"
            component={StudentAllPetitions}
          />
          <StudentRoute 
            exact 
            path="/member/appeals" 
            component={StudentAllAppeals} 
          />
          <StudentRoute
            exact
            path="/member/updateprofile"
            component={UpdateStudentProfile}
          />
          
          
          <AuthorityRoute
            exact
            path="/authority/dashboard"
            component={AuthorityDashboard}
          />
          <AuthorityRoute
            exact
            path="/authority/appeals"
            component={AuthorityAllAppeals}
          />
          <AuthorityRoute
            exact
            path="/authority/petitions"
            component={AuthorityAllPetitions}
          />
          <AuthorityRoute
            exact
            path="/authority/updateprofile"
            component={UpdateAuthorityProfile}
          />

          <Route
            path="/appeals/:id"
            render={(props) => <ViewAppeal routerProps={props} />}
          />
          <Route
            path="/petitions/:id"
            render={(props) => <ViewPetition routerProps={props} />}
          />
          <Route exact path="/logout" component={Logout} />
          <Route path="*" component={Error404} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
