import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import styles from'./Movies.module.css';
import { useNavigate } from 'react-router-dom';

export default function Movies() {
  const [rowData, setRowData] = useState([]);
  const [rerender, setRerender] = useState(false);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const selectedOptionRef = useRef('');
  const apiLink = 'http://sefdb02.qut.edu.au:3000/movies/search';
  const [api, setApi] = useState(apiLink);

  const columns = [
    { headerName: 'ID', field: 'imdbID', hide: true},
    { headerName: 'Title', field: 'title', suppressMovable: true },
    { headerName: 'Year', field: 'year', suppressMovable: true },
    { headerName: 'IMBD rating', field: 'imdbRating', suppressMovable: true },
    { headerName: 'RottenTomatoes', field: 'rottenTomatoesRating', suppressMovable: true },
    { headerName: 'Metacritic', field: 'metacriticRating', suppressMovable: true },
    { headerName: 'Rated', field: 'classification', suppressMovable: true }
  ];

  const rowClassRules = {
    [styles.cursor]: () => true
  };

  function handleButtonClick() {
    const inputValue = inputRef.current.value;
    const dropValue = selectedOptionRef.current.value;
    setApi(api => apiLink);
        
    let input = false;
    let dropDown = false;
    if (inputValue.trim().length !== 0) {
      input = true;
    }
    
    if (dropValue.length !== 0) {
      dropDown = true;
    }

    switch (true) {
      case input && dropDown:
        setApi(prevApi => prevApi += `?title=${inputValue}&year=${dropValue}`);
        break;
      case input && !dropDown:
        setApi(prevApi => prevApi += `?title=${inputValue}`);
        break;        
      case !input && dropDown:
        setApi(prevApi => prevApi += `?year=${dropValue}`);
        break;
      default:     
    }  
    setRerender(true);
  }
  useEffect(() => {
    fetch(api)
      .then(response => response.json())
      .then(data => data.data)
      .then(data =>
        data.map(movie => ({
          imdbID: movie.imdbID,
          title: movie.title,
          year: movie.year,
          imdbRating: movie.imdbRating,
          rottenTomatoesRating: movie.rottenTomatoesRating,
          metacriticRating: movie.metacriticRating,
          classification: movie.classification
        }))
      )
      .then(movies => setRowData(movies));
      setRerender(rerender => false);
  }, [rerender]); // Add rerender to the dependency array to trigger re-fetch when rerender state changes

  return (
    <div className={styles.background}>
      <div className={styles['selector-bar']}>
        <input type="text" placeholder="Search..." id="myInput" ref={inputRef} autoComplete='off' />
        <select name="year" id="year" ref={selectedOptionRef}>
                <option value="">year</option>
                <option value="1990">1990</option>
                <option value="1991">1991</option>
                <option value="1992">1992</option>
                <option value="1993">1993</option>
                <option value="1994">1994</option>
                <option value="1995">1995</option>
                <option value="1996">1996</option>
                <option value="1997">1997</option>
                <option value="1998">1998</option>
                <option value="1999">1999</option>
                <option value="2000">2000</option>
                <option value="2001">2001</option>
                <option value="2002">2002</option>
                <option value="2003">2003</option>
                <option value="2004">2004</option>
                <option value="2005">2005</option>
                <option value="2006">2006</option>
                <option value="2007">2007</option>
                <option value="2008">2008</option>
                <option value="2009">2009</option>
                <option value="2010">2010</option>
                <option value="2011">2011</option>
                <option value="2012">2012</option>
                <option value="2013">2013</option>
                <option value="2014">2014</option>
                <option value="2015">2015</option>
                <option value="2016">2016</option>
                <option value="2017">2017</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
        </select>
        <button type="button" onClick={handleButtonClick}>Find my movie</button> {/* Fix onclick to onClick */}
      </div>
      <div className='ag-theme-balham-dark' id={styles.table} style={{ height: '700px', width: '136vh' }}>
        <AgGridReact 
          columnDefs={columns}
          rowData={rowData}
          rowClassRules={rowClassRules}
          onRowClicked={(row) => navigate(`/movie?imdbID=${row.data.imdbID}`)}
        />
        <span className={styles.reminder}>* Showing only up to first 100 results</span>
      </div>
    </div>
  );
}
