# MOONE API

All endpoints and info about the API.

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

`GET /api/ip/get-ip-list`

##### Response

```json
{
  "ipList": ["1"]
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
