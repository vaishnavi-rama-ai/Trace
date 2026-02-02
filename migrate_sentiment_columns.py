"""Database migration to add sentiment analysis columns to journal_entries."""
import os
from sqlalchemy import create_engine, text

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./trace.db")
engine = create_engine(DATABASE_URL)

def migrate():
    """Add sentiment analysis columns to journal_entries table."""
    print("Running database migration...")
    
    with engine.connect() as conn:
        try:
            # Check if columns already exist
            if "postgresql" in DATABASE_URL:
                # PostgreSQL syntax
                result = conn.execute(text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='journal_entries' AND column_name='sentiment_labels'
                """))
                
                if result.fetchone():
                    print("Columns already exist. Skipping migration.")
                    return
                
                # Add columns
                conn.execute(text("""
                    ALTER TABLE journal_entries 
                    ADD COLUMN sentiment_labels TEXT,
                    ADD COLUMN sentiment_scores TEXT,
                    ADD COLUMN primary_sentiment VARCHAR(50),
                    ADD COLUMN sentiment_analyzed_at TIMESTAMP
                """))
                conn.commit()
                
            else:
                # SQLite syntax
                conn.execute(text("""
                    ALTER TABLE journal_entries ADD COLUMN sentiment_labels TEXT
                """))
                conn.execute(text("""
                    ALTER TABLE journal_entries ADD COLUMN sentiment_scores TEXT
                """))
                conn.execute(text("""
                    ALTER TABLE journal_entries ADD COLUMN primary_sentiment VARCHAR(50)
                """))
                conn.execute(text("""
                    ALTER TABLE journal_entries ADD COLUMN sentiment_analyzed_at TIMESTAMP
                """))
                conn.commit()
            
            print("✓ Migration completed successfully!")
            
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                print("Columns already exist. Skipping migration.")
            else:
                print(f"Error during migration: {str(e)}")
                raise

if __name__ == "__main__":
    migrate()
