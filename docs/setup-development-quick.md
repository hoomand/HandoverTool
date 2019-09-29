## Local Run

1. Run local dynamoDB docker image as dev database: docker run -p 8000:8000 amazon/dynamodb-local
2. Run local dynamoDB docker image as test database: docker run -p 8010:8000 amazon/dynamodb-local
3. Run dynamodb-admin to show local dev database: export DYNAMO_ENDPOINT=http://localhost:8000 && dynamodb-admin -p 8001
4. Run dynamodb-admin to show local test database: export DYNAMO_ENDPOINT=http://localhost:8010 && dynamodb-admin -p 8011
5. Set the AWS region environement variable in the same terminal window you want to run the web server: export AWS_REGION="local"
6. Run HandoverTool web server from within the source code directory: npm run server
