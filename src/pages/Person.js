import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import styles from'./Person.module.css';
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

export default function Person() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("ID");
  const [data, setData] = useState(null);
  const url = `http://sefdb02.qut.edu.au:3000/people/${id}`;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"]
  const dataRatingsArray = Object.values(rowData);
  const calculateRatingCounts = () => {
    const dataRatingsArray = rowData.map(item => item.imdbRating);
    const counts = Array(10).fill(0); // Initialize counts array with 10 zeros

    dataRatingsArray.forEach(rating => {
      if (rating >= 0 && rating <= 1) {
        counts[0]++;
      } else if (rating > 1 && rating <= 2) {
        counts[1]++;
      } else if (rating > 2 && rating <= 3) {
        counts[2]++;
      } else if (rating > 3 && rating <= 4) {
        counts[3]++;
      } else if (rating > 4 && rating <= 5) {
        counts[4]++;
      } else if (rating > 5 && rating <= 6) {
        counts[5]++;
      } else if (rating > 6 && rating <= 7) {
        counts[6]++;
      } else if (rating > 7 && rating <= 8) {
        counts[7]++;
      } else if (rating > 8 && rating <= 9) {
        counts[8]++;
      } else if (rating > 9 && rating <= 10) {
        counts[9]++;
      }
    });

    return counts;
  };

  const ratingCounts = calculateRatingCounts();
  const dataChart = {
    labels: labels,
    datasets: [
      {
        label: "IMDB ratings at a glance",
        backgroundColor: "#003468",
        borderColor: "#003468",
        data: ratingCounts,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        color: 'white', // Change x-axis text color here
        ticks: {
          color: 'white', // Change x-axis tick color here
        },
        grid: {
          color: 'rgb(29, 29, 29)',
        }        
      },
      y: {
        color: 'white', // Change y-axis text color here
        ticks: {
          color: 'white', // Change y-axis tick color here
        },
        grid: {
          color: 'rgb(29, 29, 29)',
        }
      },
    },    
    plugins: {
      legend: {
        labels: {
          color: 'white', // Change text color here
        },
      },
    },    
  };  

  const columns = [
    { headerName: 'ID', field: 'movieId', hide: true},
    { headerName: 'Role', field: 'category', suppressMovable: true },
    { headerName: 'Movie', field: 'movieName', suppressMovable: true },
    { headerName: 'Characters', field: 'characters', suppressMovable: true },
    { headerName: 'Rating', field: 'imdbRating', suppressMovable: true },

  ];

const rowClassRules = {
  [styles.cursor]: () => true
};

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then(apiData => {
        const { name, birthYear, deathYear } = apiData;
        setData({ name, birthYear, deathYear });
      })   
      .catch((error) => console.log(error)
      );
  }, [url, token]);

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then(apiData => apiData.roles)
      .then(apiData => 
        apiData.map(role => ({
            movieName: role.movieName,
            movieId: role.movieId,
            category: role.category.replace(/_/g, ' ').replace(/\b\w/g, match => match.toUpperCase()),
            characters: role.characters,
            imdbRating: role.imdbRating
          }))
      )
      .then(roles => setRowData(roles))     
      .catch((error) => console.log(error));
  }, [url, token]);
  const name = data?.name || '';
  const birthYear = data?.birthYear || '';
  const deathYear = data?.deathYear || '';
  return (
    <div className={styles.background}>
        <div className={styles.container}>
        <h1>{name}</h1>
        <ul>
          {birthYear && <li>Born: {birthYear}</li>}
          {deathYear && <li>Died: {deathYear}</li>}
        </ul>
        <div className="ag-theme-balham-dark" id={styles.table} style={{ height: '200px', width: '87vh' }}>
            <AgGridReact 
                columnDefs={columns}
                rowData={rowData}
                rowClassRules={rowClassRules}
                onRowClicked={(row) => navigate(`/movie?imdbID=${row.data.movieId}`)}
            />
        </div> 
        <div className={styles.graph}>
          <Bar data={dataChart} options={options} />
        </div>               
        </div>   
    </div>
  );
}
