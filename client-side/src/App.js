import './App.css';
import { Fragment } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import ImageItem from "./components/image-item/ImageItem";
import SignInForm from './components/sign-in/SignInForm';
import SignUpForm from './components/sign-up/SignUpForm';
import NotFound from './components/error/NotFound';
import UserFunction from './components/user-function/UserFunction';
import { GET_USERID } from './conventions/convention';

//using redux
import { useSelector } from "react-redux";
function App() {
  const dataFromApp = useSelector(state => state.stateForApp);
  const error = dataFromApp.error;
  //using when sign up succesfully
  const location = useLocation();

  //note: LocalStorage is used for when user enter url (this will make state of app reset) so if user has aldready login then we can check localStorage

  return (
    <Fragment>
      <Header userID={GET_USERID(dataFromApp)} />
      {error && <p className="notification">Something went wrong! Please check error!</p>}
      {!error &&
        <Switch>
          <Route exact path="/">
            <Redirect to="/homepage" />
          </Route>
          <Route exact path="/homepage">
            {/* i dont mean to set images here but  i got problem and i dont know why if dont put it wont run useEffect */}
            <ImageItem isShowingFooter="true" images={dataFromApp.images} />
          </Route>
          <Route path="/signin">
            {location.search && <p className="notification">{location.search.split("=")[1]}</p>}
            <div className="form-container">
              <SignInForm />
              <SignUpForm />
            </div>
          </Route>
          <Route path="/resource">
            <UserFunction />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>}
    </Fragment >
  );
}

export default App;
