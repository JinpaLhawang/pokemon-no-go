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

Start MongoDB:
```
mongod --dbpath ~/mongodb/data/db/
```

Start App via Maven:
```
mvn spring-boot:run
```

Start App via Java:
```
java -jar target/pokemon-no-go-0.0.1-SNAPSHOT.jar
```

## Viewing UI Locally

http://localhost:8080

## Inserting Data Locally

```
curl -X POST 'http://localhost:8080/api/pokemons' -d '{ "number": 1, "name": "Bulbasaur", "type": "Grass/Poison", "candyToEvolve": "Bulbasaur", "numCandyToEvolve": 25, "combatPoints": 14, "healthPoints": 10 }' -H 'Content-Type: application/json'
```

## Requesting Data Locally

```
curl 'http://localhost:8080/api/pokemons'
```

## Running in Pivotal Cloud Foundry Dev

Setup:
```
cf login -a https://api.run.pivotal.io
cf marketplace -s mlab
cf create-service mlab sandbox pokemon-no-go-db
```

Deploying:
```
cf push
```

## Viewing UI in Pivotal Cloud Foundry Dev

http://pokemon-no-go.cfapps.io
