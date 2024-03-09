import TopNavBar from "@/components/top_navbar";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Code } from "@nextui-org/code";
import { Divider } from "@nextui-org/divider";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <TopNavBar/>
      <div className="z-10 max-w-5xl m-10 w-full sticky items-center justify-between font-mono text-xl lg:flex">
        <h1 className="mb-5">Matters Town Code Challenge</h1>
      </div>
      <div className="relative h-max m-10 flex-col justify-center place-items-top">
        <h2>This app consists of four components</h2>
          <div className="relative min-h-max flex-col justify-center place-items-top">
            <div className="relative min-h-max flex justify-center place-items-top">
              <div className="relative min-h-max w-1/2 flex-col m-10 justify-center place-items-top">
                <Card>
                  <CardHeader>IPFS</CardHeader>
                  <CardBody>locates at packages/ipfs, an http IPFS endpoint</CardBody>
                  <Divider/>
                </Card>
                <Card>
                  <CardHeader>Backend</CardHeader>
                  <CardBody>locates at packages/backend, a web service in nest.js that sync curation events from blockchain and provides GraphQL services to frontend</CardBody>
                  <Divider/>
                </Card>
              </div>
              <div className="relative min-h-max w flex-col m-10 justify-center place-items-top">
                <Card>
                  <CardHeader>Frontend</CardHeader>
                  <CardBody>locates at packages/frontend, a next.js frontend app, also the app that serves this page.</CardBody>
                  <Divider/>
                </Card>
                <Card>
                  <CardHeader>Common</CardHeader>
                  <CardBody>locates at packages/common, the generated GraphQL schema</CardBody>
                  <Divider/>
                </Card>
              </div>
            </div>
          <Code>
            Two docker-compose files are provided.
          </Code>
          <Code>
            1. compose.yml for you to start a postgres database
          </Code>
          <Code>
            2. compose-fullstack.yml for you to start 
            an instance of postgres database name `db`, 
            an instance of backend named `graphql_server`, 
            two instances of frotnend called `frontend` and `frontend_slim`,
            an instance of ipfs called `ipfs`.
          </Code>
          <Code>
            Check README.md for more details.
          </Code>
        </div>
      </div>
    </main>
  );
}
