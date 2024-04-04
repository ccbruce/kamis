module.exports = function getByte(input, index) {
    if (input instanceof Uint8Array || (typeof Buffer !== 'undefined' && Buffer.isBuffer(input))) {
      return input[index];
    } else if (input instanceof DataView) {
      return input.getUint8(index);
    } else if (input instanceof ArrayBuffer) {
      return (new DataView(input)).getUint8(index);
    }
};

