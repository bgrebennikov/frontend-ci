import {headers} from "next/headers";

async function getSubdomain(){
    const host = (await headers()).get('host');
    const splitStr = host?.split(".")
    return splitStr?.length === 3 ? splitStr[0] : null;
}


const Home = async () => {

    const domain = await getSubdomain();


    return (
        <div>
            <h1 className="text-2xl">
                Env: {process.env.BUILD_TYPE ?? 'Not Found '}
            </h1>
            {domain ? `Page ID: ${domain}` : 'Not Subdomain'}
        </div>
    );
}

export default Home;