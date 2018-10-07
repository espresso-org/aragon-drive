pragma solidity ^0.4.24;

import "@aragon/os/contracts/lib/math/SafeMath.sol";

library FileLibrary {
    using SafeMath for uint256;

    event DeleteFile(address indexed entity);
    event FileRename(address indexed entity);
    event FileContentUpdate(address indexed entity);

    /**
     * File stored in the Datastore
     */
    struct File {
        string storageRef;      // Storage Id of IPFS (Filecoin, Swarm in the future)
        string name;            // File name
        uint fileSize;          // File size in bytes
        string keepRef;         // Keep Id for encryption key
        bool isPublic;          // True if file can be read by anyone
        bool isDeleted;         // Is file deleted
        uint lastModification;  // Timestamp of the last file content update
    }


    struct FileList {
        /**
        * Id of the last file added to the datastore. 
        * Also represents the total number of files stored.
        */
        uint lastFileId;
        mapping (uint => FileLibrary.File) files;
    }


    function addFile(FileList storage _self, string _storageRef, string _name, uint _fileSize, bool _isPublic) external returns (uint fileId) {
        _self.lastFileId = _self.lastFileId.add(1);

        _self.files[_self.lastFileId] = FileLibrary.File({
            storageRef: _storageRef,
            name: _name,
            fileSize: _fileSize,
            keepRef: "",
            isPublic: _isPublic,
            isDeleted: false,
            lastModification: now
        });

        return _self.lastFileId;
    }   

    function setFileName(FileList storage _self, uint _fileId, string _newName) external {
        _self.files[_fileId].name = _newName;
        _self.files[_fileId].lastModification = now;
        emit FileRename(msg.sender);
    }

    function setFileContent(FileList storage _self, uint _fileId, string _storageRef, uint _fileSize) external {

        _self.files[_fileId].storageRef = _storageRef;
        _self.files[_fileId].fileSize = _fileSize;
        _self.files[_fileId].lastModification = now;
        emit FileContentUpdate(msg.sender);
    }    


    function deleteFile(FileList storage _self, uint _fileId) external {
        _self.files[_fileId].isDeleted = true;
        _self.files[_fileId].lastModification = now;
        emit DeleteFile(msg.sender);
    }  

}