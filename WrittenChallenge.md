# Full-stack Engineer Written Challenge

## 1. Monitoring and testing

Assume you are working on a web app with an open API. You are implementing site monitor and regular tests to discover security vulnerabilities and identify performance bottlenecks. What approaches will you take, and what tools will you use?

You can craft your answer regarding a general situation, but you can also refer to the products at Matter Lab:

- Matters.Town: a web application where users can log in with Ethereum wallet, discover content, publish content on the IPFS network, donate ERC20 tokens to each other, etc.
- Matters server: a [GraphQL server](https://server.matters.town/playground) that analyzes content, pins data on IPFS, and listens to events on blockchains. It is used by Matters.Town and other 3rd party applications.

## 2. Architecture & scalability

The architecture diagram of Matters.Town can be found [here](https://github.com/thematters/developer-resource). Given such architecture, as Matters.Town scale to more users, where do you think the bottleneck will be? How will you change the architecture as Matters.Town scale 10 folds? What about 100 folds?

## 3. Personal interest

Please tell us about a project you are currently working on or learning about. Why do you find it interesting, and what is the most effective way for you to work on it or learn about it?

# Response to above

## 1. Monitoring and testing

### Security

Generally speaking, to ensure security, we shall check both infrastructure and app perspectives.

Infrastructure perspective

* Ensure that hosts / machines are receiving regularly updates.
* Ensure that hosts / managed databases are only accessible via certain private networks
* Ensure sensitive tokens / passwords are shared in a safe way inside the orgnization

We can use
* Defender in Azure and Amazon Inspector in AWS to perform vulnverability scan
* Other third party tools to scan machines / nodes
* VPC isolate services, for example, service VPCs and database VPCs. 
* VPN to restrict external access. For example, an engineer who needs access to prod to diagnose must connect to VPN to access service nodes.
* Production tokens such as database passwords / tokens to authenticate with external systems, e.g., Polygon or Optimism, shall be stored AWS secrets manager / Azure key vault and infrastructure team will configure deployment pipelne to read secrets during deployment.
* Use cloud managed services / Serverless such as Azure Functions or AWS Lambda so that we do not need to worry too much about infrastructure securities.

App perspective

* Ensure the web app is served to users by SSL / https
* Ensure that web pages load resources from trusted sources.
* Ensure that no sensitive information is committed to source countrol, e.g., a pre commit hook can be configured to detect possible secrets. Github also scans secrets that were committed accidentally.
* Ensure a smooth and frictionless sharing of development secrets for developers so that they have no need to create and add secrets to source control. For example, having a dev script to login to AWS and retrive parameters from AWS Parameter Store and automatically create .env file.


### Performance

## 2. Architecture & scalability

Given the architecture of matters.town, it is easy to scale in `client`. I check matters.town and confirm that `client`, although using next.js, is not using Server Side Render to call `server`. As matters.town scales, it is easy to add more node/ cdn resources / computing resource to `client`.

The bottlenect must be in the `server` component.

The matters.town app is a read-intensive app. GraphQL query operations such as article, circle, node, and search, etc will be frequently called while mutation operations such as publishArticle/editArticle will definitely not that frequent.

The vulnerable point is
* the `readArticle` mutation which tracks user stats of reading an article. `client` has some throttling but it is possible that others call GraphQL mutation directly and updates `readArticle` too frequently.

A possible vulnerable point is
* for each GraphQL query or mutation request, the `server` tracks last seen of a signed in user. There is cache configured but after matters.town scales 1000x, it is possible that even without malicious attacks, there may be many last seen updates every second. Currently, the last seen cache has threshold 1 hour. However, if we want to track last seen in finer granularity, we may need to reduce threhold and result in exponential increase in database reads/writes. 

It is possible to track last seen in finer granularity. The last seen events can be sent from client even in minutes but we do not need to update database immediately. Just think about this as a streaming computation problem with some tolerable loss. Also, the last seen data does not need to be stored in the same database like article / user entities.

For articles, if we assume that once an article is published, it won't be updated frequently, we can let nextjs pre-render article page and the `client` will only make comments / likes / follow etc queries / mutations.

## 3. Personal interest

I am working on this https://github.com/huangjimmy/pg_cjk_parser, a postgres search extension that converts CJK into 2-grams to support CJK fulltext search.

Normally in everyday work, I don't use C language but this extension is one of the very few projects I get a chance to write C code.

At first, it was used only by myself in one of my projects where I used postgres as database and wanted to support full text search with postgres without elastic search. 

Now this project is used by Chinese, Korean and Japanese people to support postgres fulltext search. It is the recommended search extension by [pleroma](https://docs-develop.pleroma.social/backend/configuration/howto_search_cjk/) to support CJK.

This project is not only a place where I learnt C and postgres but also a project that I dive deeper into technology and architecture. I compare performance between postgres full text search in CJK with elastic search and the result is that elasticsearch undoubtedly perform much faster when indexed documents are large (like large web pages). However, it we are searching smalll documents ( within 5KB ), postgres full text search will be easier to implement. I also improve my doc writing and sharing skill such that everyone who reads the README will easily understand how to use this extension. What's more, by adding github workflows that verify extension on postgres 11 to 16, users will feel confident that they can use this extension in their postgres instances.



