

def is_valid_evm_address(address):
	if type(address) != str: return False

	if len(address) < 42: return False

	if address[0:2] != "0x": return False

	return True

def is_valid_blockchainId(blockchain_id):
	if type(blockchain_id) != str: return False

	if len(blockchain_id) < 66: return False

	if blockchain_id[0:2] != "0x": return False

	return True

def is_valid_chain_id(chain_id):
	if type(chain_id) != int: return False

	if len(chain_id) > 6: return False

	return True

def is_valid_rpc(rpc):
	pass

def is_valid_inputs_contract(address, blockchain_id, chain_id):
	status = True

	message = {
		"success": False,
		"message": "Input Errors:"
	}

	if not is_valid_evm_address(address):
		error = "invalid contract address format; "
		message["message"] = message.get("message") + error
		status = False

	if not is_valid_blockchainId(blockchain_id):
		error = "invalid blockchain_id format; "
		message["message"] = message.get("message") + error
		status = False

	if not is_valid_chain_id(chain_id):
		error = "invalid chain_id; "
		message["message"] = message.get("message") + error
		status = False

	if status == False:
		return status, message
	
	else:
		return True





def get_timestamp():
	current_time = datetime.now(datetime.UTC)
	current_timestamp = current_time.timestamp()
	return current_timestamp