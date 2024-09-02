Purpose of Project:
	Build a basic application that utilizes Avalanche blockchain, performs basic cross-chain actions, and leverages other developer tools.


Initial 
	This project will have a few simple components:
		1. A counter contract that can be called from one chain and will increment a value on a recipient chain. This will require one smart contract that can send and receive transactions. This contract will need to integrate with Teleporter.
		2. A basic user interface that a user can click to perform increment or decrement a value on a destination chain from a source chain.
		3. A basic API that will be used to capture some transaction data and persist it in a backend.
		4. A basic script that can be used to test the contracts and API.
		5. A script that can be used to deploy the smart contracts.
		6. An interface that a user can use to deploy new counter contracts to their application

	There is a Flask API that will be used to:
		1. Capture data about usage of the application
		2. Take inputs about newly set up counter contracts