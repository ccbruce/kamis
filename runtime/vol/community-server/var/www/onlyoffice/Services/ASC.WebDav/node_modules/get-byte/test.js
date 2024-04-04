const test = require("ava");
const getByte = require("./index");

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const uint8Array = new Uint8Array(arr);
const arrayBuffer = uint8Array.buffer;
const buffer = Buffer.from(arrayBuffer);
const dataView = new DataView(arrayBuffer);

test("getting from Uint8Array", t => {
    const byte = getByte(uint8Array, 4);
    t.is(byte, 4);
});

test("getting from DataView", t => {
    const byte = getByte(dataView, 4);
    t.is(byte, 4);
});

test("getting from Buffer", t => {
    const byte = getByte(buffer, 4);
    t.is(byte, 4);
});

test("getting from ArrayBuffer", t => {
    const byte = getByte(arrayBuffer, 4);
    t.is(byte, 4);
});