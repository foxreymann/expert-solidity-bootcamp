import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { ProposalFactory } from "../../src/types/ProposalFactory";
import { Signers } from "../types";

describe("ProposalFactory contract", function () {
  before(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("ProposalFactory", function () {
    beforeEach(async function () {
      const proposalFactoryArtifact: Artifact = await artifacts.readArtifact("ProposalFactory");
      this.proposalFactory = <ProposalFactory>await waffle.deployContract(this.signers.admin, proposalFactoryArtifact);
    });

    describe("Proposal Deployment", function () {
      it("Should deploy a proposal", async function () {
        const createProposalTx = await this.proposalFactory.createProposal("Harder Faster Scooter");
        await createProposalTx.wait();

        expect(await this.proposalFactory.proposalsLength()).to.equal(1);
        const proposalAddr = await this.proposalFactory.proposals(0);

        console.log({ proposalAddr });
      });
    });
  });
});
