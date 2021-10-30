
import SvgBuilder2 from 'svg-builder';

type ElemData = {[key: string]: string | number};

type SvgBuilderType = {
    root: string,
    render: () => string,
    rect: (a: ElemData) => void,
    width: (w: number) => void,
    height: (h: number) => void,
    text: (a: ElemData, s: string) => void,
    addElement: (a: {[key: string]: unknown}) => void,
    newInstance: () => SvgBuilderType
}

export const SvgBuilder = SvgBuilder2 as SvgBuilderType;

export const createCard = () => {
    return `
    <rect xmlns="http://www.w3.org/2000/svg" data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="479" fill="#2e3440" stroke-opacity="0"/>
    `;
};

export const createSVG = (body) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="120" viewBox="0 0 480 120" fill="none">${body}`;
};