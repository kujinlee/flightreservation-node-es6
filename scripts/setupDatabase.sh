#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Default values if environment variables are not set
DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-}
DB_NAME=${DB_NAME:-reservation}

# Paths to SQL scripts
SCHEMA_SQL="sql-scripts/1-schema.sql"
DATA_SQL="sql-scripts/2-data.sql"

# Function to execute SQL script
execute_sql_script() {
  local script_path=$1
  echo "Executing SQL script: $script_path"
  mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$script_path"
  if [ $? -eq 0 ]; then
    echo "SQL script executed successfully: $script_path"
  else
    echo "Error executing SQL script: $script_path"
    exit 1
  fi
}

# Ensure the database exists
echo "Ensuring database '$DB_NAME' exists..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;"
if [ $? -eq 0 ]; then
  echo "Database '$DB_NAME' ensured."
else
  echo "Error ensuring database '$DB_NAME'."
  exit 1
fi

# Apply schema and data scripts
execute_sql_script "$SCHEMA_SQL"
execute_sql_script "$DATA_SQL"

echo "Database setup completed successfully."