# pokemon-no-go

## Setup

```
git clone https://github.com/JinpaLhawang/pokemon-no-go.git
cd pokemon-no-go
```

## Testing and Building

```
mvn test
mvn package
```

## Running Locally

Start MongoDB: `mongod --dbpath ~/mongodb/data/db/`
Start App via Maven: `mvn spring-boot:run` or via Java: `java -jar target/pokemon-no-go-0.0.1-SNAPSHOT.jar`

## Viewing UI Locally

http://localhost:8080

## Deploying to Pivotal Cloud Foundry Dev

Setup:
```
cf login -a https://api.run.pivotal.io
cf marketplace -s mlab
cf create-service mlab sandbox pokemon-no-go-db
```

Deploy using `manifest.yml`: `cf push`
[View in Browser](http://pokemon-no-go.cfapps.io)
