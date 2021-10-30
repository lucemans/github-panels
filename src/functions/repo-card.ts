import { APIGatewayEvent, Context } from 'aws-lambda';
import { createCard, createSVG, SvgBuilder } from '../lib/svg';
import axios from 'axios';

export async function handler(
    event: APIGatewayEvent,
    context: Context
) {

    const pkg = event.queryStringParameters['package'];

    const pkgdata: {
        '_id': string,
        '_rev': string,
        'name': string,
        'dist-tags': { [key: string]: string },
        'versions': { [key: string]: { name: string, version: string, description: string, main: string, types: string } },
        'time': { [key: string]: string },
        'maintainers': { name: string, email: string }[],
        'description': string,
        'keywords': string[],
        'repository': string | { type: string, url: string },
        'author': string | { name: string, email: string },
        'license': string,
        'readme': string,
        'readmeFilename': string
    } = (await axios.get('https://registry.npmjs.org/' + pkg)).data;
    const pkgdownload: {
        "downloads": number,
        "start": string,
        "end": string,
        "package": string
    } = (await axios.get('https://api.npmjs.org/downloads/point/last-year/' + pkg)).data;

    const svg = SvgBuilder.newInstance();

    svg.root += `<style>
    .name {
        font: bold 30px sans-serif;
        fill: white;
    }
    .downloads {
        font: bold 15px sans-serif;
        fill: white;
    }
    </style>`;

    svg.width(480);
    svg.height(120);

    svg.rect({
        x: 0.5,
        y: 0.5,
        rx: 4.5,
        height: "99%",
        stroke: "#e4e2e2",
        width: 479,
        fill: "#2e3440",
        "stroke-opacity": 0
    });

    svg.text({
        x: 100,
        y: 50,
        class: "name",
    }, pkgdata.name);

    svg.text({
        x: 100,
        y: 75,
        class: "downloads",
    }, pkgdownload.downloads + " downloads");

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'image/svg+xml'
        },
        body: svg.render()
    }
}