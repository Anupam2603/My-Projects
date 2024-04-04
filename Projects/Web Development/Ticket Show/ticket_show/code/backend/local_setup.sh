#! /bin/sh
echo "Setting up the virtual environment"
echo "And installing necessary dependenies"

if [ -d ".env" ];
then
    echo ".env folder exisits. Installing dependencies using pip"
else
    echo "Creating .env and install using pip"
    python3 -m venv .env
fi

. .env/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

deactivate