import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { countries, topic, sector, region, source, end_year } from './components/FilterData';
import './style.css'

const App = () => {

  const [displayedDataLimit, setDisplayedDataLimit] = useState(10);
  const [totalDataPoints, setTotalDataPoints] = useState(0);

  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedEnd_year, setSelectedEnd_year] = useState('');
  const [selectedXAxis, setSelectedXAxis] = useState('Intensity');
  const [selectedYAxis, setSelectedYAxis] = useState('Relevance')
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/data?topic=${selectedTopic}&country=${selectedCountry}&sector=${selectedSector}&region=${selectedRegion}&source=${selectedSource}&end_year=${selectedEnd_year}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', `http://localhost:5000/api/data?topic=${selectedTopic}&country=${selectedCountry}&sector=${selectedSector}`);
      console.log('Fetched Data:', data);
      setChartData(data);
      setTotalDataPoints(data.length);
      console.log("data leng", data.length)
      console.log("dislay limit", displayedDataLimit)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    setDisplayedDataLimit(10);
  }, [selectedTopic, selectedCountry, selectedSector, selectedRegion, selectedSource, selectedEnd_year, selectedXAxis, selectedYAxis]);


  const handleLoadMoreData = () => {
    setDisplayedDataLimit((prevLimit) => prevLimit + 10);
  };

  const handleShowLessData = () => {
    setDisplayedDataLimit((prevLimit) => Math.max(prevLimit - 10, 0));
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleXAxisChange = (e) => {
    setSelectedXAxis(e.target.value);
  };

  const handleYAxisChange = (e) => {
    setSelectedYAxis(e.target.value);
  };

  const formattedChartData = [[selectedXAxis.toLowerCase(), selectedYAxis.toLowerCase()], ...chartData.map(item => [`${item[selectedYAxis.toLowerCase()]} (${item.end_year})`, item[selectedXAxis.toLowerCase()]])];

  const limitedChartData = formattedChartData.slice(0, displayedDataLimit);

  console.log('Formatted Chart Data:', formattedChartData);
  const titleCountry = selectedCountry || 'World';
  const options = {
    title: `${selectedTopic} Industry Insights in ${titleCountry}`,
    hAxis: { title: selectedXAxis, format: '0' },
    vAxis: { title: selectedYAxis, format: '0' },
  };

  const options2 = {
    title: `${selectedTopic} Industry Insights in ${selectedCountry}`,
    hAxis: { title: selectedYAxis, format: '0' },
    vAxis: { title: selectedXAxis, format: '0' },
  };



  return (
    <div>
      <div className="filter-bar">
        <label>
          Topic:
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            {topic.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sector:
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            {sector.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Region:
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {region.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Source:
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            style={{ width: '100px' }}
          >
            {source.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          End Year:
          <select
            value={selectedEnd_year}
            onChange={(e) => setSelectedEnd_year(e.target.value)}
          >
            {end_year.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Country:
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countries.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleApplyFilters} className="apply-button">Apply</button>


      </div>

      <div className="filter-bar2">
        <label>
          X-Axis:
          <select value={selectedXAxis} onChange={handleXAxisChange}>
            {['Intensity', 'Likelihood', 'Relevance'].map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Y-Axis:
          <select value={selectedYAxis} onChange={handleYAxisChange}>
            {['Intensity', 'Likelihood', 'Relevance', 'End_Year', 'Country', 'Topic', 'Region'].map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleApplyFilters} className="apply-button">Apply</button>
      </div>

      {chartData.length === 0 ? (
        <p>No data available, because not all filters match any data from database.
          Try to select some categories empty or select another option.</p>
      ) : (
        <div>
          <h6 style={{ textAlign: 'center' }}>If the ( ) associated with values is empty this means it doesnt have the end year information. Also the last two charts from bottom cant have string on y axis, so the string is printed on x axis.</h6>
          <h6 style={{ textAlign: 'center' }}>By default only 10 datapoints are displayed. Click 'Load More Data' or 'Show Less Data' to increase or decrease data points displayed. Total data points fetched {totalDataPoints}</h6>
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleShowLessData} disabled={displayedDataLimit === 0}>Show Less Data</button>
            <button onClick={handleLoadMoreData} disabled={displayedDataLimit >= totalDataPoints}>Load More Data</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0px', marginTop: '0px' }}>
            <Chart
              width={'600px'}
              height={'300px'}
              chartType="BarChart"
              loader={<div>Loading Chart...</div>}
              data={limitedChartData}
              options={options}
            />

            <Chart
              width={'600px'}
              height={'300px'}
              chartType="Histogram"
              loader={<div>Loading Chart...</div>}
              data={limitedChartData}
              options={options}
            />

            <Chart
              width={'600px'}
              height={'300px'}
              chartType="ScatterChart"
              loader={<div>Loading Chart...</div>}
              data={limitedChartData}
              options={options2}
            />

            <Chart
              width={'600px'}
              height={'300px'}
              chartType="ColumnChart"
              loader={<div>Loading Chart...</div>}
              data={limitedChartData}
              options={options2}
            />

          </div>
        </div>

      )}

    </div>
  );
};

export default App;
