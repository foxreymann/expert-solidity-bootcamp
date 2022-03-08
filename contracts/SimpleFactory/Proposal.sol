// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Proposal {

  enum State { Proposed, Voting, Accepted, Rejected }
  State public state = State.Proposed;
  string public description;

  constructor(string memory _description) {
    description = _description;
  }

  function startVoting() public {
    require(state == State.Proposed, "state should be Proposed");
    state = State.Voting;
  }

  function closeVoting(bool _accepted) public {
    require(state == State.Voting, "state should be Voting");
    if(_accepted) {
      state = State.Accepted;
    } else {
      state = State.Rejected;
    }
  }
}
