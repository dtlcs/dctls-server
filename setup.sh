# Update packages.
sudo apt-get update

# Install ufw.
sudo apt-get install ufw
ufw enable

# Open ports.
ufw allow 27015/udp
ufw allow 27016/udp

# Go to home.
cd ~

sudo apt-get install docker docker.io

# Run Risk of Rain 2 docker.
docker run -it \
-p 27015:27015/udp \
-p 27016:27016/udp \
-v ${PWD}/ror2mods:/home/steam/ror2ds-mods \
--name 'ror2' \
-e R2_ENABLE_MODS=1 \
-e R2_PSW='cat' \
-e R2_PLAYERS=10 \
-e R2_HOSTNAME='COME_TO_DADDY' \
-e R2_HEARTBEAT=1 \
avivace/ror2server:latest
