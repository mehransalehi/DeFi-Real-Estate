export const mockContract = {
    address: "0x0000000000000000000000000000000000000000", // dummy address
    abi: [
      {
        inputs: [
          { internalType: "uint256", name: "propertyId", type: "uint256" },
          { internalType: "string", name: "offerAmount", type: "string" },
        ],
        name: "makeOffer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  };