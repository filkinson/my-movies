import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import styles from'./Movie.module.css';

export default function Movie() {
    const [searchParams] = useSearchParams();
    const imbdID = searchParams.get("imdbID");
    const [data, setData] = useState(null);
    const [dataRatings, setDataRatings] = useState([]);
    const [rowData, setRowData] = useState([]);
    const navigate = useNavigate();

    const columns = [
        { headerName: 'ID', field: 'id', hide: true},
        { headerName: 'Role', field: 'category', suppressMovable: true },
        { headerName: 'Name', field: 'name', suppressMovable: true },
        { headerName: 'Characters', field: 'characters', suppressMovable: true },

      ];

    const rowClassRules = {
      [styles.cursor]: () => true
    };
    

    useEffect(() => {
        fetch('http://sefdb02.qut.edu.au:3000/movies/data/' + imbdID)
          .then(response => response.json())
          .then(apiData => {
                const title = apiData.title;
                const year = apiData.year;
                const runtime = apiData.runtime;
                const genres = apiData.genres;
                const country = apiData.country;
                const boxoffice = apiData.boxoffice;
                const poster = apiData.poster;
                const plot = apiData.plot;

                setData({ title, year, runtime, genres, country, boxoffice, poster, plot });
            })
      }, []);   

      useEffect(() => {
        fetch('http://sefdb02.qut.edu.au:3000/movies/data/' + imbdID)
          .then(response => response.json())
          .then(apiPrincipalsData => apiPrincipalsData.principals)
          .then(apiPrincipalsData =>
            apiPrincipalsData.map(principal => ({
                id: principal.id,
                category: principal.category.replace(/_/g, ' ').replace(/\b\w/g, match => match.toUpperCase()),
                name: principal.name,
                characters: principal.characters
              }))
          )
          .then(principals => setRowData(principals));
      }, []);  

      useEffect(() => {
        fetch('http://sefdb02.qut.edu.au:3000/movies/data/' + imbdID)
          .then(response => response.json())
          .then(apiRatingsData => apiRatingsData.ratings)
          .then(apiRatingsData => {
            setDataRatings(apiRatingsData);
          })
      }, []);      
      
      const dataRatingsArray = Object.values(dataRatings);
      
      const title = data ? data.title : '';
      const year = data ? data.year : '';
      const runtime = data ? data.runtime : '';
      const genres = data ? data.genres : '';
      const genresList = genres ? genres.join(', ') : '';
      const country = data ? data.country : '';
      const boxoffice = data ? data.boxoffice : '';
      const boxofficeFormatted = boxoffice.toLocaleString();
      const poster = data ? data.poster : '';
      const plot = data ? data.plot : '';

    return (
        <div className={styles.background}>
        <div className={styles.container}>
          <h1>
            {title}
          </h1>
            <ul>
                <li>Released in: {year}</li>
                <li>Runtime: {runtime} minutes</li>
                <li>Genres: {genresList}</li>
                <li>Country: {country}</li>
                <li>Box Office: ${boxofficeFormatted}</li>
                <br></br>
                <li className={styles.plot}>{plot}</li>
            </ul>
            <div className="ag-theme-balham-dark" style={{ height: '320px', width: '66vh' }}>
                <AgGridReact 
                columnDefs={columns}
                rowData={rowData}
                rowClassRules={rowClassRules}
                onRowClicked={(row) => navigate(`/person?ID=${row.data.id}`)}
                />
            </div> 
            <div className={styles.rightSide}>
            <ul>
            <img src={poster} alt="Poster" />
            <div className={styles.ratings}>
            {dataRatingsArray.map(item => (
              <div key={item.id}>
                {item.source}: {item.value}
                {item.source === 'Internet Movie Database' && item.value ? '/10' : item.source === 'Internet Movie Database' ? 'NA' : null}
                {item.source === 'Rotten Tomatoes' && item.value ? '%' : item.source === 'Rotten Tomatoes' ? 'NA' : null}
                {item.source === 'Metacritic' && item.value ? '/100' : item.source === 'Metacritic' ? 'NA' : null}  
              </div>
            ))}  
            </div>  
            </ul>
            </div> 
            </div>        
        </div>
    )
}