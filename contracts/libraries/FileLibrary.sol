pragma solidity ^0.4.24;

import "@aragon/os/contracts/lib/math/SafeMath.sol";

library FileLibrary {
    using SafeMath for uint256;

    event DeleteFile(address indexed entity);
    event FileRename(address indexed entity);
    event FileContentUpdate(address indexed entity);

    /**
     * File stored in the Datastore
     * Order optimized for storage
     */
    struct File {
        string name;               // File name
        string storageRef;         // Storage Id of IPFS (Filecoin, Swarm in the future)
        string cryptoKey;          // Encryption key for this file
        string keepRef;            // Keep Id for encryption key
        uint128 fileSize;           // File size in bytes
        uint64 lastModification;    // Timestamp of the last file content update
        bool isPublic;              // True if file can be read by anyone
        bool isDeleted;             // Is file deleted
    }

    struct FileList {
        /**
         * Id of the last file added to the datastore. 
         * Also represents the total number of files stored.
         */
        uint lastFileId;
        mapping (uint => FileLibrary.File) files;
    }

    function addFile(FileList storage _self, string _storageRef, string _name, uint128 _fileSize, bool _isPublic, string _encryptionKey) internal returns (uint fileId) {
        _self.lastFileId = _self.lastFileId.add(1);

        _self.files[_self.lastFileId] = FileLibrary.File({
            storageRef: _storageRef,
            name: _name,
            fileSize: _fileSize,
            keepRef: "",
            isPublic: _isPublic,
            isDeleted: false,
            lastModification: uint64(now),
            cryptoKey: _encryptionKey
        });
        return _self.lastFileId;
    }   

    function setFileName(FileList storage _self, uint _fileId, string _newName) internal {
        _self.files[_fileId].name = _newName;
        _self.files[_fileId].lastModification = uint64(now);
        emit FileRename(msg.sender);
    }

    function setEncryptionKey(FileList storage _self, uint _fileId, string _cryptoKey) internal {
        _self.files[_fileId].cryptoKey = _cryptoKey;
        _self.files[_fileId].lastModification = uint64(now);
    }

    function setFileContent(FileList storage _self, uint _fileId, string _storageRef, uint128 _fileSize) internal {
        _self.files[_fileId].storageRef = _storageRef;
        _self.files[_fileId].fileSize = _fileSize;
        _self.files[_fileId].lastModification = uint64(now);
        emit FileContentUpdate(msg.sender);
    }

    function setPublic(FileList storage _self, uint _fileId, bool _isPublic) internal {
        _self.files[_fileId].isPublic = _isPublic;
        _self.files[_fileId].lastModification = uint64(now);
    }

    function setIsDeleted(FileList storage _self, uint _fileId, bool _isDeleted) internal {
        _self.files[_fileId].isDeleted = _isDeleted;
        _self.files[_fileId].lastModification = uint64(now);
    }    

    function permanentlyDeleteFile(FileList storage _self, uint _fileId) internal {
        delete _self.files[_fileId];
    }
}