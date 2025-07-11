﻿# Airport API

This project is a Node.js application that provides a RESTful API to retrieve airport information based on its IATA code.

## Features

- Fetches detailed airport information.
- Includes associated city and country data.
- Caches responses for improved performance.
- Imports data from CSV files into a SQLite database.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **ORM:** TypeORM
- **CSV Parsing:** `csv-parser`
- **Caching:** `node-cache`
- **Logging:** `winston`

## Project Structure

```
.
├── .gitignore
├── README.md
├── package-lock.json
├── package.json
└── src
    ├── app.js
    ├── data-source.js
    ├── database-files
    │   ├── airport.csv
    │   ├── city.csv
    │   └── country.csv
    ├── entity
    │   ├── Airport.js
    │   ├── City.js
    │   └── Country.js
    ├── import-csv.js
    └── routes
        └── airport.js
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd AirportApi
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application

To start the server, run the following command:

```bash
npm start
```

## API Endpoints

### Get Airport by IATA Code

Retrieves detailed information for a specific airport using its 3-letter IATA code.

- **URL:** `/api/airport/:iata_code`
- **Method:** `GET`
- **URL Params:**
  - `iata_code=[string]` (required) - The IATA code of the airport (e.g., `AAA`).

- **Success Response:**

  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "airport": {
        "id": 6523,
        "icao_code": "NTGA",
        "iata_code": "AAA",
        "name": "Anaa Airport",
        "type": "medium_airport",
        "latitude_deg": -17.3529,
        "longitude_deg": -145.509,
        "elevation_ft": 7,
        "address": {
          "city": {
            "id": 47868,
            "name": "Anaa",
            "country_id": 170,
            "is_active": true,
            "lat": -17.4079,
            "long": -145.425
          },
          "country": {
            "id": 170,
            "name": "French Polynesia",
            "country_code_two": "PF",
            "country_code_three": "PYF",
            "mobile_code": 689,
            "continent_id": 6
          }
        }
      }
    }
    ```

- **Error Responses:**

  - **Code:** 400 Bad Request
    **Content:** `{ "error": "Invalid IATA code format" }`

  - **Code:** 404 Not Found
    **Content:** `{ "error": "Airport not found" }`
