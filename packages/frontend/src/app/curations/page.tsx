import Curations, { CurationsParams } from "./[...slug]/page";

export default async function CurationIndex({ params, searchParams }: CurationsParams) {
    const slug: string[] = [];
    return <Curations params={ { slug: slug } } searchParams={ searchParams }></Curations>
}