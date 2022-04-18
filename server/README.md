# Web Scrapper based on RESTfull API

<img src="https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png" alt="drawing" width="150"/>

## A. Introduction

This Web Scrapper get movies and series data from a movie site. This project based on RESTfull API, so you can fetch it to get some movie dan series data. Every results of request you make will automatically save in the Database. That's why you need to configure your database to use this project.

## B. Installation

### 1. Configure .env varibles

Create an .env file in the root directory. See _.env.examples_ for variables naming, and fill out all the neccesary variables.

### 2. Installing all depedencies

Open up your terminal and type
`yarn` or `npm install` if you're using NPM. It'll downlad all the depedencies from the `package.json`

### 3. Run the RESTfull API in Development

In your opened terminal, type `yarn dev` or `npm run dev` if you're using NPM.

### 4. Convert All TypeScript file into Javascript

In your opened terminal, type ` yarn build`` or  `npm run build``` if you're using NPM.

### 5. Run the RESTfull API in Production

In your opened terminal, type ` yarn start`` or  `npm run start``` if you're using NPM.

## C. API Specification

### MOVIE

#### 1. GET ALL MOVIES

Request:

- Method: GET
- Endpoint: `/api/v1/movie/`
- Header:
  - Content-Type: application/json
  - Accept: application/json
- Query Samples:

```json
{
  "quality": "Bluray",
  "based": "trending"
}
```

Response:
<br>

```json
{
  "data": [{
    "title": "string",
    "genres": ["string"],
    "release": "string",
    "stars": ["string"],
    "duration": "string",
    "director": "string",
    "country": "string",
    "quality": "string",
    "poster": "string",
    "rating": "string",
    "trailer": "string" | null,
    "synopsis": "string",

    "links": [{
        "quality": "string",
        "links": [{
            "provider": "string",
            "src": "string"
        }]
    }]
  }],
  "info": {
    "page": "number",
    "nextURL": "string",
    "allPage": "number"
  },
  "error": null | "string"
}
```

#### 2. GET ONE MOVIE

Request:

- Method: GET
- Endpoint: `/api/v1/movie/:slug/one`
- Header:
  - Content-Type: application/json
  - Accept: application/json

Response:
<br>

```json
{
  "data": {
    "title": "string",
    "genres": ["string"],
    "release": "string",
    "stars": ["string"],
    "duration": "string",
    "director": "string",
    "country": "string",
    "quality": "string",
    "poster": "string",
    "rating": "string",
    "trailer": "string" | null,
    "synopsis": "string",

    "links": [{
        "quality": "string",
        "links": [{
            "provider": "string",
            "src": "string"
        }]
    }]
  },
  "error": null | "string"
}
```

#### 3. SCRAP ALL MOVIES

Request:

- Method: GET
- Endpoint: `/api/v1/movie/scrap`
- Header:
  - Content-Type: application/json
  - Accept: application/json

Response:
<br>

```json
{
  "data": [{
    "title": "string",
    "genres": ["string"],
    "release": "string",
    "stars": ["string"],
    "duration": "string",
    "director": "string",
    "country": "string",
    "quality": "string",
    "poster": "string",
    "rating": "string",
    "trailer": "string" | null,
    "synopsis": "string",

    "links": [{
        "quality": "string",
        "links": [{
            "provider": "string",
            "src": "string"
        }]
    }]
  }],
  "error": null | "string"
}
```

#### 4. SCRAP MOVIES WITH RANGE

Request:

- Method: GET
- Endpoint: `/api/v1/movie/scrap`
- Header:
  - Content-Type: application/json
  - Accept: application/json
- Query:

```json
{
  "startFrom": "number",
  "endAt": "number"
}
```

Response:
<br>

```json
{
  "data": [{
    "title": "string",
    "genres": ["string"],
    "release": "string",
    "stars": ["string"],
    "duration": "string",
    "director": "string",
    "country": "string",
    "quality": "string",
    "poster": "string",
    "rating": "string",
    "trailer": "string" | null,
    "synopsis": "string",

    "links": [{
        "quality": "string",
        "links": [{
            "provider": "string",
            "src": "string"
        }]
    }]
  }],
  "error": null | "string"
}
```

#### 5. UPDATE LIST OF MOVIES

Request:

- Method: GET
- Endpoint: `/api/v1/movie/scrap/update`
- Header:
  - Content-Type: application/json
  - Accept: application/json

Response:
<br>

```json
{
  "data": [{
    "title": "string",
    "genres": ["string"],
    "release": "string",
    "stars": ["string"],
    "duration": "string",
    "director": "string",
    "country": "string",
    "quality": "string",
    "poster": "string",
    "rating": "string",
    "trailer": "string" | null,
    "synopsis": "string",

    "links": [{
        "quality": "string",
        "links": [{
            "provider": "string",
            "src": "string"
        }]
    }]
  }],
  "error": null | "string"
}
```

#### 6. SEARCH MOVIES

Request:

- Method: GET
- Endpoint: `/api/v1/movie/search`
- Header:
  - Content-Type: application/json
  - Accept: application/json
- Query:

```json
{
  "q": "string"
}
```

Response:
<br>

```json
{
  "data": [{
    "title": "string",
    "genres": ["string"],
    "release": "string",
    "stars": ["string"],
    "duration": "string",
    "director": "string",
    "country": "string",
    "quality": "string",
    "poster": "string",
    "rating": "string",
    "trailer": "string" | null,
    "synopsis": "string",

    "links": [{
        "quality": "string",
        "links": [{
            "provider": "string",
            "src": "string"
        }]
    }]
  }],
  "error": null | "string"
}
```

### SERIES

#### 1. GET ALL SERIES

Request:

- Method: GET
- Endpoint: `/api/v1/series/`
- Header:
  - Content-Type: application/json
  - Accept: application/json
