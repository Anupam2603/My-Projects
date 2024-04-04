import time
from jinja2 import Template
from application.workers.workers import celery
import datetime as dt
from flask import current_app as app
from flask_sse import sse
from celery.schedules import crontab
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import pytz
from application.data.models import User, User_Tickets, Shows, Theatres
from weasyprint import HTML
from flask import jsonify, Response

SMPTP_SERVER_HOST = "localhost"
SMPTP_SERVER_PORT = 1025
SENDER_ADDRESS = "email@akj.com"
SENDER_PASSWORD = "12345"


def send_email(to_address, content="text", subject=None, message=None, attachment_file=None):
    msg = MIMEMultipart()
    msg["From"] = SENDER_ADDRESS
    msg["To"] = to_address
    msg["Subject"] = subject
    if content == "html":
        msg.attach(MIMEText(message, "html"))
    else:
        msg.attach(MIMEText(message, "plain"))
    
    if attachment_file:
        with open(attachment_file, "rb") as attachment:
            # Add file as application/octet-stream
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())
        # Email attachments are sent as base64 encoded
        encoders.encode_base64(part)
        # From: https://www.ietf.org/rfc/rfc2183.txt
        # Bodyparts can be designated `attachment' to indicate that they are
        # separate from the main body of the mail message, and that their
        # display should not be automatic, but contingent upon some further
        # action of the user.
        part.add_header(
            "Content-Disposition", f"attachment; filename= {attachment_file}",
        )
        # Add the attchment to msg
        msg.attach(part)

    try: 
        s = smtplib.SMTP(host=SMPTP_SERVER_HOST, port=SMPTP_SERVER_PORT)
        # s.starttls()
        s.login(SENDER_ADDRESS, SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()
        return True
    except Exception as e:
        print(e)
        return False
    

def create_pdf(email, report):
    html = HTML(string=report)
    dir = "static/pdf_reports/"
    file_name = email + ".pdf"
    print(dir+file_name)
    pdf = html.write_pdf()
    #print((dir+file_name))
    file_ = open(dir+file_name, "wb")
    file_.write(pdf)
    file_.close()



@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    # Daily Reminder Mail !
    sender.add_periodic_task(crontab(hour=18, minute=0), daily_send_emails.s())
    # Monthly Report!
    sender.add_periodic_task(crontab(hour=9, minute=0, day_of_month='1'), monthly_report.s())


@celery.task()
def daily_send_emails():
    subject = "Hey! You are missing Something!"
    file_ = open("static/dailymail.html", 'r')
    template = Template(file_.read())
    file_.close()
    message = template.render()
    users = User.query.all()
    for user in users:
        IST = pytz.timezone("Asia/Kolkata")
        now = dt.datetime.now(IST)
        date = now.strftime('%Y-%m-%d')
        id = user.id
        today_booked_shows = User_Tickets.query.filter_by(user_id=id, booking_date = date).all()
        if len(today_booked_shows) == 0:
            send_email(to_address = user.email, content = "html", subject=subject, message=message)


@celery.task()
def monthly_report():
    subject = "Monthly Report!"
    users = User.query.all()
    for user in users:
        id = user.id
        IST = pytz.timezone("Asia/Kolkata")
        now = dt.datetime.now(IST)
        end_date = now - dt.timedelta(days=1)
        day = end_date.day
        start_date = end_date - dt.timedelta(days = day-1)
        start_date = start_date.strftime('%Y-%m-%d')
        end_date = end_date.strftime('%Y-%m-%d')
        user_show_tickets_information = User_Tickets.query.filter(User_Tickets.user_id == id, User_Tickets.booking_date.between(start_date, end_date)).all()
        shows = {}
        for _ in user_show_tickets_information:
            shows[_.show_id] = Shows.query.filter_by(show_id = _.show_id).first().name
        # Report Creation 
        file_report = open("static/monthly_report.html", 'r')
        template_report = Template(file_report.read())
        file_report.close()
        report = template_report.render(users=user_show_tickets_information, shows = shows)
        create_pdf(user.email, report)
        # Message Creation
        file_message = open("static/monthly_message.html", "r")
        template_message = Template(file_message.read())
        file_message.close()
        message = template_message.render(email=user.email)
        #Sending the email!
        send_email(to_address = user.email, content = "html", subject=subject, message=message, attachment_file="static/pdf_reports/"+user.email+".pdf")



@celery.task()
def export_details(theatre_id):
    print("I am in celery task")
    theatre = Theatres.query.filter_by(theatre_id = theatre_id).first()
    csv_header = "Show Name, Price, Seats, Date, Time\n"
    csv_body = ""
    for show in theatre.shows:
        csv_body = csv_body + show.name + "," + str(show.price ) + "," + str(show.seats) + "," + str(show.date) + "," + str(show.time) + "\n"
    csv_content = csv_header + csv_body
    return csv_content
