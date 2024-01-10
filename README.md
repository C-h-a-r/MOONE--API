# MOONE API


## Run Scripts

##### Run The API

`npm run api`

##### Run The Bot

`npm run bot`

##### Run Everything

`npm run boot`

## Endpoints

#### IP Connect

##### Request

`POST /api/ip/append-ip`

##### Response

```json
{
  "message": "IP 1 added to the HashSet"
}
```

##### Request

`POST /api/ip/remove-ip`

##### Response

```json
{
  "message": "IP 1 removed from the HashSet"
}
```

##### Request

`GET /api/ip/get-ip-count`

##### Response

```json
{
  "ipCount": 1
}
```
