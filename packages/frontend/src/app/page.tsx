import TopNavBar from "@/components/top_navbar";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Snippet } from "@nextui-org/snippet";

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
        </div>
        <div className="align-top">
        <p>
          Two docker-compose files are provided.
        </p>
        <p>
          There is compose.yml for you to start a postgres database
        </p>
        <p>
          <ul className="list-inside list-disc">
            There is also compose-fullstack.yml for you to start 
          <li>an instance of postgres database name `db`, </li>
          <li>an instance of backend named `graphql_server`, </li>
          <li>two instances of frotnend called `frontend` and `frontend_slim`,</li>
          <li>an instance of ipfs called `ipfs`.</li>
          </ul>
        </p>
        <p>
          Following command will start a postgres instance with ./pgdata to store its data.
        </p>
        <p>
          <Snippet>
            docker-compose -f compose.yml up
          </Snippet>
        </p>
        <p>
          Following command will start database, frontend, backend and ipfs.
          Please note that `compose-fullstack` will start a new postgres instance which is different from the one created by compose.yml
        </p>
        <p>
        <Snippet>
          docker-compose -f compose-fullstack.yml up
        </Snippet>
        </p>
        </div>
      </div>
    </main>
  );
}
