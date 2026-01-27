-- PostgreSQL Initialization Script
-- Optimized for high-performance, high-availability setup

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create application user (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'flextest_app') THEN
        CREATE USER flextest_app WITH PASSWORD 'flextest_app_password';
    END IF;
END
$$;

-- Grant privileges
GRANT CONNECT ON DATABASE flextest_db TO flextest_app;
GRANT USAGE, CREATE ON SCHEMA public TO flextest_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO flextest_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO flextest_app;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO flextest_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO flextest_app;

-- Performance monitoring view
CREATE OR REPLACE VIEW pg_stat_statements_top AS
SELECT
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;

-- Connection stats view
CREATE OR REPLACE VIEW connection_stats AS
SELECT
    datname,
    usename,
    application_name,
    client_addr,
    state,
    COUNT(*) as connections
FROM pg_stat_activity
WHERE datname IS NOT NULL
GROUP BY datname, usename, application_name, client_addr, state;

COMMENT ON VIEW connection_stats IS 'Active database connections grouped by database, user, and application';
