export const NAME_START = 0;
export const NAME_SIZE = 100;
export const MODE_START = 100;
export const MODE_SIZE = 8;
export const UID_START = 108;
export const UID_SIZE = 8;
export const GID_START = 116;
export const GID_SIZE = 8;
export const SIZE_START = 124;
export const SIZE_SIZE = 12;
export const MTIME_START = 136;
export const MTIME_SIZE = 12;
export const CHKSUM_START = 148;
export const CHKSUM_SIZE = 8;
export const TYPE_FLAG_START = 156;
export const TYPE_FLAG_SIZE = 1;
export const LINKNAME_START = 157;
export const LINKNAME_SIZE = 100;
export const HEADER_SIZE = 512;

const isEoF = uInt8Array => uInt8Array.every(value => value == 0);

const readBlobAsUint8Array = tarFile => {
  var fileReader = new FileReader();
  return new Promise(resolve => {

    fileReader.onload = event => {
      const uia = new Uint8Array(event.target.result);
      resolve(uia);
    };

    fileReader.readAsArrayBuffer(tarFile);
  });
};

const readDecimalFromUint8Array = (uInt8Array, start, length) => {
  return uInt8Array
    .slice(start, start + length)
    .join(',')
    .split(',')
    .filter(decimal => decimal != 0)
    .map(decimal => String.fromCharCode(decimal))
    .join('');
};

const readOctalFromUint8Array = (uInt8Array, start, length) => {
  const raw = uInt8Array.slice(start, start + length);
  const rawArray = raw.join(',').split(',');
  return rawArray
    .filter(asciiDecimal => asciiDecimal > 47)
    .reverse()
    .reduce((acc, asciiDecimal, index) => {
      return acc + (asciiDecimal - 48) * Math.pow(8, index);
    }, 0);
};

export const getFilesIndexes = (file, start = 0, listOfFiles = {}) => {
  const blobChunk = file.slice(start, start + HEADER_SIZE);
  return readBlobAsUint8Array(blobChunk).then(chunk => {
    if (!isEoF(chunk)) {
      const name = readDecimalFromUint8Array(chunk, NAME_START, NAME_SIZE);
      const size = readOctalFromUint8Array(chunk, SIZE_START, SIZE_SIZE);
      const roundedFileSizeWithHeader = Math.ceil((512 + size) / 512) * 512;
      listOfFiles[name] = { tarStart: start, tarEnd: start + roundedFileSizeWithHeader, fileSize: size };
      return getFilesIndexes(file, start + roundedFileSizeWithHeader, listOfFiles);
    } else {
      return new Promise(resolve => resolve(listOfFiles));
    }
  });
};