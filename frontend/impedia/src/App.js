import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AdminLogin from './components/Auth/AdminLogin';
import AuthorityLogin from './components/Auth/AuthorityLogin';
import StudentLogin from './components/Auth/StudentLogin';
import StudentRegister from './components/Auth/StudentRegister';
import ChangeDomain from './components/Admin/ChangeDomain';
import AddAuthority from './components/Admin/AddAuthority';

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login/admin" component={AdminLogin} />
          <Route exact path="/login/authority" component={AuthorityLogin} />
          <Route exact path="/login/student" component={StudentLogin} />
          <Route exact path="/register/student" component={StudentRegister} />
          <Route exact path="/admin/ChangeDomain" component={ChangeDomain} />
          <Route exact path="/admin/AddAuthority" component={AddAuthority} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
