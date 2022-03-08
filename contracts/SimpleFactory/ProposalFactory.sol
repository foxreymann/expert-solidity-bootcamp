// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./Proposal.sol";

contract ProposalFactory {

    Proposal[] public proposals;

    function createProposal(
        string memory _description
    ) public returns (Proposal) {
        Proposal proposal = new Proposal(
            _description
        );
        proposals.push(proposal);
        return proposal;
    }

    function proposalsLength() public view returns (uint) {
      return proposals.length;
    }
}
