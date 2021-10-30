import express from 'express';
import svg from 'svg-builder';

const app = express();

`<svg width="750" height="120" xmlns="http://www.w3.org/2000/svg" >
    <rect xmlns="http://www.w3.org/2000/svg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="494" fill="#2e3440" stroke-opacity="0"/>
    </svg>`

app.get('/', (req, res) => {

    const sg = svg.newInstance();
    sg.width(750);
    sg.height(120);

    // Background
    sg.rect({
        x: 0.5,
        y: 0.5,
        rx: 4.5,
        height: "99%",
        stroke: "#e4e2e2",
        width: 494,
        fill: "#2e3440",
        "stroke-opacity": 0
    });

    sg.circle({
        r: 40, fill: 'none', 'stroke-width': 1, stroke: '#CB3728', cx: 42, cy: 40
    });


    res.type('image/svg+xml').send(sg.render());
});

app.listen(1234, () => {
    console.log(`App is running on http://localhost:1234`);
});