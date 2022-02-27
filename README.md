```sh
curl --request POST \
  --header 'content-type: application/json' \
  --url 'http://localhost:4000/' \
  --data '{"query":"query { __typename }"}'
```

```sh
curl --request POST \
  --header 'content-type: application/json' \
  --url 'http://localhost:4000/' \
  --data '{"query":"query { users { name messages { body } } }"}'
```
