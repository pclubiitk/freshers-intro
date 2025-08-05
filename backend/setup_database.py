import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv
from urllib.parse import urlparse

def create_database():
    load_dotenv()
    
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("DATABASE_URL not found in environment variables")
        sys.exit(1)
    
    parsed = urlparse(database_url)
    
    db_name = parsed.path[1:]
    db_user = parsed.username
    db_password = parsed.password
    db_host = parsed.hostname
    db_port = parsed.port or 5432
    
    print(f"Setting up database: {db_name}")
    print(f"Host: {db_host}:{db_port}")
    print(f"User: {db_user}")
    
    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database='postgres'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_name,))
        exists = cursor.fetchone()
        
        if exists:
            print(f"Database '{db_name}' already exists")
        else:
            cursor.execute(f'CREATE DATABASE "{db_name}"')
            print(f"Database '{db_name}' created successfully")
        
        cursor.close()
        conn.close()
        
        test_conn = psycopg2.connect(database_url)
        test_conn.close()
        print(f"Successfully connected to database '{db_name}'")
        
        return True
        
    except psycopg2.OperationalError as e:
        error_msg = str(e)
        
        if "does not exist" in error_msg and "database" in error_msg:
            print(f"Database '{db_name}' does not exist and couldn't be created")
        elif "connection refused" in error_msg or "could not connect" in error_msg:
            print("Cannot connect to PostgreSQL server")
            print("  Make sure PostgreSQL is running and accessible")
            print("  Try one of these options:")
            print("  1. Install PostgreSQL locally")
            print("  2. Use Docker: docker run --name freshers-postgres -e POSTGRES_PASSWORD=password123456 -e POSTGRES_DB=freshers_intro -p 5432:5432 -d postgres:13")
        elif "authentication failed" in error_msg:
            print("Authentication failed")
            print("  Check your username and password in the DATABASE_URL")
        else:
            print(f"Database connection error: {error_msg}")
        
        return False
        
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("Starting database setup...")
    success = create_database()
    
    if success:
        print("\nDatabase setup completed successfully!")
        print("You can now start the backend server.")
    else:
        print("\nDatabase setup failed!")
        print("Please check the error messages above and fix the issues.")
        sys.exit(1)