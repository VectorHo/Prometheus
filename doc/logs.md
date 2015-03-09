# Logs Manager
***
* [Logs Introduce](#Logs Introduce)
* [Logs Search field](#Logs Search field)
* [Logs Paging](#Logs Paging)
***

## Logs Introduce
After the authentication by logging. The log has the following fields:

Name | Type | required | Description
-----|----- |----------| -----------|
`type` | `string` | `yes` | "user", "project", "job"
`identifier`|`string`| `yes` | it's request-id
`action`|`string`|`yes`| "GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "TRACE"
`source`|`String`|`yes`| req.host
`url`|`String`|`yes`| request.originalUrl
`project`|`String`|`no`| If you is the project of the operation, the project name will be recorded
`user`|`String`|`yes`| Records of the user's name
`job`|`String`|`no`| If you is the job of the operation, the job name will be recorded
`level`|`String`|`yes`| "red", "yellow", "green"
`comment`|`String`|`no`| Records the comment
`time`|`String`|``| Records the time


## Logs Search field

You can search the following fields:

Name | Type | required | Description
-----|----- |----------| -----------|
`type` | `string` | `yes` | "user", "project", "job"
`action`|`string`|`yes`| "GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "TRACE"
`project`|`String`|`no`| If you is the project of the operation, the project name will be recorded
`user`|`String`|`yes`| Records of the user's name
`job`|`String`|`no`| If you is the job of the operation, the job name will be recorded
`level`|`String`|`yes`| "red", "yellow", "green"
`time`|`String`|``| Records the time


query:

	GET api/v1/logs?...&...
	
```
eg: http://localhost:3000/api/v1/logs?action=POST

{
  "current_page": 1,
  "count": 2,
  "logs": [
    {
      "_id": "54de215bac712efe73db63e3",
      "identifier": "506c43d0-6684-4401-afea-a4f5b616cc64",
      "action": "POST",
      "source": "localhost:3000",
      "url": "/api/v1/search",
      "level": "green",
      "time": "2015-02-13T16:07:55.942Z"
    },
    {
      "_id": "54de2153ac712efe73db63e2",
      "identifier": "5391446b-9595-46d4-977c-7615d02942b7",
      "action": "POST",
      "source": "localhost:3000",
      "url": "/api/v1/search",
      "level": "green",
      "time": "2015-02-13T16:07:47.772Z"
    }
  ]
}

eg: http://localhost:3000/api/v1/logs?action=POST&level=red

{
    "current_page": 1,
    "count": 1,
    "logs": [
        {
            "_id": "54de20dbac712efe73db63e0",
            "identifier": "74eed4b7-1154-46f5-bc91-a6ba489bceda",
            "action": "POST",
            "source": "localhost:3000",
            "url": "/api/v1/search",
            "level": "red",
            "comment": "SyntaxError: Unexpected token /",
            "time": "2015-02-13T16:05:47.892Z"
        }
    ]
}

eg: http://localhost:3000/api/v1/logs?beginTime=2015-02-16&endTime=2015-02-17

{
    "current_page": 1,
    "count": 1,
    "logs": [
        {
            "_id": "54e21276bffecc32a5c4b3d2",
            "identifier": "d1d61e22-2b27-4f13-91b9-75bfd1dcb447",
            "type": "user",
            "action": "GET",
            "source": "localhost:3000",
            "url": "/api/v1/logs?beginTime=2015-02-15&endTime=2015-02-16",
            "level": "green",
            "comment": {
                "request": {
                    "method": "GET",
                    "url": "/api/v1/logs?beginTime=2015-02-15&endTime=2015-02-16",
                    "header": {
                        "host": "localhost:3000",
                        "connection": "keep-alive",
                        "cache-control": "no-cache",
                        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36",
                        "accept": "*/*",
                        "accept-encoding": "gzip, deflate, sdch",
                        "accept-language": "zh-CN,zh;q=0.8,en;q=0.6",
                        "cookie": "lang=zh-CN"
                    }
                },
                "response": {
                    "status": 404,
                    "message": "Not Found",
                    "header": {
                        "vary": "Accept-Encoding",
                        "content-type": "application/json; charset=utf-8",
                        "request-id": "d1d61e22-2b27-4f13-91b9-75bfd1dcb447",
                        "x-powered-by": "Prometheus",
                        "server": "koa",
                        "x-pretty-print": "true",
                        "etag": "\"k9rltPV5/dZWEy+dm/787Q==\"",
                        "content-encoding": "gzip"
                    }
                },
                "app": {
                    "subdomainOffset": 2,
                    "env": "development"
                },
                "originalUrl": "/api/v1/logs?beginTime=2015-02-15&endTime=2015-02-16",
                "req": "<original node req>",
                "res": "<original node res>",
                "socket": "<original node socket>"
            },
            "time": "2015-02-16T15:53:26.332Z"
        }
    ]
}

```
  

## Logs Paging

TODO...

