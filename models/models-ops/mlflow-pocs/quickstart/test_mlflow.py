import mlflow
import os

print("Working directory:", os.getcwd())

# Force MLflow to use file-based tracking
mlflow.set_tracking_uri("file:./mlruns")

with mlflow.start_run():
    mlflow.log_param("mode", "direct_access")
    mlflow.log_metric("accuracy", 0.93)

print("Tracking URI:", mlflow.get_tracking_uri())
print("Done")
