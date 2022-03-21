import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { ReturnValue } from "../../src/types/ReturnValue";
import { Signers } from "../types";

describe("ReturnValue contract", function () {
  before(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.owner = signers[0];
  });

  beforeEach(async function () {
    const returnValueArtifact: Artifact = await artifacts.readArtifact("ReturnValue");
    this.returnValue = <ReturnValue>await waffle.deployContract(this.signers.owner, returnValueArtifact);
  });

  it("should return value of 2 wei", async function () {
    let value: string = "2";

    expect(
      await this.returnValue.callStatic.retVal({
        value,
      }),
    ).to.equal(value);
  });
});
