#! /bin/sh
echo "============================"
echo "Welcome to celery_worker.sh"
echo "It will enable the virtual environement first"
echo "Then run celery workers"
echo "============================"

if [ -d ".env" ];
then
    echo "Enabling virtual env"
else
    echo "No Virtual env. Please run local_setup.sh first"
    exit N
fi

# Activate virtual env
. .env/bin/activate
export ENV=development
celery -A main.celery worker -l info
