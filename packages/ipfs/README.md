## Description

This is a simple IPFS http endpoint based on [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
#
#
# This ipfs app may crash due to below error 
# AbortError: The operation was aborted
#    at raceSignal 
#
# thus start:prod uses forver to relaunch in case of failure
$ npm run start:prod
```

By default, this IPFS web app runs on port 3002 with the following endpoints.

If `${cid}` is a folder or a file, below endpoint will return a json array

http://localhost:3002/ls/${cid}
```
curl http://localhost:3002/ls/QmcLXreutJeyacvyeY7XpwDRZ8e7j1V9QmKLekUjFLtncp

[{"cid":{"/":"QmcLXreutJeyacvyeY7XpwDRZ8e7j1V9QmKLekUjFLtncp"},"type":"file","path":"QmcLXreutJeyacvyeY7XpwDRZ8e7j1V9QmKLekUjFLtncp","size":27770,"name":"QmcLXreutJeyacvyeY7XpwDRZ8e7j1V9QmKLekUjFLtncp","depth":0}]
```

if `${cid}` is a folder, below endpoint will return empty content, otherwise it will return the content as is
http://localhost:3002/cat/${cid}

```
curl http://localhost:3002/cat/QmcLXreutJeyacvyeY7XpwDRZ8e7j1V9QmKLekUjFLtncp

will display the original html source code of the web page identified by above cid
```

## Test

There is no unit test in this repository since unit tests will fail with below messgage
```bash
 FAIL  src/app.controller.spec.ts
  ● Test suite failed to run

    Cannot find module '@helia/unixfs' from 'app.service.ts'
```
However, npm run start:prod works fine.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
