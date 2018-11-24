export function hexUnify(hexString): string {
    hexString = hexString.trim();
    hexString = hexString.toLowerCase();


    return hexString.replace(/[g-zG-Z\-\s]/gi,'');
}

export function hexFlip(hexString): string {
    hexString = hexUnify(hexString);
    const arr = hexString.match(/(..)/ig);
    let result = "";

    for (let i =  arr.length-1; i>=0; i--) {
        result+=arr[i];
    }

    return result;
}

export function hexToInt(hexString) {
    return parseInt(hexString, 10);
}

export function intToHex(number) {
    return number.toString(16);
}