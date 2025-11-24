import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/singup">SingUp</Link>
        </li>
        <li>
          <Link to="/singin">SingIn</Link>
        </li>
        <li>
          <Link to="/user_profile">User Profile</Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
