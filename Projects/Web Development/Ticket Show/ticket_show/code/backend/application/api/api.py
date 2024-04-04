from flask_restful import Resource, Api
from flask_restful import fields, marshal, marshal_with
from flask_restful import reqparse
from application.data.models import Theatres, Shows, User_Tickets, User
from application.data.database import db
#from flask import current_app as app
import werkzeug
from flask import abort, request
from flask import Response, jsonify
from flask_security import auth_token_required, logout_user
from flask_cors import cross_origin
import datetime as dt
import pytz
from application.workers import tasks
from application.utils.cache import cache


show_resource_fields = {
    'show_id':fields.Integer,
    'name':fields.String,
    'price':fields.Integer,
    'seats':fields.Integer,
    'date':fields.String,
    'time':fields.String,
    'theatre_id': fields.String,
    'theatre': fields.Nested({"name": fields.String, "location": fields.String})
}

theatres_resource_fields = {
    'theatre_id':   fields.Integer,
    'name':    fields.String,
    'location': fields.String,
    'shows': fields.List(fields.Nested(show_resource_fields))
}

profile_resource_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'shows': fields.List(fields.Nested(show_resource_fields))
}


def admin_required(func):
    def inner(*args, **kwargs):
        email = request.headers.get('email')
        user = User.query.filter_by(email=email).first()
        if user is None:
            return 0
        else:
            for role in user.roles:
                if role.name == 'admin':
                    func(*args, **kwargs)
                    break
            return 1
    return inner


class TheatresAPI(Resource):
    @cache.memoize(timeout=50)
    @marshal_with(theatres_resource_fields)
    @auth_token_required
    def get(self):
        theatres = Theatres.query.all()
        if theatres is not None:
            return theatres
        else:
            return []
    
    @admin_required
    @auth_token_required
    def post(self):
        create_theatre_parser = reqparse.RequestParser()
        create_theatre_parser.add_argument('name')
        create_theatre_parser.add_argument('location')
        name = create_theatre_parser.parse_args().get('name', None)
        location = create_theatre_parser.parse_args().get('location', None)
        print(name, location)

        theatre_name = Theatres.query.filter_by(name=name).first()
        if (theatre_name is None)  and (name != "") and (location != ""):
            theatre_ = Theatres(name=name, location=location)
            db.session.add(theatre_)
            db.session.commit()
            cache.delete_memoized(TheatresAPI.get, TheatresAPI)
            return 1
        else:
            return 0

    @admin_required
    @auth_token_required
    def delete(self):
        delete_theatre_parser = reqparse.RequestParser()
        delete_theatre_parser.add_argument("id")
        id = int(delete_theatre_parser.parse_args().get('id', 0))
        theatre = Theatres.query.filter_by(theatre_id=id).first()
        if theatre.shows == []:
            db.session.delete(theatre)
            db.session.commit()
            cache.delete_memoized(TheatresAPI.get, TheatresAPI)
            return 1
        else:
            return 0
    
    @admin_required
    @auth_token_required
    def put(self):
        update_theatre_parser = reqparse.RequestParser()
        update_theatre_parser.add_argument("name")
        update_theatre_parser.add_argument("location")
        update_theatre_parser.add_argument("theatre_id")
        name = update_theatre_parser.parse_args().get('name', None)
        location = update_theatre_parser.parse_args().get('location', None)
        theatre_id = update_theatre_parser.parse_args().get('theatre_id', None)
        theatre = Theatres.query.filter_by(name=name, location=location).first()
        print(name, location, theatre_id)
        if (theatre is None)  and (name != "") and (location != ""):
            theatre_ = Theatres(theatre_id = theatre_id).query.filter_by(theatre_id=theatre_id).first()
            print(theatre_.theatre_id, theatre_.name, theatre_.location)
            if theatre_ is not None:
                theatre_.name = name
                theatre_.location = location
                db.session.commit()
                cache.delete_memoized(TheatresAPI.get, TheatresAPI)
                print(theatre_.theatre_id, theatre_.name, theatre_.location)
                return 1
            else:
                return -1
        else:
            return 0

