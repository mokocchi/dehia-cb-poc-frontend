# DEHIA Circuit Breaker PoC Frontend
A frontend for a [Circuit Breaker](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) Proof-of-Concept using a DEHIA platform simplification

## Contents
- [Proof of Concept](#proof-of-concept)
- [Installation](#installation)
  - [Docker](#docker)
  - [Run locally (Linux)](#run-locally)
- [Deploying to GitHub Pages (Linux)](#deploying-to-github-pages(linux))
- [Deploying to Heroku](#deploying-to-heroku)
  - [Prerequisites](#prerequisites)
  - [Deploy](#deploy)
- [Environment Variables](#environment-variables)
- [See Also](#see-also)

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
### Run locally (Linux)
 1. Make sure you have `node` installed:
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

 ## Deploying to GitHub Pages (Linux)
 You can deploy the frontend to [GitHub Pages](https://pages.github.com/) if you want a frontend that doesn't sleep.

 1. Make sure you have `node` installed:
 ```
 node --ver
 ```
 2. Install `yarn` with `npm` or your package manager https://classic.yarnpkg.com/en/docs/install/#debian-stable
 3. Create an `src/env.js` file based in `src/env.js.dist` (See [Environment Variables](#Environment-Variables))
 4. Open a terminal in `./src`
 5. Install dependencies (if you haven't yet)
 ```
 yarn install
 ```
 6. Install `git`:
 ```
 sudo apt-get install git
 ```
 7. Configure your user and email (if you haven't yet)
 8. Create a GitHub repository
 9. Set the `homepage` key in the `src/package.json` file to `https://<your-github-user>.github.io/<your-repository>`
 10. Open a terminal in the root folder
 11. Initialize the repository
 ```
 git init
 ```
 12. Commit changes
 ```
 git add .
 git commit -m "Initial commit"
 ```
 13. Set the repository remote 
 ```
 git remote add origin <your-repository-url>
 ```
 14. Push the changes
 ```
 git push origin master
 ```
 15. Deploy to GitHub
 ```
 yarn deploy
 ```
 16. Go to `https://<your-github-user>.github.io/<your-repository>`. You should see a loading message, or the login page if the gateway is running.

 ## Deploying to Heroku
 You can deploy the dockerized version to Heroku if you want, but I do not recommend this because you will use up one app for static content, and it sleeps after 30 min of inactivity (Free tier).
 ### Prerequisites
 - Having the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
 - Having a heroku account and room for one more app

 ### Deploy
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
  7. Go to `https://<your-app>.herokuapp.com`. You should see a loading message, or the login page if the gateway is running.
  
  ## Environment Variables
  - **GATEWAY_URL**: URL of the Gateway. If you're using Docker in the frontend and the gateway at the same time, create a network first (`docker network create <poc-network>`) and then run the other containers. Run `docker network inspect <poc-network>` to get the IP address of the other container and take note. Don't forget to add the port if it's different from Port `80`.
  ## See also
- [DEHIA Circuit Breaker PoC Gateway](https://github.com/mokocchi/dehia-cb-poc-gateway)
- [DEHIA Circuit Breaker PoC Collect Service](https://github.com/mokocchi/dehia-cb-poc-collect)
- [DEHIA Circuit Breaker PoC Results Service](https://github.com/mokocchi/dehia-cb-poc-results)