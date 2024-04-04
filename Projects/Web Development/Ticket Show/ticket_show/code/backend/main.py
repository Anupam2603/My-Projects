import os
from flask import Flask, Response, jsonify
from flask_restful import Resource, Api
from application.utils import config
from application.utils.config import LocalDevelopmentConfig
from application.data.database import db
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_security import Security, SQLAlchemySessionUserDatastore, SQLAlchemyUserDatastore
from application.data.models import User, Role, roles_users
from flask_security import utils, current_user, logout_user
from flask_cors import CORS, cross_origin
from flask_restful import reqparse
import logging
from application.workers import workers
from celery.schedules import crontab
from application.workers import tasks
from flask_caching import Cache
from application.api.api import TestAPI, TheatresAPI, ShowsAPI, BookingAPI, ProfileAPI, ExportDetails
from flask_security import auth_token_required
from application.utils.cache import cache
#Intializing app, api, celery!
app = None
api = None
celery = None

#Code for logging the activities
logging.basicConfig(filename='debug.log', level=logging.DEBUG, format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')


# Function for creating app!
def create_app():
    # Setting up app
    app = Flask(__name__)
    CORS(app) # Implementing cross origin policy according the our app!
    if os.getenv('ENV', "development") == "production":
      app.logger.info("Currently no production config is setup.")
      raise Exception("Currently no production config is setup.")
    else:
      app.logger.info("Staring Local Development.")
      print("Staring Local Development")
      app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    app.app_context().push()
    app.logger.info("App setup complete")
    
    #Setting up api  
    api = Api(app)
     
    
    # Setting up celery
    celery = workers.celery   
    celery.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"]
    )
    celery.conf.timezone = "Asia/Kolkata"
    celery.Task = workers.ContextTask
    
    #Initializing caching!
    cache.init_app(app)
    app.app_context().push() 
    return app, api, celery

app, api, celery = create_app()



# Setup Flask-Security
user_datastore = SQLAlchemySessionUserDatastore(db.session, User, Role)
security = Security(app, user_datastore)

  
# Checking Admin Access
@app.route("/api/is_admin", methods=["POST"])
def is_admin():
  is_admin_parser = reqparse.RequestParser()
  is_admin_parser.add_argument("email")
  email = is_admin_parser.parse_args().get("email", None)
  if email is not None:
    user = User.query.filter_by(email=email).first()
    role = user.roles[0]
    if role.name == "admin":
      return {"success":1}
    else:
      return {"success":-1}

# Checking if download is ready!
@app.route("/api/download/<task_id>", methods=["GET"])
@auth_token_required
def is_download_ready(task_id):
  result = celery.AsyncResult(task_id)
  if result.ready():
    csv_data = result.get()
    response = Response(csv_data, content_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=theatre.csv"
    return response
  else:
    return {"status": "in_progress"}, 202

# End point for registring the user!
@app.route("/api/register", methods=["POST"])
def register():
  register_parser = reqparse.RequestParser()
  register_parser.add_argument("email")
  register_parser.add_argument("password")
  email = register_parser.parse_args().get("email", None)
  password = register_parser.parse_args().get("password", None)
  if email not in ["", None] and password not in ["", None]:
    try:
      user = User.query.filter_by(email=email).first()
      if user is None:
        user_datastore.create_user(email=email, password=utils.hash_password(password))
        db.session.commit()
        db.session.begin()
        user_ = User.query.filter_by(email=email).first()
        role_ = Role.query.filter_by(name='user').first()
        new_row = roles_users.insert().values(user_id=user_.id, role_id=role_.id)
        db.session.execute(new_row)
        db.session.commit()
        print("success")
        return {"success": 1}
      else:
        return {"success": 0}
    except Exception as e:
      print(e)
      return {"success": -1}
  else:
    return {"success": -2}

# Adding all end-points to our api!
api.add_resource(TestAPI, "/api/test")
api.add_resource(TheatresAPI, "/api/theatres")
api.add_resource(ShowsAPI, "/api/shows")
api.add_resource(BookingAPI, "/api/book")
api.add_resource(ProfileAPI, "/api/profile")
api.add_resource(ExportDetails, "/api/export_details/<int:theatre_id>")



# Starting the app!
if __name__ == '__main__':
  # Run the Flask app
  app.run(debug=True, host='0.0.0.0',port=8081)