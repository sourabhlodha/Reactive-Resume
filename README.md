## Install docker in your linux environment
sudo snap install docker

## Clone the repo
git clone https://github.com/sourabhlodha/Reactive-Resume.git
cd Reactive-Resume

## Update .env with public ip address of server
change
PUBLIC_URL=http://127.0.0.1:8000
STORAGE_URL=http://127.0.0.1:9000/default

to
PUBLIC_URL=http://24.144.68.235:8000
STORAGE_URL=http://24.144.68.235:9000/default 

where 24.144.68.235 is your Public ip address

## Start the server
docker compose up -d

## Other useful commands

# restart server
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && docker compose up -d && docker ps