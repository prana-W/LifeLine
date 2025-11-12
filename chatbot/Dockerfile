FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update

COPY . /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8001

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
