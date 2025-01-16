let colorSets = [];
let coldColors = [
    '#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8',
    '#22577a', '#38a3a5', '#57cc99', '#80ed99', '#c7f9cc',
    '#07beb8', '#3dccc7', '#68d8d6', '#9ceae2', '#c4fff9',
    '#bee9e8', '#62b6cb', '#1b4965', '#eae9ff', '#5fa8d3',
    '#e0fbfc', '#c2dfe3', '#9db4c0', '#5c6b73', '#253237',
    '#dbc2cf', '#9fa2b2', '#3c7a89', '#2e4756', '#16262e'
];
let acidColors = [
    '#3c1642', '#086375', '#1dd3b0', '#affc41',
    '#3deb1e', '#cfffb3', '#391463', '#ffa770', '#fd7623',
    '#eff7cf', '#bad9b5', '#aba361', '#732c2c', '#b2ff9e',
    '#bce784', '#5dd39e', '#348aa7', '#525174', '#513b56',
    '#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00',
    '#bfd200', '#d4d700', '#dddf00', '#eeef20', '#ffff3f'
];
let sugaryColors = [
    '#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff',
    '#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9',
    '#70d6ff', '#ff70a6', '#ff9770', '#ffd670', '#e9ff70',
    '#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4',
    '#f49097', '#dfb2f4', '#f5e960', '#f2f5ff', '#55d6c2',
    '#b8336a', '#c490d1', '#acacde', '#abdafc', '#e5fcff'
];

let selectedConcept;

function setup() {
    createCanvas(window.screen.width, 600);
    noLoop();
}

function draw() {
    clear();

    if(selectedConcept) {
        generateColorSets(selectedConcept);
    }
    
    drawColorSets();
}

function generateColorSets(selectedConcept) {
    for (let j = 0; j < 7; j++) {
        let colors = generateColors(selectedConcept);
        colorSets.push({ colors: colors, concept: selectedConcept });
    }
}

function generateColors(concept) {
    let colors = [];
    let colorSet = [];

    switch (concept) {
        case 'cold':
            colorSet = coldColors;
            break;
        case 'sugary':
            colorSet = sugaryColors;
            break;
        case 'acid':
            colorSet = acidColors;
            break;
        default:
            colorSet = Array.from({ length: 256 }, (_, i) => color(i, i, i));
            break;
    }

    console.log("Nouveau set")
    while (colors.length < 4) {
        let newColor = random(colorSet);
        let isContrasting = true;

        if (!colors.includes(newColor)) {
                if(colors.length >= 1) {
                    if(!hasContrast(colors[colors.length-1], newColor)) {
                        isContrasting = false;
                    }
                }
                    
            if(isContrasting) {
                colors.push(newColor);
            }
        }
    }

    return colors;
}

function hasContrast(color1, color2) {
    let brightness1 = brightness(color1);
    let brightness2 = brightness(color2);

    console.log(abs(brightness1 - brightness2))
    console.log(abs(brightness1 - brightness2) < 5)
    return abs(brightness1 - brightness2) > 12; // Ajustez cette valeur pour le niveau de contraste souhaité
}

function drawColorSets() {
    let setWidth = 4 * 40; // Largeur d'un set (4 rectangles)
    let totalWidth = colorSets.length * setWidth + (colorSets.length - 1) * 75; // Largeur totale avec espaces entre les sets
    let startX = (width - totalWidth) / 2; // Calcul de la position de départ pour centrer

    let x = startX;
    drawConcept(selectedConcept, startX);
    for (let i = 0; i < colorSets.length; i++) {
        stroke(0);
        strokeWeight(3);
        rect(x, 100, 160, 200);
        drawColorSet(colorSets[i].colors, x, 100);
        drawColorSetDetails(colorSets[i].colors, x, 350);
        x += setWidth + 75; // Espace entre chaque ensemble de couleurs
    }
}

function drawConcept(concept, x) {
    fill(51);
    textSize(32);
    textStyle(BOLD);
    textFont('Verdana');
    text(`Concept: ${concept}`, x, 50);
}

function drawColorSet(colors, x, y) {
    for (let i = 0; i < colors.length; i++) {
        fill(color(colors[i]));
        noStroke();
        rect(x + i * 40, y, 40, 200);
    }
}

function drawColorSetDetails(colors, x, y) {
    for (let i = 0; i < colors.length; i++) {
        fill(color(colors[i]));
        stroke(0);
        strokeWeight(1);
        rect(x, y + i * 45, 40, 40);
        fill(51);
        noStroke();
        textSize(24);
        textStyle(NORMAL);
        textFont('Verdana');
        text(colors[i], x + 50, (y + 28) + i * 45)
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const concept = params.get('concept');

    if (concept) {
        filterColors(concept);
    }
});

function filterColors(concept) {
    selectedConcept = concept;
    colorSets = [];
    redraw();
}