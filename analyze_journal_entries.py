"""Script to analyze and label all journal entries with sentiment."""
import json
import os
from datetime import datetime
import tensorflow as tf
from sqlalchemy.orm import Session
from database import SessionLocal, JournalEntry, init_db

# Load the trained model
model_path = './sentiment_model_tf/sentiment_model.keras'
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Trained model not found at {model_path}. Please train the model first.")

print("Loading trained model...")
model = tf.keras.models.load_model(model_path)
print("Model loaded successfully!")

# Load sentiment groups
with open('./sentiment_groups.json', 'r') as f:
    sentiment_groups = json.load(f)

group_names = list(sentiment_groups.keys())
print(f"Sentiment groups: {group_names}")

def analyze_text(text: str) -> dict:
    """Analyze text and return sentiment predictions."""
    predictions = model.predict(tf.constant([text], dtype=tf.string), verbose=0)[0]
    
    # Get all sentiments above threshold
    threshold = 0.5
    active_sentiments = []
    sentiment_scores = {}
    
    for i, group in enumerate(group_names):
        score = float(predictions[i])
        sentiment_scores[group] = score
        if score > threshold:
            active_sentiments.append(group)
    
    # Get primary sentiment (highest score)
    primary_sentiment = group_names[predictions.argmax()] if len(predictions) > 0 else None
    
    return {
        "labels": active_sentiments,
        "scores": sentiment_scores,
        "primary": primary_sentiment
    }

def analyze_all_entries():
    """Analyze all journal entries and update the database."""
    db: Session = SessionLocal()
    
    try:
        # Get all entries without sentiment analysis
        entries = db.query(JournalEntry).filter(
            JournalEntry.sentiment_analyzed_at.is_(None)
        ).all()
        
        if not entries:
            print("No entries to analyze.")
            return
        
        print(f"\nAnalyzing {len(entries)} journal entries...")
        
        for i, entry in enumerate(entries, 1):
            try:
                # Analyze the entry
                result = analyze_text(entry.user_message)
                
                # Update the entry
                entry.sentiment_labels = json.dumps(result["labels"])
                entry.sentiment_scores = json.dumps(result["scores"])
                entry.primary_sentiment = result["primary"]
                entry.sentiment_analyzed_at = datetime.utcnow()
                
                if i % 10 == 0:
                    print(f"Processed {i}/{len(entries)} entries...")
                    
            except Exception as e:
                print(f"Error analyzing entry {entry.id}: {str(e)}")
                continue
        
        # Commit all changes
        db.commit()
        print(f"\n✓ Successfully analyzed {len(entries)} entries!")
        
        # Show some statistics
        print("\n" + "="*60)
        print("SENTIMENT DISTRIBUTION:")
        print("="*60)
        
        for group in group_names:
            count = db.query(JournalEntry).filter(
                JournalEntry.primary_sentiment == group
            ).count()
            print(f"{group:15}: {count} entries")
            
    except Exception as e:
        db.rollback()
        print(f"Error: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("="*60)
    print("JOURNAL SENTIMENT ANALYSIS")
    print("="*60)
    analyze_all_entries()
