// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CIDStorage {
    struct File {
        string filename;
        string cid;
        address uploader;
            uint256 timestamp; // ⏱️ store block timestamp

    }

    File[] private files;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyUploader(uint index) {
        require(index < files.length, "Invalid index");
        require(files[index].uploader == msg.sender, "Not your file to delete");
        _;
    }

    event CIDStored(address indexed uploader, string filename, string cid);
    event CIDDeleted(address indexed uploader, string cid, uint index);

    function storeCID(string memory _filename, string memory _cid) public {
        require(bytes(_filename).length > 0, "Filename cannot be empty");
        require(bytes(_cid).length > 0, "CID cannot be empty");

        files.push(File(_filename, _cid, msg.sender, block.timestamp)); //
        emit CIDStored(msg.sender, _filename, _cid);
    }

    function getAllFiles() public view returns (
        string[] memory filenames,
        string[] memory cids,
        address[] memory uploaders,
            uint256[] memory timestamps  //

    ) {
        uint length = files.length;
        filenames = new string[](length);
        cids = new string[](length);
        uploaders = new address[](length);
            timestamps = new uint256[](length); //


        for (uint i = 0; i < length; i++) {
            filenames[i] = files[i].filename;
            cids[i] = files[i].cid;
            uploaders[i] = files[i].uploader;
            timestamps[i] = files[i].timestamp; //
        }
    }

    function deleteFile(uint index) public onlyUploader(index) {
        string memory deletedCid = files[index].cid;
        files[index] = files[files.length - 1];
        files.pop();
        emit CIDDeleted(msg.sender, deletedCid, index);
    }
}
