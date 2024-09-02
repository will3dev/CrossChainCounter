from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config 


db = SQLAlchemy()

def create_app(config_name):
	app = Flask(__name__)
	
	from .routes import main_bp
	app.register_blueprint(main_bp)

	if config_name:
		app.config.from_object(config[config_name])

	db.init_app(app)

	return app


#can run flask app using FLASK_ENV=development

	