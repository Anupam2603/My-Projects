#! /bin/sh

echo "==========================="
echo "Welcome to celery_beat.sh"
echo "It will  enable the virtual environment first"
echo "And then run celery beat"

if [ -d ".env" ];
then
    echo "Enabling virtual env"
else
    echo "No Virtual env. Please run local_setup.sh first"
    exit N
fi

. .env/bin/activate
export ENV=development
celery -A main.celery beat --max-interval 1 -l info