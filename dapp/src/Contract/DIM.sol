// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract DecentralizedIM {
    
    struct Credential {
        string credentialHash; // IPFS or off-chain hash
        address issuer;
        uint256 issuedAt;
        bool isRevoked;
    }

    struct Identity {
        bool isRegistered;
        string metadata; // optional off-chain metadata link (IPFS)
        address owner;
    }

    mapping(address => Identity) public identities;
    mapping(address => bool) public approvedIssuers;
    mapping(address => Credential[]) public credentials;

    address public admin;

    event IdentityRegistered(address user, string metadata);
    event CredentialIssued(address indexed user, address issuer, string credentialHash);
    event CredentialRevoked(address indexed user, uint256 index);
    event IssuerApproved(address issuer);
    event IssuerRevoked(address issuer);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyRegistered() {
        require(identities[msg.sender].isRegistered, "Not registered");
        _;
    }

    modifier onlyIssuer() {
        require(approvedIssuers[msg.sender], "Not an approved issuer");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerIdentity(string memory metadata) external {
        require(!identities[msg.sender].isRegistered, "Already registered");

        identities[msg.sender] = Identity({
            isRegistered: true,
            metadata: metadata,
            owner: msg.sender
        });

        emit IdentityRegistered(msg.sender, metadata);
    }

    function approveIssuer(address issuer) external onlyAdmin {
        approvedIssuers[issuer] = true;
        emit IssuerApproved(issuer);
    }

    function revokeIssuer(address issuer) external onlyAdmin {
        approvedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    function issueCredential(address user, string memory credentialHash) external onlyIssuer {
        require(identities[user].isRegistered, "User not registered");

        credentials[user].push(Credential({
            credentialHash: credentialHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            isRevoked: false
        }));

        emit CredentialIssued(user, msg.sender, credentialHash);
    }

    function revokeCredential(address user, uint256 index) external {
        require(index < credentials[user].length, "Invalid index");
        require(msg.sender == credentials[user][index].issuer || msg.sender == admin, "Not authorized");

        credentials[user][index].isRevoked = true;

        emit CredentialRevoked(user, index);
    }

    function getCredentials(address user) external view returns (Credential[] memory) {
        return credentials[user];
    }

    function isCredentialValid(address user, uint256 index) external view returns (bool) {
        if (index >= credentials[user].length) return false;
        Credential memory cred = credentials[user][index];
        return !cred.isRevoked;
    }
}
