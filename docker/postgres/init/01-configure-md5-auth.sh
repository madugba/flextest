#!/bin/bash
# PostgreSQL initialization script
# Configures MD5 authentication for PgBouncer compatibility
# This runs automatically when PostgreSQL container starts for the first time

set -e

echo "Configuring PostgreSQL for MD5 authentication (PgBouncer compatibility)..."

# Update pg_hba.conf to use MD5 authentication (instead of SCRAM)
echo "Updating pg_hba.conf to use MD5..."
sed -i 's/scram-sha-256/md5/g' "$PGDATA/pg_hba.conf"

# Set password encryption to MD5 for all users
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Ensure password encryption is set to MD5
    ALTER SYSTEM SET password_encryption = 'md5';

    -- Re-create user password with MD5 encryption
    ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';

    -- Grant necessary permissions
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;

    -- Reload configuration to apply pg_hba.conf changes
    SELECT pg_reload_conf();
EOSQL

echo "PostgreSQL MD5 authentication configured successfully!"
