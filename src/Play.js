import './Home.css';
import {Link} from "react-router-dom";
import L from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { IoMdPin  } from "react-icons/io";
/////////////////////////////////////

function Play() {
  const [usedPaths, setUsedPaths] = useState([]);
  const [gameStage, setGameStage] = useState(1);
  const [guessMode, setGuessMode] = useState(true);
  const [currentImagePath, setCurrentImagePath] = useState('images/locations/');
  const [currentImageInfo, setCurrentImageInfo] = useState([]);
  const [markerExists, setMarkerExists] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const mapRef = useRef(null);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const defaultIcon = new L.icon({
    iconUrl: require('../node_modules/leaflet/dist/images/pathMarker.png'),
    iconSize: [64, 64],
    iconAnchor: [32, 64],
    popupAnchor: [0, -2]
  });
  // MAP
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    
    // Initialize the map
    var CRSPixel = L.Util.extend(L.CRS.Simple, {
      transformation: new L.Transformation(1,0,1,0)
  });
    var map = L.map('map',{ crs: CRSPixel}, ).setView([0, 0], 1);
    var bounds = [[-400,-400], [400,400]];
    // Add the image overlay
    L.imageOverlay('images/gondwa.png', bounds).addTo(map);
    map.options.minZoom = 1;
    map.options.maxZoom = 6; 
    map.setMaxBounds(bounds);
    map.on('click', onMapClick);
    

    mapRef.current = map;
    getRandomImagePath();
    
  }, []);
  
  // Create a context for images in the public/images/locations folder
  
  const getRandomImagePath = () => {
    const images = require.context('../public/images/locations', true);
    const imagePaths = images.keys().filter(path => !path.includes('./tests') && !usedPaths.includes(path));
    if (imagePaths.length === 0) {
      // If all paths have been used, reset the usedPaths list
      setUsedPaths([]);
      return;
    }
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    const fileName = imagePaths[randomIndex].replace('./', '');
    setCurrentImagePath(`images/locations/${fileName}`);
    setUsedPaths([...usedPaths, imagePaths[randomIndex]]);
    setCurrentImageInfo(extractFileInfo(fileName));
};

useEffect(() => {
}, [currentImageInfo]);

  
 //Filename info extraction function
 function extractFileInfo(filename) {
  var parts = filename.split(/[xy.]/);
  var xCoord = parseInt(parts[1], 10);
  var yCoordPart = parts[2].match(/-?\d+/);
  var yCoord = parseInt(yCoordPart[0], 10);
  var regionCode = parts[2].match(/[a-zA-Z]+/);
  return [yCoord/1000, xCoord/1000, regionCode[0]];
}

// Region dictionary
const regionDictionary = {
  'as': 'Azure Shore',
  'ba': 'Barrens',
  'bql': 'Big Quill Lake',
  'bw': 'Birchwoods',
  'bc': 'Bleached Corals',
  'btc': 'Broken Tooth Canyon',
  'bf': 'Burned Forest',
  'ci': 'Castaway Isle',
  'dw': 'Dark Woods',
  'dc': 'Deepsea Crags',
  'ds': 'Deepsea Spires',
  'dp': 'Desolate Pass',
  'dl': 'Dried Lake',
  'fb': 'Flyers Bluff',
  'gk': 'Golden Kelp',
  'gop': 'Golden Plateau',
  'gp': 'Grand Plains',
  'gh': 'Green Hills',
  'gv': 'Green Valley',
  'he': 'Hoodoo Expanse',
  'hs': 'Hot Springs',
  'ht': 'Hunters Thicket',
  'ic': 'Impact Crater',
  'kf': 'Kelp Forest',
  'li': 'Lonely Isle',
  'tm': 'The Mudflats',
  'op': 'Ocean Pillars',
  'os': 'Ocean Stacks',
  'pi': 'Pebble Isle',
  'rh': 'Rainbow Hills',
  'ri': 'Red Island',
  'rkf': 'Red Kelp Forest',
  'rr': 'Red Reef',
  'rb': 'Ripple Beach',
  'rfh': 'Rockfall Hill',
  'si': 'Sanctuary Isle',
  'sc': 'Sand Caverns',
  'sf': 'Salt Flats',
  'sgl': 'Savanna Grassland',
  'sb': 'Seagrass Bay',
  'stm': 'Sharptooth Marsh',
  'sg': 'Snake Gully',
  'sm': 'Stego Mountain',
  'sh': 'Sunken Hoodoos',
  'ss': 'Sweetwater Shallows',
  'tt': 'The Teeth',
  'tp': 'Titan\'s Pass',
  'tf': 'Triad Falls',
  'vb': 'Volcano Bay',
  'wp': 'Wilderness Peak',
  'wco': 'Whistling Columns',
  'wc': 'White Cliffs',
  'yg': 'Young Grove'
};

