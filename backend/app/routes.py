from flask import Blueprint, request, jsonify
from . import db
from .models import CounterContracts, Chains, RequestData
from .resources import (
	is_valid_blockchainId, 
	is_valid_chain_id,
	is_valid_evm_address,
	get_timestamp,
	is_valid_inputs_contract
)
import uuid


main_bp = Blueprint("main", __name__)


@main_bp.route("/api/v1/contracts", methods=["GET"])
def list_contracts():
	#needs to fetch the details about all of the supported contracts
	contracts = CounterContracts.query.all()

	contracts_list = [{
		"id": contract.id,
		"contract_address": contract.contractAddress,
		"blockchain_id": contract.blockchainId,
		"chain_id": contract.chainId
	} for contract in contracts]

	return jsonify(contracts_list)

@main_bp.route("/api/v1/contracts", methods=["POST"])
def add_contract():
	#needs to collect all the input information
	id = uuid.uuid4()

	response

	try:
		request_body = request.get_json()

		blockchain_id = request_body.get("blockchain_id")
		contract_address = request_body.get("contract_address")
		chain_id = request_body.get("chain_id")

		# check that inputs are valid
		check = is_valid_inputs_contract(contract_address, blockchain_id, chain_id)
		if not check:
			return 400, jsonify(check[1])
			

		new_contract = CounterContracts(
			id=str(id),
			contract_address=contract_address,
			chain_id=chain_id,
			blockchain_id=blockchain_id
		)

		db.session.add(new_contract)
		db.session.commit()

		response = {
			"success": True,
			"id": id,
			"contract_address": contract_address,
			"blockchain_id": blockchain_id,
			"chain_id": chain_id
		}

	except Exception as e: 
		response = {
			"success": False,
			"message": f"Transaction Failed: {e}"
		}


	return jsonify(response)

@main_bp.route("/api/v1/contracts/<string:id>", methods=["GET"])
def get_contract(id):
	# collect details about a specific contract
	contract = db.get_or_404(CounterContracts, id)

	response = {
		"id": contract.id,
		"contract_address": contract.contractAddress,
		"blockchain_id": contract.blockchainId,
		"chain_id": contract.chainId
	}

	return jsonify(response)


@main_bp.route("/api/v1/chains/<string:chain_id>", methods=["GET"])
def get_blockchain(chain_id):
	chain_query = db.get_or_404(Chains, chain_id)

	chain = {
		"blockchain_id": chain_query.blockchainId,
		"rpc": chain_query.rpc,
		"chain_id": chain_query.chainId,
		"block_explorer_url": chain_query.blockExplorerUrls,
		"native_currency": chain_query.nativeCurrency,
		"token_symbol": chain_query.tokenSymbol,
		"decimals": chain_query.decimals,
		"chain_name": chain_query.chainName
	}

	return jsonify(chain)


@main_bp.route("/api/v1/chains", methods=["GET"])
def list_blockchains():
	chains = Chains.query.all()

	chains_list = [{ 
		"blockchain_id": chain.blockchainId,
		"rpc": chain.rpc,
		"chain_id": chain.chainId,
		"block_explorer_url": chain.blockExplorerUrls,
		"native_currency": chain.nativeCurrency,
		"token_symbol": chain.tokenSymbol,
		"decimals": chain.decimals,
		"chain_name": chain.chainName
	} for chain in chains]
	
	return jsonify(chains_list)


@main_bp.route("/api/v1/chains", methods=["POST"])
def add_blockchain():
	request_body = request.get_json()

	response = ""

	try:
		new_blockchain = Chains(
			blockchain_id = request_body.get("blockchain_id"),
			rpc = request_body.get("rpc"),
			chain_id = request_body.get("chain_id"),
			block_explorer_url = request_body.get("block_explorer_url"),
			native_currency = request_body.get("native_currency"),
			token_symbol = request_body.get("token_symbol"),
			decimals = request_body.get("decimals"),
			chain_name = request_body.get("chain_name")
		)

		db.session.add(new_blockchain)
		db.session.commit()

		response = {
			"message": "success",
			"blockchain_id": request_body.get("blockchain_id")
		}

	except Exception as e:
		response = {
			"success": False,
			"message": f"Transaction Failed: {e}"
		}

	return jsonify(response)

@main_bp.route("/api/v1/request_data", methods=["POST"])
def add_request_data():
	request_body = request.get_json()

	response = ""

	inputs = ["request_type", "blockchain_id"]
	id = uuid.uuid4()
	date = get_timestamp()

	new_request = RequestData(
		id = id,
		request_type = request_body.get("request_type"),
		blockchain_id = request_body.get("blockchain_id"),
		create_date = date
	)

	response = {
		"success": True,
		"id": id,
		"date": date
	}

	return jsonify(response)






# Collect increment usage data

# collect decrement usage data


