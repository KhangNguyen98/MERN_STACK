import { Fragment } from "react"
import "./Header.css";
import { Link } from "react-router-dom";

//using redux
import { useDispatch } from "react-redux";


import { logOut } from "../../custom-function/logOut";

import { useCallback } from "react";

const Header = ({ userID }) => {

 const dispatch = useDispatch();

 const exit = useCallback(
  () => {
   logOut(dispatch);
  }, [dispatch]
 );

 return (
  <Fragment>
   <div className="header">
    <Link to="/homepage" className="logo-container">
     <img src="https://docs.nestjs.com/assets/logo-small.svg" alt="logo-for-my-web"></img>
    </Link>
    <div className="options">
     {!userID && <Link to="/signin">SIGN IN</Link>}
     {userID && <Link to="/resource">YOUR RESOURCE</Link>}
     {userID && <Link to="/" onClick={exit}>LOG OUT</Link>}
    </div>
   </div>
  </Fragment>
 )
}

export default Header;