class ShowsAPI(Resource):
    @cache.memoize(timeout=50)
    @marshal_with(show_resource_fields)
    @auth_token_required
    def get(self):
        shows = get_shows()
        if shows is not None:
            return shows
        else:
            return []
    
    @admin_required
    @auth_token_required
    def post(self):
        create_show_parser = reqparse.RequestParser()
        create_show_parser.add_argument('name')
        create_show_parser.add_argument('price')
        create_show_parser.add_argument('seats')
        create_show_parser.add_argument('date')
        create_show_parser.add_argument('time')
        create_show_parser.add_argument('theatre_id')
        name = create_show_parser.parse_args().get('name', None)
        price = int(create_show_parser.parse_args().get('price', 0))
        seats = int(create_show_parser.parse_args().get('seats', 0))
        date = create_show_parser.parse_args().get('date', None)
        time = create_show_parser.parse_args().get('time', None)
        theatre_id = int(create_show_parser.parse_args().get('theatre_id', 0))

        show = Shows.query.filter_by(name=name, theatre_id=theatre_id, date=date, time=time).first()
        if (show is None)  and (name != "") and (price >= 0) and (date != "") and (time != "") and (seats > 0):
            show_ = Shows(name=name, price=price, seats=seats, date=date, time=time, theatre_id=theatre_id)
            db.session.add(show_)
            db.session.commit()
            cache.delete_memoized(ShowsAPI.get, ShowsAPI)
            return 1
        else:
            return 0

    @admin_required
    @auth_token_required
    def delete(self):
        delete_show_parser = reqparse.RequestParser()
        delete_show_parser.add_argument("id")
        id = int(delete_show_parser.parse_args().get('id', 0))
        show = Shows.query.filter_by(show_id=id).first()
        db.session.delete(show)
        db.session.commit()
        cache.delete_memoized(ShowsAPI.get, ShowsAPI)
        return 1

    @admin_required
    @auth_token_required
    def put(self):
        update_show_parser = reqparse.RequestParser()
        update_show_parser = reqparse.RequestParser()
        update_show_parser.add_argument('show_id')
        update_show_parser.add_argument('name')
        update_show_parser.add_argument('price')
        update_show_parser.add_argument('seats')
        update_show_parser.add_argument('date')
        update_show_parser.add_argument('time')
        update_show_parser.add_argument('theatre_id')
        show_id = int(update_show_parser.parse_args().get('show_id', 0))
        name = update_show_parser.parse_args().get('name', None)
        price = int(update_show_parser.parse_args().get('price', 0))
        seats = int(update_show_parser.parse_args().get('seats', 0))
        date = update_show_parser.parse_args().get('date', None)
        time = update_show_parser.parse_args().get('time', None)
        theatre_id = int(update_show_parser.parse_args().get('theatre_id', 0))
        show = Shows.query.filter_by(name=name, theatre_id=theatre_id, date=date, time=time, price=price, seats=seats).first()
        if (show is None)  and (name != "") and (price >= 0) and (date != "") and (time != "") and (seats >= 0):
            show_ = Shows.query.filter_by(show_id = show_id).first()
            if show_ is not None:
                show_.name = name
                show_.price = price
                show_.seats = seats
                show_.date = date
                show_.time = time
                db.session.commit()
                cache.delete_memoized(ShowsAPI.get, ShowsAPI)
                return 1
            else:
                return -1
        else:
            return 0

class BookingAPI(Resource):
    def post(self):
        show_book_parser = reqparse.RequestParser()
        show_book_parser.add_argument("show_id")
        show_book_parser.add_argument("tickets")
        email = request.headers.get('email')
        user = User.query.filter_by(email=email).first()
        show_id = int(show_book_parser.parse_args().get("show_id", None))
        show = Shows.query.filter_by(show_id=show_id).first()
        tickets = int(show_book_parser.parse_args().get('tickets', None))
        if (show is not None )and (tickets not in [0, None]) and (user is not None):
            user_id = int(user.id)
            IST = pytz.timezone("Asia/Kolkata")
            now = dt.datetime.now(IST)
            date = now.strftime('%Y-%m-%d')
            time = now.strftime('%H:%M:%S')
            show.seats = show.seats - tickets
            booking = User_Tickets(user_id=user_id, show_id=show_id, tickets=tickets, booking_date = date, booking_time=time)
            db.session.add(booking)
            db.session.commit()
            cache.delete_memoized(ShowsAPI.get, ShowsAPI)
            return {"success": 1}
        else:
            return {"success": 0}
    
    

class ProfileAPI(Resource):
    @auth_token_required
    @marshal_with(profile_resource_fields)
    def get(self):
        email = request.headers.get('email')
        if email not in ["", None]:
            user = User.query.filter_by(email=email).first()
            if user is not None:
                return user
            else: 
                return {"success": -1}
        else:
            return {"success": 0}

    @auth_token_required
    def post(self):
        tickets_parser = reqparse.RequestParser()
        tickets_parser.add_argument("show_id")
        tickets_parser.add_argument("user_id")
        try:
            show_id = int(tickets_parser.parse_args().get("show_id", None))
            user_id = int(tickets_parser.parse_args().get("user_id", None))
            user_ticket = User_Tickets.query.filter_by(user_id=user_id, show_id=show_id).first()
            return {"tickets":user_ticket.tickets}
        except Exception as e:
            print(e)
            return {"tickets":-1}

class ExportDetails(Resource):
    def get(self, theatre_id):
        job = tasks.export_details.delay(theatre_id)
        return {"task_id": str(job.id)}, 202

    

test_api_resource_fields = {
    'msg':    fields.String,
}

class TestAPI(Resource):
    def get(self):
        return {"msg":"Hello World"}