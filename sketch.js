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

let selectedConcept1;
let selectedConcept2;

let buttonCold = document.getElementById('cold');
let buttonSugary = document.getElementById('sugary');
let buttonAcid = document.getElementById('acid');

function setup() {
    let canva = createCanvas(window.screen.width, 600);
    canva.parent('canva-container');
    noLoop();
}

function draw() {
    clear();

    selectedConcept1 = localStorage.getItem('selectedConcept1');
    selectedConcept2 = localStorage.getItem('selectedConcept2');

    if(selectedConcept1 === buttonCold.id || selectedConcept2 === buttonCold.id) {
        buttonCold.style.textDecoration = "underline";
    } else {
        buttonCold.style.textDecoration = "none";
    }
    if(selectedConcept1 === buttonSugary.id || selectedConcept2 === buttonSugary.id) {
        buttonSugary.style.textDecoration = "underline";
    } else {
        buttonSugary.style.textDecoration = "none";
    }
    if(selectedConcept1 === buttonAcid.id || selectedConcept2 === buttonAcid.id) {
        buttonAcid.style.textDecoration = "underline";
    } else {
        buttonAcid.style.textDecoration = "none";
    }

    if(selectedConcept1 || selectedConcept2) {
        generateColorSets(selectedConcept1, selectedConcept2);
    }
    
    drawColorSets();
}

function generateColorSets(concept1, concept2) {
    for (let j = 0; j < 7; j++) {
        let colors = generateColors(concept1, concept2);
        colorSets.push({ colors: colors, concept1: concept1, concept2: concept2 });
    }
}

function generateColors(concept1, concept2) {
    let colors = [];
    let colorSet1 = [];
    let colorSet2 = [];

    switch (concept1) {
        case 'cold':
            colorSet1 = coldColors;
            break;
        case 'sugary':
            colorSet1 = sugaryColors;
            break;
        case 'acid':
            colorSet1 = acidColors;
            break;
        default:
            colorSet1 = Array.from({ length: 256 }, (_, i) => color(i, i, i));
            break;
    }

    if (concept2) {
        switch (concept2) {
            case 'cold':
                colorSet2 = coldColors;
                break;
            case 'sugary':
                colorSet2 = sugaryColors;
                break;
            case 'acid':
                colorSet2 = acidColors;
                break;
            default:
                colorSet2 = Array.from({ length: 256 }, (_, i) => color(i, i, i));
                break;
        }
    }

    let combinedColorSet = concept2 !== "null" ? colorSet1.concat(colorSet2) : colorSet1;

    let attempts = 0;
    while (colors.length < 4) {
        let newColor = random(combinedColorSet);
        let isContrasting = true;

        if(colors.length >= 1) {
            if(!hasContrast(colors[colors.length-1], newColor) || attempts > 20) {
                isContrasting = false;
            }
        }

        if(isContrasting && !colors.includes(newColor)) {
            colors.push(color(newColor));
        }
    }

    return colors;
}

function hasContrast(color1, color2) {
    let brightness1 = brightness(color1);
    let brightness2 = brightness(color2);

    return abs(brightness1 - brightness2) > 12; // Ajustez cette valeur pour le niveau de contraste souhaité
}

function drawColorSets() {
    console.log(width);
    let setWidth = min(160, width / (colorSets.length+2)); // Largeur d'un set (4 rectangles), ajustée pour la réactivité
    let rectWidth = setWidth / 4; // Largeur d'un rectangle dans le set
    let totalWidth = colorSets.length * setWidth + (colorSets.length - 1) * (setWidth / 4); // Largeur totale avec espaces entre les sets
    let startX = (width - totalWidth) / 2; // Calcul de la position de départ pour centrer

    let x = startX;
    drawConcept(selectedConcept1, selectedConcept2, startX);
    for (let i = 0; i < colorSets.length; i++) {
        stroke(0);
        strokeWeight(3);
        rect(x, 100, setWidth, 200);
        drawColorSet(colorSets[i].colors, x, 100, rectWidth);
        drawColorSetDetails(colorSets[i].colors, x, 350);
        x += setWidth + (setWidth / 4); // Espace entre chaque ensemble de couleurs
    }
}

function drawConcept(concept1, concept2, x) {
    fill(51);
    textSize(32);
    textStyle(BOLD);
    textFont('Verdana');
    if(concept2 !== "null"){
        text(`${concept1.charAt(0).toUpperCase()+concept1.slice(1)} and ${concept2.charAt(0).toUpperCase()+concept2.slice(1)}`, x, 50);
    } else {
        text(`${concept1.charAt(0).toUpperCase()+concept1.slice(1)}`, x, 50);
    }
}

function drawColorSet(colors, x, y, rectWidth) {
    for (let i = 0; i < colors.length; i++) {
        fill(colors[i]);
        noStroke();
        rect(x + i * rectWidth, y, rectWidth, 200);
    }
}

function drawColorSetDetails(colors, x, y) {
    for (let i = 0; i < colors.length; i++) {
        fill(colors[i]);
        stroke(0);
        strokeWeight(1);
        rect(x+15, y + i * 45, 25, 25);

        let hexColor = '#' + hex(red(colors[i]), 2) + hex(green(colors[i]), 2) + hex(blue(colors[i]), 2);

        fill(51);
        noStroke();
        textSize(16);
        textStyle(NORMAL);
        textFont('Verdana');
        text(hexColor, x + 55, (y + 20) + i * 45)
    }
}

function filterColors(concept) {
    let selectedConcept1 = localStorage.getItem('selectedConcept1');
    let selectedConcept2 = localStorage.getItem('selectedConcept2');

    if (selectedConcept1 === "null") selectedConcept1 = null;
    if (selectedConcept2 === "null") selectedConcept2 = null;

    console.log('1: ', selectedConcept1)
    console.log('2: ', selectedConcept2)

    if(selectedConcept1 === null && selectedConcept2 === null) {
        console.log('1 et 2 == null -> je vais dans 1')
        localStorage.setItem('selectedConcept1', concept);
    } else if(selectedConcept1 !== null && selectedConcept2 !== null) {
        if(selectedConcept1 === concept) {
            console.log('1 == concept donc je retire 1 et je passe 2 à 1')
            localStorage.setItem('selectedConcept1', selectedConcept2);
            localStorage.setItem('selectedConcept2', null);
        } else if(selectedConcept2 === concept) {
            console.log('2 == concept donc je retire 2')
            localStorage.setItem('selectedConcept2', null);
        } else {
            console.log('1 et 2 != null et != concept donc je mets 1 à 2 et 2 à concept')
            localStorage.setItem('selectedConcept1', selectedConcept2);
            localStorage.setItem('selectedConcept2', concept);
        }
    } else {
        if(selectedConcept1 === concept) {
            localStorage.setItem('selectedConcept1', null);
        } else {
            console.log('1 ou 2 == null (normalement 2) -> je vais dans 2')
            localStorage.setItem('selectedConcept2', concept);
        }
    }
    
    colorSets = [];
    redraw();
}

function reload() {
    colorSets = [];
    redraw();
}