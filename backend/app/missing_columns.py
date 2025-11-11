# missing_columns.py
import os
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from sqlalchemy import create_engine
from sqlalchemy.exc import ProgrammingError

# Import after adding to path
from app.config import DATABASE_URL

def add_missing_columns():
    engine = create_engine(DATABASE_URL)
    print("🚀 Starting database migration...")

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
                connection.execute(sql)
                print(f"✅ Successfully executed: {sql.split()[2]}...")
            except Exception as e:
                print(f"⚠️ Error executing {sql.split()[2]}: {e}")
                connection.rollback()
            else:
                connection.commit()

    print("✨ Database migration completed!")

if __name__ == "__main__":
    add_missing_columns()