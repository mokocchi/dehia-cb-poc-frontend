# DEHIA Circuit Breaker PoC Frontend
A frontend for a [Circuit Breaker](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) Proof-of-Concept using a DEHIA platform simplification

## Proof of Concept
The Results Service has a [Circuit Breaker](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) that can be enabled *by user* (for testing purposes).
The Collect Service can be disabled *by user* (again, for testing purposes).

The Results Service asks the Collect Service for the last results. If the Collect Service is "down" (disabled for the user) the request fails.

If the Circuit Breaker is enabled, when the first request fails, the circuit "opens" and another path is taken: the Results Service returns the last cached results instead. For a fixed amount of time (default: 3 minutes) the Results Service doesn't attempt a new request. When the time is up, the circuit "closes" again and requests can be made again.

## Installation
You can install the frontend either in containerized version using Docker or locally (on Linux) using Yarn.
### Docker
 1. Create an `src/env.js` file based in `src/env.dist` (See [Environment Variables](#Environment-Variables))
 2. If the gateway is also run with docker, take note of the docker network.
 3. Build the image: 
 ```
 docker image build -t <image-tag> .
 ```
 4. Run the container exposing the port you set in 4. (and using the network if needed): 
 ```
 docker run --name <container-name> -p <host-port>:80 [--network <poc-network>] <image-tag>
 ```
 5. Go to `http://localhost:<host-port>`. You should see a loading message, or the login page if the gateway is running.
## Run locally (Linux)
 1.Make sure you have `node` installed:
 ```
 node --ver
 ```
 2. Install `yarn` with `npm` or your package manager https://classic.yarnpkg.com/en/docs/install/#debian-stable
 3. Open a terminal in `./src`
 4. Install dependencies
 ```
 yarn install
 ```
 5. Create an `src/env.js` file based in `src/env.js.dist` (See [Environment Variables](#Environment-Variables))
 6. Set the port: `export PORT=<port>`
 7. Run the frontend
 ```
 yarn start
 ```
 8. Go to `http://localhost:<host-port>`. You should see a loading message, or the login page if the gateway is running.

 # Deploying to GitHub Pages
 You can deploy the frontend to [GitHub Pages](https://pages.github.com/) if you want a frontend that doesn't sleep.

 1. Install the `gh-pages` package:
 ```
 yarn add gh-pages --dev
 ```
 # Deploying to Heroku
 You can deploy the dockerized version to Heroku if you want.
 ## Prerequisites
 - Having the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
 - Having a heroku account and room for one more app

 ## Deploy
  1. Login in to the Heroku CLI
  ```
  heroku login
  ```
  2. Create a new app
  ```
  heroku create
  ```
  3. You can now change the app name if you want at the Heroku [Dashboard](https://dashboard.heroku.com/)
  4. Set the [Environment Variables](#Environment-Variables) from the Dashboard
  5. Set the stack to `container`
  ```
  heroku stack:set container
  ```
  6. Push app to heroku
  ```
  git push heroku master
  ```
  7. Go to https://<your-app>.herokuapp.com. You should see an "API Gateway" message.
  6. Now you can add the URL to the frontend or use the gateway with an HTTP client.
  