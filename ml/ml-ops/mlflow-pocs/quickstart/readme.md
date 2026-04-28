
py -m venv env
source env/bin/activate

pip install mlflow

py test_mlflow.py


mlflow ui

http://127.0.0.1:5000