function onMapClick(e) {
  var markerCounter = 0;
  var existingMarker = null;
  
  // Count markers and find the existing one
  mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
          markerCounter++;
          existingMarker = layer;
      }
  });

  if (markerCounter === 1) {
      // Make the existing marker draggable and move it to the clicked location
      existingMarker.setLatLng(e.latlng);
      existingMarker.dragging.enable();
  } else if (markerCounter === 0) {
      // Create a new draggable marker at the clicked location
      L.marker(e.latlng, { draggable: true, icon:defaultIcon }).addTo(mapRef.current);
      setMarkerExists(true);
  }
}

  
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const deltaX = lat2 - lat1;
      const deltaY = lon2 - lon1;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      return 10*distance;
    }

    function calculateScore(distance) {
      if (distance < 20) {
        return 100;
    } else if (distance >= 20 && distance <= 2000) {
        return Math.round(100 - (distance - 20) / 1980 * 100);
    } else {
        return 0;
    }
    }
    useEffect(() => {
      if (gameStage === 5 && !guessMode) {
        document.getElementById('totalScore').textContent = "Total Score: " + totalScore + " / 500";
      }
    }, [totalScore, gameStage, guessMode]);

  const Guess = () => { 
    setGuessMode(false);
    if (gameStage<6) {
      let guessMarker = null;

      // Iterate through the layers to find the marker
      mapRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
              guessMarker = layer;
          }
          if (guessMarker) {
            // Do something with guessMarker
            guessMarker.dragging.disable();
            const markerLatLng = guessMarker.getLatLng();
            let distance = calculateDistance(markerLatLng.lat,markerLatLng.lng,currentImageInfo[0],currentImageInfo[1]);
            let score = calculateScore(distance);
            setTotalScore(prevTotalScore => prevTotalScore + score);
            const secondMarkerLatLng = L.latLng(currentImageInfo[0], currentImageInfo[1]);
            const secondMarker = L.marker(secondMarkerLatLng, {icon:defaultIcon}).addTo(mapRef.current);
            document.getElementById('score').textContent = "Score: "+score;
            const lineCoordinates = [guessMarker.getLatLng(), secondMarker.getLatLng()];
            var line = L.polyline(lineCoordinates, { color: '#a32904' }).addTo(mapRef.current);
            var lineBounds = line.getBounds();
            var pad = 50;
            var paddedBounds = lineBounds.pad(pad / mapRef.current.getSize().y);
            mapRef.current.fitBounds(paddedBounds);
        }
      });
    } 
    
  };

  const Next = () => {
    if (gameStage<5) {
      setGuessMode(true);
      document.getElementById('imagePreview').src = '';
      getRandomImagePath();
      setGameStage(gameStage+1);
      document.getElementById('score').textContent = '';
      if (mapRef.current) {
        mapRef.current.setView([0, 0], 1);
        mapRef.current.eachLayer(layer => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                mapRef.current.removeLayer(layer);
                setMarkerExists(false);
            }
        });
    }
    }
  }

  const PlayAgain = () => {
    if (gameStage===5) {
      setUsedPaths([]);
      setGuessMode(true);
      getRandomImagePath();
      setTotalScore(prevTotalScore => 0);
      setGameStage(1);
      document.getElementById('score').textContent = '';
      document.getElementById('totalScore').textContent = '';
      if (mapRef.current) {
        mapRef.current.setView([0, 0], 1);
        mapRef.current.eachLayer(layer => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                mapRef.current.removeLayer(layer);
                setMarkerExists(false);
            }
        });
    }
    }
  }
  
  return (
    <div className="PlayApp">
        <div id="playBody">
            <div id="top-bar"><h1><Link to="/PathGuessr">PathGuessr</Link></h1></div>
            <div id="play-container">
                <div id="guess-panel">
                    <Link to="/PathGuessr"><img id="logo" src="images/logo.png" alt="PathGuessr"/></Link>
                    <p id="locP"><IoMdPin color='#d43504' size='30'/>&nbsp;Location: {gameStage}/5</p>
                    <img alt="" id="imagePreview" src={currentImagePath} width="600px" onClick={openModal}/>
                    {guessMode && <p><i><small>You can click on the image to enlarge it</small></i></p>}
                    {guessMode && <button id="guess-button" onClick={Guess} disabled={!markerExists}>Guess</button>}
                    {!guessMode && <p> </p>}
                    {!guessMode && <p>The location was in: {regionDictionary[currentImageInfo[2]]}</p>}
                    {!guessMode && gameStage < 5 && <button id="next-button" onClick={Next}>Next</button>}
                    <p id="score"></p>
                    <p id="totalScore"></p>
                    {!guessMode && gameStage === 5 && <button id="playagain-button" onClick={PlayAgain}>Play Again</button>}
                    
                </div>
                <div id="map" ref={mapRef}></div>
            </div>
        </div>
        {showModal && (
        <div className="modal">
          <span className="close" onClick={closeModal}>&times;</span>
          <img alt="" className="modal-content" src={currentImagePath} />
        </div>
      )}
    </div>
  );

  
}




export default Play;
