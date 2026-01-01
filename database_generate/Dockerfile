FROM python:3.12-slim

WORKDIR /app

COPY requirements_v2.txt .
RUN pip install --no-cache-dir -r requirements_v2.txt

COPY . .

EXPOSE 8835

CMD ["python", "run_api.py"]
