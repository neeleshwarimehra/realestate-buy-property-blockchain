export const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  "function propertyName() view returns (string)",
  "function totalShares() view returns (uint256)",
  "function pricePerShare() view returns (uint256)",
  "function sharesSold() view returns (uint256)",
  "function sharesAvailable() view returns (uint256)",
  "function sharesOwned(address) view returns (uint256)",
  "function buyShares(uint256 shareAmount) payable",
  "event SharesPurchased(address indexed buyer, uint256 amount)",
];