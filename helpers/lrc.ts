export function getLRC(hexstring) {
    let s = hexstring.match(/../g);
    let lrc:any = '0x55';
    s.forEach(function (hexbyte) {
        let n = 1 * ('0x' as any + hexbyte);
        lrc ^= n;
    });

    lrc = lrc.toString(16);
    if (lrc.length % 2)
        lrc = '0' + lrc;

    return lrc;
}

export function checkLRC(hexstring) {
    let res = getLRC(hexstring);

    return res === '00';
}