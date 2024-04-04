#! /bin/sh
echo "==========================================="
echo "Welcome to the local_run"
echo "It will activate the virtual environment"
echo "And run the backend code for the app"
echo "============================================"

if [ -d ".env" ];
then 
    echo "Enabling Virtual Environment"
else
    echo "No Virtual Environment. Please run local_setup.sh first"
fi

. .env/bin/activate

export ENV=development
python main.py