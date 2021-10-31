import { APIGatewayEvent, Context } from 'aws-lambda';
import { Element } from '../lib/svg';
import axios from 'axios';
import rgbHex from 'rgb-hex';

export async function handler(
    event: APIGatewayEvent,
    context: Context
) {
    try {
        const repo = event.queryStringParameters['repo'];
        const logo = event.queryStringParameters['logo'];
        const query_label = event.queryStringParameters['label'];

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

        const label = query_label || repo || 'Not Found';

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