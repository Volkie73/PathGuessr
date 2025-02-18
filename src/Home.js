import './Home.css';
import {Link} from "react-router-dom";
import logo from './logo.png';

function Home() {
  return (
    <div className="Home">
      <div id="mainBody">
        <div id="top-bar"><h1><Link to="/PathGuessr">PathGuessr</Link></h1></div>
        <div id="menu">
            <img id="logo" src={logo} alt="PathGuessr"/>
            <p>Welcome to PathGuessr - Gondwa</p>
            <Link to="/PathGuessr/game"><button id="play-button">Play</button></Link>
        </div>
        <div id="bottom-bar"><p>This is a fan game made by Volkie and Tanks4lief. It is not created by or affiliated with Alderon Games.</p></div>
      </div>
    </div>
  );
}

export default Home;