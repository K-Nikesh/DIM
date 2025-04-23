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

    struct CredentialRequest {
        string requestData; // IPFS hash or metadata
        address requester;
        uint256 requestedAt;
        bool isApproved;
        bool isReviewed;
    }

    mapping(address => Identity) public identities;
    mapping(address => bool) public approvedIssuers;
    mapping(address => Credential[]) public credentials;
    mapping(address => CredentialRequest[]) public credentialRequests; // issuer => list of requests

    address public admin;

    event IdentityRegistered(address user, string metadata);
    event CredentialIssued(
        address indexed user,
        address issuer,
        string credentialHash
    );
    event CredentialRevoked(address indexed user, uint256 index);
    event IssuerApproved(address issuer);
    event IssuerRevoked(address issuer);
    event CredentialRequested(
        address indexed requester,
        address indexed issuer,
        string requestData
    );

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

    

    function revokeCredential(address user, uint256 index) external {
        require(index < credentials[user].length, "Invalid index");
        require(
            msg.sender == credentials[user][index].issuer ||
                msg.sender == admin,
            "Not authorized"
        );

        credentials[user][index].isRevoked = true;

        emit CredentialRevoked(user, index);
    }

    function getCredentials(address user)
        external
        view
        returns (Credential[] memory)
    {
        return credentials[user];
    }

    function isCredentialValid(address user, uint256 index)
        external
        view
        returns (bool)
    {
        if (index >= credentials[user].length) return false;
        Credential memory cred = credentials[user][index];
        return !cred.isRevoked;
    }

    function requestCredential(address issuer, string memory requestData)
        external
        onlyRegistered
    {
        require(approvedIssuers[issuer], "Issuer not approved");

        credentialRequests[issuer].push(
            CredentialRequest({
                requestData: requestData,
                requester: msg.sender,
                requestedAt: block.timestamp,
                isApproved: false,
                isReviewed: false
            })
        );

        emit CredentialRequested(msg.sender, issuer, requestData);
    }

    function approveRequest(uint256 index, string memory credentialHash)
        external
        onlyIssuer
    {
        require(index < credentialRequests[msg.sender].length, "Invalid index");
        CredentialRequest storage req = credentialRequests[msg.sender][index];
        require(!req.isReviewed, "Already reviewed");

        req.isApproved = true;
        req.isReviewed = true;

        // Issue the credential
        credentials[req.requester].push(
            Credential({
                credentialHash: credentialHash,
                issuer: msg.sender,
                issuedAt: block.timestamp,
                isRevoked: false
            })
        );

        emit CredentialIssued(req.requester, msg.sender, credentialHash);
    }

    function rejectRequest(uint256 index) external onlyIssuer {
        require(index < credentialRequests[msg.sender].length, "Invalid index");
        CredentialRequest storage req = credentialRequests[msg.sender][index];
        require(!req.isReviewed, "Already reviewed");

        req.isReviewed = true;
        // Don't issue a credential
    }
}
