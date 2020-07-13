set -ueo pipefail


SECRET_KEY=$(head -c32 /dev/urandom | base64)
# Escape / for sed
SECRET_KEY=$(echo $SECRET_KEY |  sed -e "s#/#\\\/#g")

cp Rocket.toml.template Rocket.toml
sed -i "s/PLACEHOLDER_VALUE_FOR_SECRET_KEY/\"$SECRET_KEY\"/" Rocket.toml 

sed -i "s/DATABASE_USERNAME_PLACEHOLDER/$DATABASE_USERNAME/" Rocket.toml
sed -i "s/DATABASE_PASSWORD_PLACEHOLDER/$DATABASE_PASSWORD/" Rocket.toml
sed -i "s/DATABASE_URL_PLACEHOLDER/$DATABASE_URL/" Rocket.toml
sed -i "s/DATABASE_NAME_PLACEHOLDER/$DATABASE_NAME/" Rocket.toml

cp .env.template .env

sed -i "s/DATABASE_USERNAME_PLACEHOLDER/$DATABASE_USERNAME/" .env 
sed -i "s/DATABASE_PASSWORD_PLACEHOLDER/$DATABASE_PASSWORD/" .env 
sed -i "s/DATABASE_URL_PLACEHOLDER/$DATABASE_URL/" .env 
sed -i "s/DATABASE_NAME_PLACEHOLDER/$DATABASE_NAME/" .env 
