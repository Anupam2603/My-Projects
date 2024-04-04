# Local Setup
- It will set up the virtual environment for backend and download all the dependencies.

# Local Development Run
- `local_run.sh` It will start the flask backend app in `development`. Suited for local development.

# Local Development Run For Frontend
- `frontend.sh` It will start the vue frontend app in `development`. Suited for local development.

# Local Development Run For Redis Server
- `redis_server.sh` It will start redis server.

# Local Development Run For Mailhog
- `mailhog.sh` It will start smtp sever.

# Local Development Run For Celery beat
- `celery_beat.sh` It will start celery beat.

# Local Development Run For celery worker
- `celery_worker.sh` It will start celery worker.

# Folder Structure


```
├── code
│    ├── backend
│    │    ├── application
│    │    │   ├── api
│    │    │   │   ├── api.py
│    │    │   │   └── __init__.py
│    │    │   │    
│    │    │   │── data
│    │    │   │   ├── database.py
│    │    │   │   ├── models.py
│    │    │   │   └── __init__.py  
│    │    │   │
│    │    │   ├── utils
│    │    │   │   ├── cache.py
│    │    │   │   ├── config.py
│    │    │   │   └── __init__.py
│    │    │   │
│    │    │   ├── workers
│    │    │   │   ├── tasks.py
│    │    │   │   ├── workers.py
│    │    │   └── └── __init__.py
│    │    │   
│    │    ├── db_directory
│    │    │   └── ticket_show.sqlite3
│    │    ├── local_run.sh
│    │    ├── local_setup.sh
│    │    ├── __init__.py
│    │    ├── main.py
│    │    ├── debug.log
│    │    ├── requirements.txt
│    │    ├── celery_beat.sh
│    │    ├── celery_worker.sh
│    │    ├── redis_server.sh
│    │    ├── mailhog.sh
│    │    └── static
│    │        ├── dailymail.html
│    │        ├── monthly_message.html   
│    │        ├── monthly_report.html 
│    │        └── pdf_reports
│    │
│    └── fronend  
│    │     ├── components
│    │     │   ├── admin
│    │     │   │   ├── admindashboard.js
│    │     │   │   ├── adminlogin.js
│    │     │   │   ├── showcreateform.js
│    │     │   │   ├── shows.js
│    │     │   │   ├── theatre.js
│    │     │   │   └── theatrecreateform.js
│    │     │   │    
│    │     │   │── user
│    │     │   │   ├── profile.js
│    │     │   │   ├── register.js
│    │     │   │   ├── shows.js
│    │     │   │   ├── userdashboard.js
│    │     │   │   ├── theatre.js
│    │     │   │   └── userlogin.js 
│    │     │   │
│    │     │   └── homepage.js
│    │     │   
│    │     ├── utils
│    │     │   └── router.js
│    │     ├── frontend.sh
│    │     ├── index.html
│    │     └── main.js 
│    │ 
│    └── README.md
│  
└── Ticket_Show.pdf     
```
