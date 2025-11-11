// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VeriFi {
    struct Anchor {
        address author;
        uint256 timestamp;
    }

    mapping(bytes32 => Anchor) public anchors;

    event ProofAnchored(bytes32 indexed proofKey, address indexed author, uint256 timestamp);

    function anchor(string calldata proof) external {
        bytes32 key = keccak256(bytes(proof));
        require(anchors[key].timestamp == 0, "Already anchored");

        anchors[key] = Anchor(msg.sender, block.timestamp);
        emit ProofAnchored(key, msg.sender, block.timestamp);
    }

    function getAnchor(string calldata proof) external view returns (address author, uint256 timestamp) {
        bytes32 key = keccak256(bytes(proof));
        Anchor memory a = anchors[key];
        return (a.author, a.timestamp);
    }
}
