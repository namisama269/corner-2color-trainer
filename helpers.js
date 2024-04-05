function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function reverseString(s) {
    return s.split('').reverse().join('');
}

function setCharAt(str, index, chr) {
    if(index > str.length-1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

function convertCubeString(cubeString) { 
    return {
        "U": cubeString.substring(0, 9),
        "D": cubeString.substring(33, 36) + cubeString.substring(30, 33) + cubeString.substring(27, 30),
        "R": 
        cubeString[11] + cubeString[14] + cubeString[17] +
        cubeString[10] + cubeString[13] + cubeString[16] +
        cubeString[9] + cubeString[12] + cubeString[15],
        "L":
        cubeString[36] + cubeString[39] + cubeString[42] +
        cubeString[37] + cubeString[40] + cubeString[43] +
        cubeString[38] + cubeString[41] + cubeString[44],
        "F": cubeString.substring(18, 27),
        "B": 
        reverseString(cubeString.substring(45, 48)) + 
        reverseString(cubeString.substring(48, 51)) + 
        reverseString(cubeString.substring(51, 54)),
    }
}



function getXYStickers(cubeSize, gapSize, topLeftX, topLeftY, topLeftZ) {
    let stickers = [];
    let stickerSize = (2 - (cubeSize + 1/3) * gapSize) / cubeSize;

    for (let v = 0; v < cubeSize; ++v) {
        for (let h = 0; h < cubeSize; ++h) {
            let px = topLeftX + gapSize * (2/3) + h * (gapSize + stickerSize);
            let py = topLeftY + gapSize * (2/3) + v * (gapSize + stickerSize);
            let pz = topLeftZ;

            stickers.push([
                [px, py, pz],
                [px + stickerSize, py, pz],
                [px + stickerSize, py + stickerSize, pz],
                [px, py + stickerSize, pz]
            ])
        }
    }

    return stickers;
}

function getXZStickers(cubeSize, gapSize, topLeftX, topLeftY, topLeftZ) {
    let stickers = [];
    let stickerSize = (2 - (cubeSize + 1/3) * gapSize) / cubeSize;

    for (let v = 0; v < cubeSize; ++v) {
        for (let h = 0; h < cubeSize; ++h) {
            let px = topLeftX + gapSize * (2/3) + h * (gapSize + stickerSize);
            let py = topLeftY;
            let pz = topLeftZ + gapSize * (2/3) + v * (gapSize + stickerSize);

            stickers.push([
                [px, py, pz],
                [px + stickerSize, py, pz],
                [px + stickerSize, py, pz + stickerSize],
                [px, py, pz + stickerSize]
            ])
        }
    }

    return stickers;
}

function getYZStickers(cubeSize, gapSize, topLeftX, topLeftY, topLeftZ) {
    let stickers = [];
    let stickerSize = (2 - (cubeSize + 1/3) * gapSize) / cubeSize;

    for (let v = 0; v < cubeSize; ++v) {
        for (let h = 0; h < cubeSize; ++h) {
            let px = topLeftX;
            let py = topLeftY + gapSize * (2/3)+ h * (gapSize + stickerSize);
            let pz = topLeftZ + gapSize * (2/3) + v * (gapSize + stickerSize);

            stickers.push([
                [px, py, pz],
                [px, py, pz + stickerSize],
                [px, py + stickerSize, pz + stickerSize],
                [px, py + stickerSize, pz]
            ])
        }
    }

    return stickers;
}

function getFaceStickers(cubeSize, gapSize) {
    return {
        "U": getXZStickers(cubeSize, gapSize, -1, -1, -1),
        "D": getXZStickers(cubeSize, gapSize, -1, 1, -1),
        "R": getYZStickers(cubeSize, gapSize, 1, -1, -1),
        "L": getYZStickers(cubeSize, gapSize, -1, -1, -1),
        "F": getXYStickers(cubeSize, gapSize, -1, -1, 1),
        "B": getXYStickers(cubeSize, gapSize, -1, -1, -1)
    }
}




function matrixProd(A, B) {
    var result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));

    return result.map((row, i) => {
        return row.map((val, j) => {
            return A[i].reduce((sum, elm, k) => sum + (elm * B[k][j]) ,0)
        })
    })
}

const PROJECTION = [
    [1, 0, 0],
    [0, 1, 0]
];

function getRotationMatrix(theta, axis) {
    if (axis == "z") {
        return [
            [Math.cos(theta), -Math.sin(theta), 0],
            [Math.sin(theta), Math.cos(theta), 0],
            [0, 0, 1],
        ]
    } 

    if (axis == "y") {
        return [
            [Math.cos(theta), 0, Math.sin(theta)],
            [0, 1, 0],
            [-Math.sin(theta), 0, Math.cos(theta)],
        ]
    }

    if (axis == "x") {
        return [
            [1, 0, 0],
            [0, Math.cos(theta), -Math.sin(theta)],
            [0, Math.sin(theta), Math.cos(theta)],
        ]
    }

    return []
}

function distToCam(points, width) {
    let a = [0, 0, width];
    let b = [];
    for (let i = 0; i < 3; ++i) {
        let total = 0;
        for (let j = 0; j < 4; ++j) {
            total += points[j][i][0];
        }
        total /= 4;
        b.push(total);
    }
    
    let dx = a[0] - b[0];
    let dy = a[1] - b[1];
    let dz = a[2] - b[2];

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}  