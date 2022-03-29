FROM python:3.9.7
WORKDIR /test-task-app/
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .
COPY ./entrypoint.sh .
ENTRYPOINT ["sh","/test-task-app/entrypoint.sh"]
