import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [filter, setFilter] = useState('gaussian');
  const [outputImage, setOutputImage] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleReferenceFileChange = (event) => {
    setReferenceFile(event.target.files[0]);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image file first.');
      return;
    }

    const formData = new FormData();
    // formData.append('image', selectedFile);

    if (filter === 'histogram') { 
      if (!referenceFile) {
        alert('Please select a reference image file for histogram matching.');
        return;
      }
      formData.append('source', selectedFile);
      formData.append('reference', referenceFile);
    } else {
      formData.append('image', selectedFile);
    }

    try {
      const response = await axios.post(`http://localhost:3000/${filter}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOutputImage(response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading the image', error);
      alert('Error processing the image. Please try again.');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Image Processing with Filters</h1>
      </header>
      <main className="app-main">
        <div className="upload-section">
          <div className="image-placeholder">
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="image-preview" />
            ) : (
              <p>Upload an image</p>
            )}
          </div>
          <input type="file" onChange={handleFileChange} />
        </div>
        {filter === 'histogram' && (
          <div className="upload-section">
            <div className="image-placeholder">
              {referenceFile ? (
                <img src={URL.createObjectURL(referenceFile)} alt="Reference" className="image-preview" />
              ) : (
                <p>Upload a reference image</p>
              )}
            </div>
            <input type="file" onChange={handleReferenceFileChange} />
          </div>
        )}
        <div className="filters-section">
          <label htmlFor="filters">Choose a filter:</label>
          <select id="filters" value={filter} onChange={handleFilterChange}>
            <option value="gaussian">Gaussian Filter</option>
            <option value="butterworth">Butterworth Filter</option>
            <option value="laplacian">Laplacian Filter</option>
            <option value="histogram">Histogram Matching</option>
          </select>
        </div>
        <button className="upload-button" onClick={handleUpload}>
          Apply Filter
        </button>
        {outputImage && (
          <div className="output-section">
            <h2>Output Image:</h2>
            <img src={outputImage} alt="Output" className="output-image" />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
