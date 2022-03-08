const { expect } = require("chai");

describe("ProposalFactory contract", function () {
  let ProposalFactory;
  let hardhatProposalFactory;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    ProposalFactory = await ethers.getContractFactory("ProposalFactory");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatProposalFactory = await ProposalFactory.deploy();

    await hardhatProposalFactory.deployed();
  });

  describe("Proposal Deployment", function () {
    it("Should deploy a proposal", async function () {
      const createProposalTx = await hardhatProposalFactory.createProposal('Harder Faster Scooter')
      await createProposalTx.wait()

      expect(await hardhatProposalFactory.proposalsLength()).to.equal(1)
      const proposalAddr = await hardhatProposalFactory.proposals(0)
    });
  });

});
