import React, { useState } from 'react';
import './App.css';

const API_KEY = "live_cqIquSjldpJEvQqzsBKT0Ta7tPYjV4iODUdiCsWNMSQmK50syXe5gn8YBxGoCnD8";

function App() {
  const [currentDog, setCurrentDog] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDog = async () => {
    setLoading(true);
    let attempts = 0;
    let dogData = null;

    while (attempts < 10) {
      try {
        const response = await fetch(
          'https://api.thedogapi.com/v1/images/search?has_breeds=1',
          { headers: { 'x-api-key': API_KEY } }
        );
        const data = await response.json();
        if (data && data.length > 0) {
          dogData = data[0];
          const breedName = (dogData.breeds && dogData.breeds.length > 0)
            ? dogData.breeds[0].name
            : "Unknown";
          if (!banList.includes(breedName)) {
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching dog data:", error);
      }
      attempts++;
    }

    if (dogData) {
      const breedInfo = (dogData.breeds && dogData.breeds.length > 0)
        ? dogData.breeds[0]
        : null;
      const dogObject = {
        image: dogData.url,
        breed: breedInfo ? breedInfo.name : "Unknown",
        temperament: breedInfo ? breedInfo.temperament : "Unknown",
        lifeSpan: breedInfo ? breedInfo.life_span : "Unknown",
      };
      setCurrentDog(dogObject);
      setHistory(prevHistory => [dogObject, ...prevHistory]);
    } else {
      alert("No dog found that isn't banned. Consider removing some breeds from your ban list.");
    }
    setLoading(false);
  };

  const toggleBan = (breed) => {
    if (banList.includes(breed)) {
      setBanList(banList.filter(item => item !== breed));
    } else {
      setBanList([...banList, breed]);
    }
  };

  return (
    <div className="moving-background">
      <div className="history">
        <h2>History</h2>
        {history.length === 0 ? (
          <p>No history yet.</p>
        ) : (
          history.map((dog, index) => (
            <div key={index} className="card">
              <img src={dog.image} alt={dog.breed} />
              <p>{dog.breed}</p>
            </div>
          ))
        )}
      </div>

      <div className="main">
        <h1>Dog Diaries</h1>
        <div style={{ marginBottom: "20px" }}>
          <button onClick={fetchDog} disabled={loading} style={{ padding: "10px 20px", fontSize: "16px" }}>
            {loading ? "Loading..." : "Discover a Dog!"}
          </button>
        </div>

        {currentDog && (
          <div className="api-container">
            <div className="api-image-container">
              <img src={currentDog.image} alt="Random Dog" />
            </div>
            <div className="api-dog-details">
              <p>
                <strong onClick={() => toggleBan(currentDog.breed)} style={{ cursor: 'pointer'}}>
                  {currentDog.breed}
                </strong>
              </p>
              <p>{currentDog.temperament}</p>
              <p>{currentDog.lifeSpan}</p>
            </div>
          </div>
        )}
      </div>

      <div className="ban-list">
        <h2>Ban List</h2>
        <h4>(click to remove)</h4>
        {banList.length === 0 ? (
          <p>No banned breeds.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {banList.map((breed, index) => (
              <li key={index} onClick={() => toggleBan(breed)} style={{ cursor: 'pointer', marginBottom: "5px", border: "1px solid #ddd", padding: "5px", borderRadius: "5px" }}>
                {breed}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
