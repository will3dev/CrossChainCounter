console.log("Instantiate web3");
// libraries being used
let web3;
let contract;

console.log("Creating event listeners");

window.addEventListener("load", initialize);

document
  .getElementById("connect-button")
  .addEventListener("click", connectMetaMask);

// listener to trigger increment count
document
  .getElementById("send-increment-button")
  .addEventListener("click", incrementCount);

// listener to trigger decrement count
document
  .getElementById("send-decrement-button")
  .addEventListener("click", decrementCount);

// listener to trigger network change
document
  .getElementById("source-network-select")
  .addEventListener("change", changeConnectedNetwork);

document
  .getElementById("destination-select")
  .addEventListener("change", changeDestinationNetworkData);

console.log("Event listeners added");

const networkDetails = {
  fuji: {
    contractAddress: "0x5cDF5864432590F33873431fAA3275784F43Ee13",
    blockchainId:
      "0x7fc93d85c6d62c5b2ac0b519c87010ea5294012d1e407030d6acd0021cac10d5",
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
    chainId: 43113,
    blockExplorerUrls: "https://subnets-test.avax.network/c-chain",
    nativeCurrency: "Fuji AVAX",
    tokenSymbol: "AVAX",
    decimals: 18,
    chainName: "C-Chain",
  },
  dispatch: {
    contractAddress: "0x342AFBDa149f1Ae29c092ea65947A3F8A0cdf6aE",
    blockchainId:
      "0x9f3be606497285d0ffbb5ac9ba24aa60346a9b1812479ed66cb329f394a4b1c7",
    rpc: "https://subnets.avax.network/dispatch/testnet/rpc",
    chainId: 779672,
    blockExplorerUrls: "https://subnets-test.avax.network/dispatch",
    nativeCurrency: "Dispatch Token",
    tokenSymbol: "DIS",
    decimals: 18,
    chainName: "Dispatch",
  },
  stealthnet: {
    contractAddress: "0x5fD3e5594B40112dB781CD01e4954d794fe15Ae9",
    blockchainId:
      "0xac5f8faaf8ea64c39d80e1aa70b752a3be4bad8813340e6dc2379a9724708590",
    rpc: "https://subnets.avax.network/stealthnet/testnet/rpc",
    chainId: 24010,
    blockExplorerUrls: "https://subnets-test.avax.network/stealthnet",
    nativeCurrency: "Stealthy",
    tokenSymbol: "STLTHY",
    decimals: 18,
    chainName: "Stealthnet",
  },
};

// variables
let contractABI = [];

// set stealthnet to be default
let destinationSelection = networkDetails.fuji;

//set fuji to be the default
let sourceSelection = networkDetails.fuji;

// this function is used to convert the chainId as an integer to a hex
function decimalToHex(chainId) {
  return `0x${chainId.toString(16)}`;
}

async function initialize() {
  try {
    await fetchContractABI();
    connectMetaMask();
    await checkChainConnection();
    createAllCountCards();
    pollForCountUpdates(10000);
  } catch (error) {
    console.error("Initialization failed", error);
  }
}

// application logic
function determineNetworkDetails(network) {
  let fetchedNetworkInformation = "";

  try {
    if (network == "c-chain") {
      fetchedNetworkInformation = networkDetails.fuji;
      console.log("Selected network is C-Chain Fuji");
    } else if (network == "dispatch") {
      fetchedNetworkInformation = networkDetails.dispatch;
      console.log("Selected network is Dispatch");
    } else if (network == "stealthnet") {
      fetchedNetworkInformation = networkDetails.stealthnet;
      console.log("Selected network is Stealthnet");
    }
  } catch (error) {
    console.error("Error fetching destination details");
  }

  return fetchedNetworkInformation;
}

// this function will be used to fetch the destination chain selection
async function getNetworkSelection(destinationOrSource) {
  if (destinationOrSource == "destination") {
    const destination = document.getElementById("destination-select").value;
    destinationSelection = determineNetworkDetails(destination);
  }
  // otherwise assume
  else if (destinationOrSource == "source") {
    const source = document.getElementById("source-network-select").value;
    sourceSelection = determineNetworkDetails(source);
  } else {
    console.error(
      "There was an error determining destination or source selection."
    );
  }
}

async function changeDestinationNetworkData() {
  getNetworkSelection("destination");
}

// use this to fetch the contract ABI
async function fetchContractABI() {
  return new Promise((resolve, reject) => {
    fetch("./resources/counterContract.abi.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong fetching ABI");
        }
        console.log("Contract ABI was successfully fetched.");
        return response.json();
      })
      .then((abi) => {
        contractABI = abi;
        resolve();
      })
      .catch((error) => {
        console.error("There was an error fetching ABI", error);
        reject(error);
      });
  });
}

async function connectMetaMask() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      document.getElementById("connect-button").innerText =
        "MetaMask Connected";
      document.getElementById("send-increment-button").disabled = false;
      document.getElementById("send-decrement-button").disabled = false;

      // set the contract address based on the connected source
      contract = new web3.eth.Contract(
        contractABI,
        sourceSelection.contractAddress
      );
    } catch (error) {
      console.error("User denied account access or there is an error:", error);
    }
  } else {
    alert("Please install MetaMask!");
  }
}

