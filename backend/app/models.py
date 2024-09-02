from . import db

'''
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)
'''

    
class CounterContracts(db.Model):
    id = db.Column(db.String(), primary_key=True)
    contract_address = db.Column(db.String(), unique=False)
    blockchain_id = db.Column(db.String(), unique=False)
    chainId = db.Column(db.String(), unique=False)


class Chains(db.Model):
    blockchain_id = db.Column(db.String(), primary_key=True)
    rpc = db.Column(db.String(), unique=False)
    chain_id = db.Column(db.String(), unique=False)
    block_explorer_url = db.Column(db.String(), unique=False)
    native_currency = db.Column(db.String(), unique=False)
    token_symbol = db.Column(db.String(), unique=False)
    decimals = db.Column(db.Integer(), unique=False)
    chain_name = db.Column(db.String(), unique=False)


class RequestData(db.Model):
    id = db.Column(db.String(), primary_key=True)
    request_type = db.Column(db.String())
    blockchain_id = db.Column(db.String())
    create_date = db.Column(db.Integer())
