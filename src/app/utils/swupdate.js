import * as Tar from 'tar';

const handleSendFirmware = (file) => {
    setIsProcessing(true);
    sendFirmware(file, controller.current).catch((e) => {

      if (isMounted.current) {
        setHasError(true);
        if (stepIndex === STEP_INITIAL_ID) setStepIndex(STEP_INIT_ID);
        if (e instanceof Error) setReason(e.message);
        else if (e.errors) setReason(`${e.errors[0]?.title}: ${e.errors[0]?.detail}`);
        else if (typeof e === 'string') setReason(e);
        else setReason('Server error');
      }
    });
};
 
const sendFirmware = async (fileFirmware, controller) => {
    if (!fileFirmware) {
      throw new Error('No file');
    }

    setFileFW(fileFirmware);
    let filesIndexes = await Tar.getFilesIndexes(fileFirmware);
    // no manifest found
    if (!filesIndexes[MANIFEST]) {
      throw new Error('Could not find any manifest file');
    }

    if (isMounted.current) {
      setFileIndexes(filesIndexes);
      const manifestFileBlobStart = filesIndexes[MANIFEST].tarStart + Tar.HEADER_SIZE;
      const manifestFileBlobEnd = manifestFileBlobStart + filesIndexes[MANIFEST].fileSize;
      const manifestFileBlob = fileFirmware.slice(manifestFileBlobStart, manifestFileBlobEnd);

      let installerFileBlob;
      if (filesIndexes[INSTALLER]) {
        const installerFileBlobStart = filesIndexes[INSTALLER].tarStart + Tar.HEADER_SIZE;
        const installerFileBlobEnd = installerFileBlobStart + filesIndexes[INSTALLER].fileSize;
        installerFileBlob = fileFirmware.slice(installerFileBlobStart, installerFileBlobEnd);
      }

      const response = await sendManifest({ installerFileBlob, manifestFileBlob }, controller);
      // after each await and before each setState, we need to test if the component is still mounted
      if (isMounted.current) {
        setManifestResponse(response);
      }
    }

};


 

SoftwareUpdateComponent.propTypes = {

  buildNumber: PropTypes.string.isRequired,

  detectHover: PropTypes.object.isRequired,

  dispatchRefreshSrc: PropTypes.func.isRequired,

  item: PropTypes.object.isRequired,

  osVersion: PropTypes.string.isRequired,

  sendManifest: PropTypes.func.isRequired,

  sendPackage: PropTypes.func.isRequired,

  swupdate: PropTypes.string

};

 

export default SoftwareUpdateComponent;