async function checkChainConnection() {
  const connectedChainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  console.log("Current chainId connected to wallet: ", connectedChainId);

  const sourceHexChainId = decimalToHex(sourceSelection.chainId);
  console.log("Current selected network is: ", sourceHexChainId);

  // check to see if the current connected is different from the selected source, if it is then change connected.
  if (connectedChainId !== sourceHexChainId) {
    changeConnectedNetwork();
  } else {
    console.log("User is connected to the correct chain");
  }
}

// This function is used to increment the count on the destination chain
async function incrementCount() {
  console.log("Increment count request started");

  document.getElementById("send-increment-button").disabled = true;

  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  try {
    const result = await contract.methods
      .sendCountIncrementRequest(
        destinationSelection.blockchainId,
        destinationSelection.contractAddress,
        1000000
      )
      .send({ from: account });
    console.log("Contract call successful:", result);
  } catch (error) {
    console.error("Error calling smart contract:", error);
  }

  document.getElementById("send-increment-button").disabled = false;
}

// This function is used to decrement the count on the destination chain
async function decrementCount() {
  console.log("Decrement count request made.");

  document.getElementById("send-decrement-button").disabled = true;

  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  try {
    const result = await contract.methods
      .sendCountDecrementRequest(
        destinationSelection.blockchainId,
        destinationSelection.contractAddress,
        1000000
      )
      .send({ from: account });
    console.log("Contract call successful:", result.transactionHash);
  } catch (error) {
    console.error("Error calling smart contract:", error);
  }

  document.getElementById("send-decrement-button").disabled = false;
}

// Need to update logic because when fetching the count we need to change to the destination

async function changeConnectedNetwork() {
  getNetworkSelection("source");

  console.log(`Connecting to ${sourceSelection.chainName}.`);

  const sourceHexChainId = decimalToHex(sourceSelection.chainId);

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: sourceHexChainId,
        },
      ],
    });

    console.log("retrying connect network");
    // set the contract to use the changed network
    contract = new web3.eth.Contract(
      contractABI,
      sourceSelection.contractAddress
    );

    console.log(contract.Contract);
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: sourceHexChainId,
              chainName: sourceSelection.chainName,
              rpcUrls: [sourceSelection.rpc],
              blockExplorerUrls: [sourceSelection.blockExplorerUrls],
              nativeCurrency: {
                decimals: sourceSelection.decimals,
                name: sourceSelection.nativeCurrency,
                symbol: sourceSelection.tokenSymbol,
              },
            },
          ],
        });
      } catch (addError) {
        console.log("There was an error adding network");
      }
    } else {
      if (switchError.code === 4001) {
        alert("Please connect to MetaMask.");
        console.log("Please connect to MetaMask.");
      } else {
        alert(switchError);
        console.error(switchError);
      }
    }
  }
}

async function getCount() {
  console.log("Get count request made");

  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  document.getElementById("get-count-button").disabled = true;

  try {
    console.log("Attempting to fetch count");
    const result = await contract.methods.Count().call();
    console.log(`Count on ${destinationSelection.chainName}: `, result);

    // present the count result
    document.getElementById(
      "output"
    ).textContent = `Count on ${sourceSelection.chainName} is ${result}`;
  } catch (err) {
    alert(err);
  }

  document.getElementById("get-count-button").disabled = false;
}

async function getNetworkCount(network) {
  const contractAddress = networkDetails[network].contractAddress;
  const rpc = networkDetails[network].rpc;
  const chainName = networkDetails[network].chainName;

  const selectedChainWeb3 = new Web3(rpc);

  const selectedChainContract = new selectedChainWeb3.eth.Contract(
    contractABI,
    contractAddress
  );
  console.log(
    `Fetching count ${chainName} - RPC: ${rpc}; Contract Address: ${contractAddress}`
  );

  let selectedChainCount = 0;
  try {
    console.log(
      `Attempting to fetch count on ${networkDetails[network].chainName}`
    );
    const count = await selectedChainContract.methods.Count().call();
    selectedChainCount = count;

    console.log("Success fetching count details");
  } catch (err) {
    alert(err);
  }
  console.log(selectedChainCount);
  return selectedChainCount;
}

let cardIds = [];

async function addCountCard(chainName, count, id) {
  const container = document.getElementById("count-container");

  const card = document.createElement("div");
  card.className = "card";
  card.id = id;

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = chainName;

  const cardCount = document.createElement("p");
  cardCount.id = `count-${id}`;
  cardCount.textContent = count;

  card.appendChild(cardTitle);
  card.appendChild(cardCount);

  container.appendChild(card);
}

async function createAllCountCards() {
  for (const key in networkDetails) {
    if (networkDetails.hasOwnProperty(key)) {
      const chainName = networkDetails[key].chainName;
      const chainId = networkDetails[key].chainId;
      const currentCount = await getNetworkCount(key);

      addCountCard(chainName, currentCount, chainId);
    }
  }
}

async function checkForCountUpdates() {
  for (const key in networkDetails) {
    try {
      console.log(`Refreshing count for ${networkDetails[key].chainName}`);
      elementId = `count-${networkDetails[key].chainId}`;
      countCard = document.getElementById(elementId);

      count = await getNetworkCount(key);
      countCard.textContent = count;
    } catch (error) {
      console.error("Update current count failed", error);
    }
  }
}

async function pollForCountUpdates(interval) {
  setInterval(checkForCountUpdates, interval);
}
