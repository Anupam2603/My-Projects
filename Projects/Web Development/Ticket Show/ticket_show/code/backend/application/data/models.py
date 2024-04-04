from .database import db
from flask_security import UserMixin, RoleMixin
from flask_login import login_manager

roles_users = db.Table('roles_users',
        db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
        db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))) 


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False) 
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='joined'))
    shows = db.relationship("Shows", secondary="user_tickets", backref=db.backref('users', lazy='joined'))

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class Theatres(db.Model):
    __tablename__ = 'theatres'
    theatre_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    shows = db.relationship("Shows", backref=db.backref("theatre", lazy="joined"))

class Shows(db.Model):
    __tablename__ = 'shows'
    show_id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String) 
    price = db.Column(db.Integer)
    seats = db.Column(db.Integer)
    date = db.Column(db.String)
    time = db.Column(db.String)
    theatre_id = db.Column(db.Integer, db.ForeignKey("theatres.theatre_id"), nullable=False)

class User_Tickets(db.Model):
    __tablename__ = 'user_tickets'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    show_id = db.Column(db.Integer, db.ForeignKey("shows.show_id"), nullable=False)
    tickets = db.Column(db.Integer, nullable=False)
    booking_date = db.Column(db.String)
    booking_time = db.Column(db.String)
    