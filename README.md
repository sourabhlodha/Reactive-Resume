## Install docker in your linux environment
sudo snap install docker

## Clone the repo
git clone https://github.com/sourabhlodha/Reactive-Resume.git
<br/>
cd Reactive-Resume

## Update .env with public ip address of server
change
<br/>
PUBLIC_URL=http://127.0.0.1:8000
<br/>
STORAGE_URL=http://127.0.0.1:9000/default
<br/><br/>
to
<br/>
PUBLIC_URL=http://24.144.68.235:8000
<br/>
STORAGE_URL=http://24.144.68.235:9000/default 
<br/>

where 24.144.68.235 is your server's Public IP address

## Start the server
docker compose up -d

## Visit below link in your browser to view the app
Resume App:
<br/>
http://24.144.68.235:8000/
<br/>

Minio self hosted s3 bucket:
<br/>
http://24.144.68.235:9001/
<br/>
username: minioadmin
<br/>
password: minioadmin

where 24.144.68.235 is your server's Public IP address

## Other useful commands

restart server:<br/>
`docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && docker compose up -d && docker ps`

## Tested with Digital Ocean Droplet