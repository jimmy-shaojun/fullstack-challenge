# Full-stack Engineer Challenge

The challenge consists of two parts:

- [Code Challenge](./CodeChallenge.md)
- [Written Challenge](./WrittenChallenge.md)

You can fork this repo to submit your work.

The challenges are designed to demonstrate the applicant's way of thinking and personal passions. All challenges are open ended, so please feel free to frame the questions as you see fit, or answer them in any way that you think interesting and revealing.

Enjoy and good luck!

## Code Challenge

The solution to this challenge is a web app that displays

* Top Sponsors (Buyers) for by amount
![](./top_sponsors.png?raw=true)
* Top Receivers (Writers or Authors) for by amount
![](./top_receivers.png?raw=true)
* Recent (90/120/150/180/365) curation events
![](./recent_curations.png?raw=true)
* For each curation event, view the content of that curation event
![](./view_ipfs.gif?raw=true)

### Prerequisite

Install asdf by following https://asdf-vm.com/guide/getting-started.html

If using Mac and zsh
```bash
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0
```

then add the following to ~/.zshrc:
```bash
. "$HOME/.asdf/asdf.sh"
```

Install docker and docker-compose following this https://docker.com/get-started/.

Now clone this repo, say into /home/user/fullstack-challenge, then

```bash
# enter working dir
> cd /home/user/fullstack-challenge
# asdf will install the required nodejs 20.9.0
> asdf install
# Install necessary node modules
> npm install
```

### System Design

This app consists of four components

* ipfs - an http IPFS endpoint 
* backend - a web service in nest.js that sync curation events from blockchain and provides GraphQL services to frontend
* frontend - a next.js frontend app
* common - the generated GraphQL schema

User --- interacts with ---> frontend --- calls GraphQL ---> backend

backend --- use web3.js to get blockchain ---> Polygon mainnet

frontend --- gets curation events with ipfs uri by GraphQL ---> backend

### Launch the app

Before launch, you need to 

First, start an instance of postgres. 

This repo already provides a compose.yml to start a postgres:16 instance with user/password postgres/postgres and `./pgdata` as volume.

```bash
> docker-compose up
```

Create .env file for backend
```bash
ETH_HTTPS_RPC_URL=https://polygon-mainnet.infura.io/v3/{your_api_key}
ETH_WEBSOCKET_RPC_URL=wss://polygon-mainnet.infura.io/ws/v3/{your_api_key}
CURATION_CONTRACT_ADDRESS=0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8
DATABASE_HOST=127.0.0.1 # assume you use Docker Desktop, if you use other instance of postgres, adjust DATABASE_ vars accordingly
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_DB=postgres
DATABASE_LOGGING=true
IPFS_URL=http://localhost:3002
```

Create .env file for frontend

```bash
NEXTJS_PUBLIC_IPFS_URL=http://localhost:3002/cat/
GRAPHQL_BACKEND_URL=http://localhost:3000/graphql
```

Launch ipfs, backend and frontend

In Terminal 1

```bash
# in /home/user/fullstack-challenge, build the workspace
# the below build command will build frontend, backend and ipfs
> npm run build
# then launch ipfs
> npm run ipfs:prod
```

In Terminal 2

```bash
# in /home/user/fullstack-challenge
> npm run backend:dev
```

In Terminal 3

```bash
# in /home/user/fullstack-challenge
> npm run frontend:dev
```

Now open Chrome browser and navigate to http://localhost:3001/, you shall see

![](./top_sponsors.png?raw=true)

### VSCode debug

You may use the following .vscode/launch.json

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "command": "cd packages/backend/ && npm run start:dev",
            "name": "Run backend",
            "request": "launch",
            "type": "node-terminal"
        }
        ,
        {
            "command": "cd packages/frontend/ && npm run dev",
            "name": "Run frontend",
            "request": "launch",
            "type": "node-terminal"
        }
        ,
        {
            "command": "cd packages/ipfs/ && npm run start:debug",
            "name": "Run ipfs daemon",
            "request": "launch",
            "type": "node-terminal"
        }
    ]
}
```