import { getHash } from './getHash';
import { getUUID } from './getUUID';
import { sleep } from './sleep';
import { hexUnify, hexFlip, hexToInt, intToHex } from "./hex";
import { hexToBase64, base64ToHex } from "./convert";
import { getLRC, checkLRC } from './lrc';


const convert = {
    hexToBase64,
    base64ToHex,
    hexToInt, intToHex
};

export {
    convert,

    getHash,
    getUUID,
    sleep,
    hexUnify, hexFlip, hexToInt, intToHex,
    getLRC, checkLRC
}