- Query Samples:

```json
{
  "status": "Ongoing",
  "based": "newest"
}
```

Response:
<br>

```json
{
  "data": [{
      "title": "string",
      "genres": ["string"],
      "status": "string",
      "release": "string" | undefined,
      "stars": ["string"],
      "duration": "string",
      "country": "string",
      "poster": "string",
      "rating": "string",
      "trailer": "string" | undefined,
      "director": "string" | undefined,
      "synopsis": "string",

      "links": [{
        "episode": "string",
        "links": [{
          "quality": "string",
          "links": {
            "provider": "string",
            "src": "string"
            }
          }]
      }]
  }],
  "info": {
    "page": "number",
    "nextURL": "string",
    "allPage": "number"
  },
  "error": null | "string"
}
```

#### 2. GET ONE SERIES

Request:

- Method: GET
- Endpoint: `/api/v1/series/:slug/one`
- Header:
  - Content-Type: application/json
  - Accept: application/json

Response:
<br>

```json
{
  "data": {
      "title": "string",
      "genres": ["string"],
      "status": "string",
      "release": "string" | undefined,
      "stars": ["string"],
      "duration": "string",
      "country": "string",
      "poster": "string",
      "rating": "string",
      "trailer": "string" | undefined,
      "director": "string" | undefined,
      "synopsis": "string",

      "links": [{
        "episode": "string",
        "links": [{
          "quality": "string",
          "links": {
            "provider": "string",
            "src": "string"
            }
          }]
      }]
  },
  "error": null | "string"
}
```

#### 3. GET ALL SERIES

Request:

- Method: GET
- Endpoint: `/api/v1/series/scrap`
- Header:
  - Content-Type: application/json
  - Accept: application/json

Response:
<br>

```json
{
  "data": [{
      "title": "string",
      "genres": ["string"],
      "status": "string",
      "release": "string" | undefined,
      "stars": ["string"],
      "duration": "string",
      "country": "string",
      "poster": "string",
      "rating": "string",
      "trailer": "string" | undefined,
      "director": "string" | undefined,
      "synopsis": "string",

      "links": [{
        "episode": "string",
        "links": [{
          "quality": "string",
          "links": {
            "provider": "string",
            "src": "string"
            }
          }]
      }]
  }],
  "error": null | "string"
}
```

#### 4. GET SERIES WITH RANGE

Request:

- Method: GET
- Endpoint: `/api/v1/series/scrap`
- Header:
  - Content-Type: application/json
  - Accept: application/json
- Query:

```json
{
  "startFrom": "number",
  "endAt": "number"
}
```

Response:
<br>

```json
{
  "data": [{
      "title": "string",
      "genres": ["string"],
      "status": "string",
      "release": "string" | undefined,
      "stars": ["string"],
      "duration": "string",
      "country": "string",
      "poster": "string",
      "rating": "string",
      "trailer": "string" | undefined,
      "director": "string" | undefined,
      "synopsis": "string",

      "links": [{
        "episode": "string",
        "links": [{
          "quality": "string",
          "links": {
            "provider": "string",
            "src": "string"
            }
          }]
      }]
  }],
  "error": null | "string"
}
```

#### 5. UPDATE LIST OF SERIES

Request:

- Method: PUT
- Endpoint: `/api/v1/series/scrap/update`
- Header:
  - Content-Type: application/json
  - Accept: application/json

````

Response:
<br>

```json
{
  "data": [{
      "title": "string",
      "genres": ["string"],
      "status": "string",
      "release": "string" | undefined,
      "stars": ["string"],
      "duration": "string",
      "country": "string",
      "poster": "string",
      "rating": "string",
      "trailer": "string" | undefined,
      "director": "string" | undefined,
      "synopsis": "string",

      "links": [{
        "episode": "string",
        "links": [{
          "quality": "string",
          "links": {
            "provider": "string",
            "src": "string"
            }
          }]
      }]
  }],
  "error": null | "string"
}
````

#### 6. UPDATE SERIES STATUS

Request:

- Method: PUT
- Endpoint: `/api/v1/series/status`
- Header:
  - Content-Type: application/json
  - Accept: application/json

````

Response:
<br>

```json
{
  "data": [{
      "title": "string",
      "genres": ["string"],
      "status": "string",
      "release": "string" | undefined,
      "stars": ["string"],
      "duration": "string",
      "country": "string",
      "poster": "string",
      "rating": "string",
      "trailer": "string" | undefined,
      "director": "string" | undefined,
      "synopsis": "string",

      "links": [{
        "episode": "string",
        "links": [{
          "quality": "string",
          "links": {
            "provider": "string",
            "src": "string"
            }
          }]
      }]
  }],
  "error": null | "string"
}
````

#### 7. SEARCH SERIES

Request:

- Method: PUT
- Endpoint: `/api/v1/series/status`
- Header:
  - Content-Type: application/json
  - Accept: application/json
- Query:

```json
{
  "q": "string"
}
```

````
Response:
<br>

```json
{
  "data": [{
      "title": "string",
      "genres": ["string"],
      "status": "string",
      "release": "string" | undefined,
      "stars": ["string"],
      "duration": "string",
      "country": "string",
      "poster": "string",
      "rating": "string",
      "trailer": "string" | undefined,
      "director": "string" | undefined,
      "synopsis": "string",

      "links": [{
        "episode": "string",
        "links": [{
          "quality": "string",
          "links": {
            "provider": "string",
            "src": "string"
            }
          }]
      }]
  }],
  "error": null | "string"
}
````

## D. What's Next?

Deploy!

## E. That's it

That's it. Hope you find it usefull, and Happy Coding!! :)

```typescript
const author: string = "NovqiGarrix";
```
