# missing_columns.py
import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Build the database URL from environment variables
DB_TYPE = os.getenv('DB_TYPE', 'mysql')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

# Use pymysql as the MySQL driver
import pymysql
pymysql.install_as_MySQLdb()
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"

def add_missing_columns():
    engine = create_engine(DATABASE_URL)
    print("🚀 Starting database migration...")
    print(f"🔗 Connecting to database: {DB_TYPE}://{DB_USER}:***@{DB_HOST}:{DB_PORT}/{DB_NAME}")

    # SQL statements to add missing columns
    sql_statements = [
        """
        ALTER TABLE notifications 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
        """,
        """
        ALTER TABLE payroll_history 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
        """,
        """
        ALTER TABLE horarios_excepcion 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
        """
    ]

    with engine.connect() as connection:
        for sql in sql_statements:
            try:
                # Wrap the SQL in text() to make it executable
                connection.execute(text(sql))
                print(f"✅ Successfully executed: {sql.split()[2]}...")
            except Exception as e:
                print(f"⚠️ Error executing {sql.split()[2]}: {e}")
                connection.rollback()
            else:
                connection.commit()

    print("✨ Database migration completed!")

if __name__ == "__main__":
    add_missing_columns()