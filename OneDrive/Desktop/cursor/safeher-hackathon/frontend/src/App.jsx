import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [position, setPosition] = useState([51.505, -0.09]); // Default to London
  const [userLocation, setUserLocation] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sosSent, setSosSent] = useState(false);
  
  const recognitionRef = useRef(null);

  // Initialize geolocation and speech recognition
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request geolocation
      await requestGeolocation();
      
      // Initialize speech recognition
      initializeSpeechRecognition();
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize app: ' + err.message);
      setIsLoading(false);
    }
  };

  const requestGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = [latitude, longitude];
          setPosition(newPosition);
          setUserLocation(newPosition);
          addLog('Location obtained successfully', 'location');
          resolve(newPosition);
        },
        (error) => {
          const errorMessage = `Geolocation error: ${error.message}`;
          setError(errorMessage);
          addLog(errorMessage, 'error');
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported by this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      addLog('Voice recognition started', 'voice');
    };

    recognition.onend = () => {
      setIsListening(false);
      addLog('Voice recognition stopped', 'voice');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      addLog(`Voice detected: "${transcript}"`, 'voice');
      
      // Check for help keywords
      const helpKeywords = ['help', 'help me', 'i need help', 'emergency', 'sos'];
      const isHelpRequest = helpKeywords.some(keyword => transcript.includes(keyword));
      
      if (isHelpRequest) {
        addLog('Help request detected via voice!', 'voice');
        sendSOS('voice');
      }
    };

    recognition.onerror = (event) => {
      addLog(`Voice recognition error: ${event.error}`, 'error');
      setIsListening(false);
    };

    setRecognition(recognition);
    recognitionRef.current = recognition;
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        addLog(`Failed to start listening: ${error.message}`, 'error');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const sendSOS = async (source = 'manual') => {
    if (!userLocation) {
      addLog('Cannot send SOS: Location not available', 'error');
      return;
    }

    const sosData = {
      userId: "Karthi",
      lat: userLocation[0],
      lng: userLocation[1],
      source: source,
      timestamp: new Date().toISOString()
    };

    try {
      setSosSent(true);
      addLog(`Sending SOS (${source})...`, 'sos');
      
      const response = await axios.post(`${BACKEND_URL}/api/sos`, sosData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      addLog(`SOS sent successfully! Response: ${JSON.stringify(response.data)}`, 'sos');
      
      // Reset SOS button after 3 seconds
      setTimeout(() => {
        setSosSent(false);
      }, 3000);
      
    } catch (error) {
      addLog(`Failed to send SOS: ${error.message}`, 'error');
      setSosSent(false);
    }
  };

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now(),
      timestamp,
      message,
      type
    };
    
    setLogs(prevLogs => [logEntry, ...prevLogs.slice(0, 49)]); // Keep last 50 logs
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Initializing SafeHer App...
      </div>
    );
  }

  return (
    <div className="app">
      <div className="map-container">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div>
                  <strong>Your Location</strong><br />
                  <span className="coordinates">
                    {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}
                  </span>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="control-panel">
        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          🚨 SafeHer Emergency SOS
        </h1>

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {userLocation && (
          <div className="location-info">
            <div>
              <span className="status-indicator status-location"></span>
              <strong>Location Acquired</strong>
            </div>
            <div className="coordinates">
              Lat: {userLocation[0].toFixed(6)}, Lng: {userLocation[1].toFixed(6)}
            </div>
          </div>
        )}

        <button
          className="sos-button"
          onClick={() => sendSOS('manual')}
          disabled={!userLocation || sosSent}
        >
          {sosSent ? 'SOS SENT!' : 'SOS'}
        </button>

        <div className="voice-controls">
          <button
            className="voice-button start-listening"
            onClick={startListening}
            disabled={isListening || !recognition}
          >
            <span className="status-indicator status-listening"></span>
            Start Listening
          </button>
          <button
            className="voice-button stop-listening"
            onClick={stopListening}
            disabled={!isListening}
          >
            <span className="status-indicator status-stopped"></span>
            Stop Listening
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <span className="status-indicator status-voice"></span>
          <strong>Voice Status:</strong> {isListening ? 'Listening for help requests...' : 'Not listening'}
        </div>

        <div className="event-logs">
          <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
            📋 Event Logs
          </div>
          {logs.length === 0 ? (
            <div style={{ color: '#888', fontStyle: 'italic' }}>
              No events yet...
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className={`log-entry log-${log.type}`}>
                <span style={{ color: '#888' }}>[{log.timestamp}]</span> {log.message}
              </div>
            ))
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <div>Backend URL: {BACKEND_URL}</div>
          <div>User ID: Karthi</div>
          <div>Keywords: "help", "help me", "I need help"</div>
        </div>
      </div>
    </div>
  );
}

export default App;