import { useEffect, useState } from "react";
import { getHello } from "./services/api";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessage = () => {
    setLoading(true);
    setError(null);
    getHello()
      .then((data) => {
        // If the API returns text or an object, ensure it's safely set 
        setMessage(typeof data === 'string' ? data : JSON.stringify(data));
      })
      .catch(() => {
        setError("Failed to connect to the backend.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">🚀 CI/CD Explorer</div>
          <nav className="nav-links">
            <a href="#home" className="active">Home</a>
            <a href="#about">About</a>
            <a href="#settings">Settings</a>
          </nav>
        </div>
      </header>
      
      <main className="app-container">
        <div className="card">
          <h1 className="title">Backend Connection Status</h1>
          <p className="subtitle">Real-time status of your API connection</p>
          
          <div className="status-box">
            {loading ? (
              <div className="pulse">Loading data from backend...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <div className="success">Server says: "{message || 'No response'}"</div>
            )}
          </div>

          <button 
            className="refresh-button" 
            onClick={fetchMessage} 
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Ping Backend"}
          </button>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React & Vite. Continuous Integration & Deployment enabled.</p>
      </footer>
    </div>
  );
}

export default App;
