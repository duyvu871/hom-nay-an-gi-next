#bash/bin

curl --request POST 'http://localhost:54321/functions/v1/embed' --header 'Authorization: Bearer ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{ "input": "hello world" }'