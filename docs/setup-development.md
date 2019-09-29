# Handover Tool - Development Setup

If you want to start contributing to Handover Tool as a developer, this is the right place to look at to setup HOT on your development machine.

## Pre-requisites

- Install [Docker](https://docs.docker.com/install/)
- Install [AWS DynamoDB local](https://hub.docker.com/r/amazon/dynamodb-local/) via docker: `docker pull amazon/dynamodb-local`

## Development Setup

- Run dynamo db locally: `docker run -p 8000:8000 amazon/dynamodb-local`
- [Fork](https://help.github.com/en/articles/fork-a-repo) this repository
- Git pull your forked repository into your directory of choice
- cd into your pulled forked repo and run:
  - To install the backend NodeJS: `npm install`
  - To install the frontend ReactJS app: `npm run client:install`
  - To define where DynamoDB is running: `export AWS_REGION="local"`
  - To run both the backend NodeJS server & the frontend ReactJS app: `npm run dev`

### DynamoDB Graphical Client

I use [dynamodb-admin](https://www.npmjs.com/package/dynamodb-admin) as a GUI client for DynamoDB and I quite like it! If you decide to use it, after installing it, you can run `export DYNAMO_ENDPOINT=http://localhost:8000 && dynamodb-admin -p 8001` to make it connect to your locally running DynamoDB.

## Running Tests

We have a good amount of tests that if you are developing, you might like to run and for sure update/add to.

To run the tests, you have to run another local DynamoDB as the test database:
`docker run -p 8010:8000 amazon/dynamodb-local`

And then make sure in the terminal that you are, you have set AWS_REGION to local: `export AWS_REGION="local"`

Then you can run the tests by getting into the source code directory and running: `npm run test`

To see the code coverage, you can run: `npm run test:coverage`
