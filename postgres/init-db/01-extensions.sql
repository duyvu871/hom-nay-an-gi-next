-- Create schema extensions if not exists
CREATE SCHEMA IF NOT EXISTS extensions;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS vector SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA public;
