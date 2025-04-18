"use strict";

// Fetch Data and Initialize Table
async function fetchData() {
  const response = await fetch('https://chartmetric-public.s3.us-west-2.amazonaws.com/make-music-equal/mme-data.csv');
  const csvText = await response.text();
  const rows = csvText.trim().split('\n');

  const data = rows.slice(1).map(row => {
    const values = row.split(',');
    return {
      artist_name: values[1].trim(),
      chartmetric_url: values[2].trim(),
      country_name: values[3].trim(),
      pronouns: values[4].trim(),
      is_band: values[5].trim(),
      genre: values[6].trim(),
    };
  });

  return data;
}

export async function renderSearchableTable() {
  const data = await fetchData();

  const gridOptions = {
    rowData: data,
    pagination: true,
    paginationPageSize: 50,
    paginationPageSizeSelector: false,
    columnDefs: [
      { headerName: "Artist", field: "artist_name", 
        cellRenderer: params => {
          const link = document.createElement("a");
          link.href = params.data.chartmetric_url;
          link.target = "_blank";
          link.textContent = params.value;
          return link;
        }},
      { headerName: "Country", field: "country_name" },
      { headerName: "Pronouns", field: "pronouns" },
      { headerName: "Composition", field: "is_band" },
      { headerName: "Genre", field: "genre" }
    ],
    defaultColDef: { flex: 1, minWidth: 150, sortable: true, filter: true }
  };

  const style = document.createElement("style");
  style.innerHTML = `
    /* Remove text decoration from links */
    .ag-cell a {
      color: inherit;
    }
    
    .ag-cell a:hover {
        font-weight: bold;
      }

    /* Bold headers */
    .ag-header-cell {
      font-weight: bold;
    }

    /* Highlight rows on hover */
    .ag-row:hover {
      background-color: #C0E7F4 !important;
    }

    overscroll-behavior: contain;
  `;
  document.head.appendChild(style);

  // Ensure the grid container exists
  const tableElement = document.querySelector("#searchable-table");

  // Initialize the table
  agGrid.createGrid(tableElement, gridOptions);
}
