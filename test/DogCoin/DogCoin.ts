import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { DogCoin } from "../../src/types/DogCoin";
import { Signers } from "../types";

describe("DogCoin contract", function () {
  before(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.owner = signers[0];
    this.signers.user1 = signers[1];
    this.signers.user2 = signers[2];
  });

  beforeEach(async function () {
    const dogCoinArtifact: Artifact = await artifacts.readArtifact("DogCoin");
    this.dogCoin = <DogCoin>await waffle.deployContract(this.signers.owner, dogCoinArtifact);
  });

  describe("Deployment", function () {
    it("Should assign the total supply of dogCoins to the owner", async function () {
      const ownerBalance = await this.dogCoin.balanceOf(this.signers.owner.address);
      expect(await this.dogCoin.totalSupply()).to.equal(ownerBalance);
    });

    it("Should add the owner to holders array and mapping", async function () {
      const holder0 = await this.dogCoin.holders(0);
      expect(holder0).to.equal(this.signers.owner.address);
      const holder0idx = await this.dogCoin.holdersToIndices(this.signers.owner.address);
      expect(holder0idx).to.equal(0);
    });
  });

  describe("Transactions", function () {
    it("Should transfer dogCoins between accounts and update holders array", async function () {
      await this.dogCoin.transfer(this.signers.user1.address, 50);
      const addr1Balance = await this.dogCoin.balanceOf(this.signers.user1.address);
      expect(addr1Balance).to.equal(50);

      const holder1 = await this.dogCoin.holders(1);
      expect(holder1).to.equal(this.signers.user1.address);
      const holder1idx = await this.dogCoin.holdersToIndices(this.signers.user1.address);
      expect(holder1idx).to.equal(1);

      await this.dogCoin.connect(this.signers.user1).transfer(this.signers.user2.address, 40);
      const addr2Balance = await this.dogCoin.balanceOf(this.signers.user2.address);
      expect(addr2Balance).to.equal(40);

      const holder2 = await this.dogCoin.holders(2);
      expect(holder2).to.equal(this.signers.user2.address);
      const holder2idx = await this.dogCoin.holdersToIndices(this.signers.user2.address);
      expect(holder2idx).to.equal(2);
    });

    it("Should remove holder from holders array if they run out of dogCoins", async function () {
      await this.dogCoin.transfer(this.signers.user1.address, 50);
      await this.dogCoin.transfer(this.signers.user2.address, 50);

      // transfer all dogCoins from addr 1 back to owner
      await this.dogCoin.connect(this.signers.user1).transfer(this.signers.owner.address, 50);

      // check if addr 1 has been removed
      const addr1Balance = await this.dogCoin.balanceOf(this.signers.user1.address);
      expect(addr1Balance).to.equal(0);

      expect(await this.dogCoin.holdersLength()).to.equal(2);

      const holder1 = await this.dogCoin.holders(1);
      expect(holder1).to.equal(this.signers.user2.address);
      const holder1idx = await this.dogCoin.holdersToIndices(this.signers.user2.address);
      expect(holder1idx).to.equal(1);

      const holder0 = await this.dogCoin.holders(0);
      expect(holder0).to.equal(this.signers.owner.address);
      const holder0idx = await this.dogCoin.holdersToIndices(this.signers.owner.address);
      expect(holder0idx).to.equal(0);
    });

    it("Should fail if sender doesn’t have enough dogCoins", async function () {
      const initialOwnerBalance = await this.dogCoin.balanceOf(this.signers.owner.address);

      await expect(this.dogCoin.connect(this.signers.user1).transfer(this.signers.owner.address, 1)).to.be.reverted;

      expect(await this.dogCoin.balanceOf(this.signers.owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await this.dogCoin.balanceOf(this.signers.owner.address);

      await this.dogCoin.transfer(this.signers.user1.address, 100);

      await this.dogCoin.transfer(this.signers.user2.address, 50);

      const finalOwnerBalance = await this.dogCoin.balanceOf(this.signers.owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ethers.BigNumber.from(150)));

      const addr1Balance = await this.dogCoin.balanceOf(this.signers.user1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await this.dogCoin.balanceOf(this.signers.user2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
