# get-byte
A **Universal** way of getting a Byte at a Given Index from a variety of in-memory data formats, including Uint8Array, Buffer, DataView, and Array Buffer

# install
```bash
npm install get-byte
```

# usage
```javascript
import getByte from 'get-byte';

// gets the 10th byte from a buffer
getByte(buffer, 10);

// gets the 10th byte from an array buffer
getByte(arrayBuffer, 10);

// gets the 10th byte from a data view
getByte(dataView, 10);

// gets the 10th byte from a Uint8Array
getByte(uint8Array, 10);
```