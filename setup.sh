# Update packages.
sudo apt-get Update

# Install ufw.
sudo apt-get install ufw
ufw enable

# Open ports.
ufw allow 27015/udp
ufw allow 27016/udp

# Go to home.
cd ~

# Create the mods directory.
mkdir /home/ror2mods

# Run Risk of Rain 2 docker.
docker run \
-p 27015:27015/udp \
-p 27016:27016/udp \
-v /home/ror2mods:/home/steam/ror2ds-mods \
--name 'ror2' \
-e R2_ENABLE_MODS=1 \
-e R2_PSW='cat' \
-e R2_PLAYERS=10 \
-e R2_HOSTNAME='CHAMBERS' \
-e R2_HEARTBEAT=1 \
avivace/ror2server:latest