import './Home.css';
import {Link} from "react-router-dom";

function Home() {
  return (
    <div className="Home">
      <div id="mainBody">
        <div id="top-bar"><h1><Link to="/PathGuessr">PathGuessr</Link></h1></div>
        <div id="menu">
            <img id="logo" src="images/logo.png" alt="PathGuessr"/>
            <p>Welcome to PathGuessr - Gondwa</p>
            <Link to="/PathGuessr/game"><button id="play-button">Play</button></Link>
        </div>
        <div id="bottom-bar"><p>This is a FAN GAME made by Volkie and Tanks4lief. It is not created by or affiliated by any means to Alderon Games.</p></div>
      </div>
    </div>
  );
}

export default Home;
