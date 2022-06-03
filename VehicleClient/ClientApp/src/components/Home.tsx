import * as React from 'react';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import './vehicleStyles.css';

const Home = () => (
  <div id="homeDiv">
    <h1>Hello!</h1>
      <p>Welcome to Z33xMaison, Vehicles Departments</p>
      
      <Link className="text-dark" to="/fetch-data">Click to Manage Vehicles</Link>
      
  </div>
);

export default connect()(Home);
