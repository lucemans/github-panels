import { APIGatewayEvent, Context } from 'aws-lambda';
import { Element } from '../lib/svg';
import axios from 'axios';
import rgbHex from 'rgb-hex';

export async function handler(
    event: APIGatewayEvent,
    context: Context
) {
    try {
        const pkg = event.queryStringParameters['package'];
        const logo = event.queryStringParameters['logo'];
        const query_label = event.queryStringParameters['label'];

        const raw_pkgdata = await axios.get('https://registry.npmjs.org/' + pkg).catch((e) => { return { data: null } });

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
        } = raw_pkgdata.data;
        const pkgdata_found = !!raw_pkgdata.data;

        const raw_pkgdownload = await axios.get('https://api.npmjs.org/downloads/point/last-year/' + pkg).catch((e) => { return { data: null } });

        const pkgdownload: {
            "downloads": number | string,
            "start": string,
            "end": string,
            "package": string
        } = raw_pkgdownload.data;
        const pkgdownloads_found: boolean = !!raw_pkgdownload.data;

        const svg = new Element('svg', { width: 480, height: 120 });

        const styleElem = new Element('style', {});
        styleElem.addChild(`
            .name {
                font: bold 24px sans-serif;
                fill: white;
            }
            .downloads {
                font: bold 15px sans-serif;
                fill: white;
            }`);
        svg.addChild(styleElem);

        const bgRect = new Element('rect', {
            x: 0.5,
            y: 0.5,
            rx: 4.5,
            height: "99%",
            stroke: "#e4e2e2",
            width: 479,
            fill: "#2e3440",
            "stroke-opacity": 0
        });
        svg.addChild(bgRect);

        const label = query_label || (pkgdata_found ? pkgdata.name : null) || 'Not Found';

        const split = label.split('\/');
        const labelElement = new Element('text', {
            x: 100,
            y: 50,
            class: "name"
        });
        for (let i = 0; i < split.length; i++) {
            const tspan = new Element('tspan', {style: 'fill: #' + rgbHex(255,255,255,((i+1)/split.length))});
            tspan.addChild(split[i]);
            labelElement.addChild(tspan);
            if (i !== split.length - 1) {
                labelElement.addChild('/');
            }
        }
        svg.addChild(labelElement);
    
        const downloadsElem = new Element('text', {
            x: 100,
            y: 75,
            class: "downloads"
        });
        downloadsElem.addChild(pkgdownloads_found ? (pkgdownload.downloads + " downloads") : 'No data yet.');
        svg.addChild(downloadsElem);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'image/svg+xml'
            },
            body: svg.render()
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            headers: {

            },
            body: 'Shrug'
        };
    }
}