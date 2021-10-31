import { APIGatewayEvent, Context } from 'aws-lambda';
import { Element } from '../lib/svg';
import axios from 'axios';
import rgbHex from 'rgb-hex';

export async function handler(
    event: APIGatewayEvent,
    context: Context
) {
    try {
        const svg = new Element('svg', { width: 480, height: 120 });

        const styleElem = new Element('style', {});
        styleElem.addChild(`
            .name {
                font: bold 24px sans-serif;
                fill: white;
            }
            .lastPost {
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

        const labelElement = new Element('text', {
            x: 100,
            y: 50,
            class: "name"
        });
        labelElement.addChild('luc.computer');
        svg.addChild(labelElement);

        const rssFeed = await axios.get('https://luc.computer/rss.xml');
        const a = rssFeed.data;
        const lastPost = a.toString().match(/\<item\>.*\<\/item\>/)[0].match(/\<title\>\<\!\[CDATA\[(.*?)\]\]\>\<\/title\>/)[1];
        console.log(lastPost);

        const lastPostElement = new Element('text', {
            x: 100,
            y: 80,
            class: "lastPost"
        });
        lastPostElement.addChild(lastPost);
        svg.addChild(lastPostElement);

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