
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.regularizers import l2
import json
import os

# Load data from local file or environment variable
data_path = os.getenv('DATA_PATH', './data.csv')
if not os.path.exists(data_path):
    raise FileNotFoundError(f"Data file not found at {data_path}. Please ensure data.csv is in the working directory.")

df = pd.read_csv(data_path)
print("Columns in the dataset:")
df.rename(columns={"Answer": "journal_entry"}, inplace=True)
df.drop(columns= ['Answer.t1.exercise.raw', 'Answer.t1.family.raw', 'Answer.t1.food.raw', 'Answer.t1.friends.raw', 'Answer.t1.god.raw', 'Answer.t1.health.raw', 'Answer.t1.love.raw', 'Answer.t1.recreation.raw', 'Answer.t1.school.raw', 'Answer.t1.sleep.raw', 'Answer.t1.work.raw'], inplace=True)
print(df.columns.tolist())

# Define sentiment groups
sentiment_groups = {
    'Happy': ['Answer.f1.happy.raw', 'Answer.f1.excited.raw', 'Answer.f1.proud.raw', 'Answer.f1.satisfied.raw'],
    'Sad': ['Answer.f1.sad.raw', 'Answer.f1.bored.raw', 'Answer.f1.nostalgic.raw'],
    'Angry': ['Answer.f1.angry.raw', 'Answer.f1.frustrated.raw', 'Answer.f1.disgusted.raw', 'Answer.f1.jealous.raw'],
    'Anxious': ['Answer.f1.afraid.raw', 'Answer.f1.anxious.raw', 'Answer.f1.ashamed.raw', 'Answer.f1.awkward.raw'],
    'Calm': ['Answer.f1.calm.raw'],
    'Confused': ['Answer.f1.confused.raw', 'Answer.f1.surprised.raw']
}

def create_grouped_multilabel(df, sentiment_groups):
    """
    Create multi-label targets where:
    - If all marked emotions belong to one group → single label for that group
    - If marked emotions span multiple groups → multiple labels
    """
    multilabel_data = []
    stats = {'single_group': 0, 'multi_group': 0, 'no_emotion': 0}

    for idx, row in df.iterrows():
        # Find which groups have at least one marked emotion
        active_groups = []
        for group_name, columns in sentiment_groups.items():
            has_emotion = any(row[col] == 1 for col in columns if col in df.columns)
            if has_emotion:
                active_groups.append(group_name)

        # Create binary label vector
        label_vector = [1 if group in active_groups else 0 for group in sentiment_groups.keys()]
        multilabel_data.append(label_vector)

        # Track statistics
        if len(active_groups) == 0:
            stats['no_emotion'] += 1
        elif len(active_groups) == 1:
            stats['single_group'] += 1
        else:
            stats['multi_group'] += 1

    return np.array(multilabel_data), stats

# Get emotion columns
emotion_columns = df.drop(columns="journal_entry")

# Create multi-label targets
y_multilabel, stats = create_grouped_multilabel(df[emotion_columns], sentiment_groups)

print("="*60)
print("LABEL DISTRIBUTION:")
print("="*60)
print(f"Entries with single sentiment group: {stats['single_group']}")
print(f"Entries with multiple sentiment groups: {stats['multi_group']}")
print(f"Entries with no emotions: {stats['no_emotion']}")
print(f"Total entries: {len(y_multilabel)}")

# Check distribution per group
print(f"\n{'='*60}")
print("SAMPLES PER SENTIMENT GROUP:")
print("="*60)
for idx, group_name in enumerate(sentiment_groups.keys()):
    count = y_multilabel[:, idx].sum()
    print(f"{group_name:15}: {count} entries ({count/len(y_multilabel)*100:.1f}%)")

# Filter out entries with no emotions
has_emotion = y_multilabel.sum(axis=1) > 0
y_multilabel_filtered = y_multilabel[has_emotion]
df_filtered = df[has_emotion].reset_index(drop=True)

print(f"\n{'='*60}")
print(f"After filtering: {len(df_filtered)} entries with emotions")
print("="*60)

X_train, X_val, y_train, y_val = train_test_split(
    df_filtered["journal_entry"].values,
    y_multilabel_filtered,
    test_size=0.2,
    random_state=42
)

# Convert to TensorFlow datasets
train_ds = tf.data.Dataset.from_tensor_slices((
    [str(x) for x in X_train],
    y_train.astype(np.float32)
)).batch(32)

val_ds = tf.data.Dataset.from_tensor_slices((
    [str(x) for x in X_val],
    y_val.astype(np.float32)
)).batch(32)

print(f"\nTraining samples: {len(X_train)}")
print(f"Validation samples: {len(X_val)}")
print(f"Number of sentiment groups: {len(sentiment_groups)}")

# Create the TextVectorization layer
max_features = 6000
vectorizer_layer = layers.TextVectorization(
    max_tokens=6000,
    output_mode='tf_idf',
    ngrams=2,
    output_sequence_length=None  # Let it be variable length like TfidfVectorizer
)

# Adapt it to your training data - use TensorFlow dataset
vectorizer_layer.adapt(tf.data.Dataset.from_tensor_slices(df_filtered["journal_entry"].values.astype(str)))

num_classes = len(sentiment_groups)

inputs = keras.Input(shape=(1,), dtype=tf.string, name='text_input')
x = vectorizer_layer(inputs)

x = layers.Dense(256, activation='relu', kernel_regularizer=l2(0.001))(x)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.5)(x)
x = layers.Dense(128, activation='relu', kernel_regularizer=l2(0.001))(x)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.4)(x)
x = layers.Dense(64, activation='relu')(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(num_classes, activation='sigmoid')(x)

model = keras.Model(inputs=inputs, outputs=outputs)

model.compile(
    loss='binary_crossentropy',
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    metrics=['accuracy']
)

print(model.summary())

callbacks = [
    keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True,
        verbose=1
    ),
    keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=5,
        min_lr=1e-6,
        verbose=1
    )
]
print("\nTraining model...")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=18,
    callbacks=callbacks,
    verbose=1
)

# Save the trained model in Keras format
model_path = './sentiment_model.keras'
model.save(model_path)
print(f"\nModel saved to {model_path}")

# Save sentiment groups mapping
with open('./sentiment_groups.json', 'w') as f:
    json.dump(sentiment_groups, f)
print("Sentiment groups saved to sentiment_groups.json")

# Your journal entry
my_entry = "I had a really good day today. Spent time with friends and family catching up on stories and playing board games. ."

# Get predictions
predictions = model.predict(tf.constant([my_entry], dtype=tf.string), verbose=0)[0]

# Get sentiment group names
group_names = list(sentiment_groups.keys())

# Show results
print("="*60)
print("YOUR JOURNAL ENTRY:")
print("="*60)
print(my_entry)
print("\n" + "="*60)
print("PREDICTED SENTIMENTS:")
print("="*60)

# Show sentiments with probability > 50%
for i, group in enumerate(group_names):
    if predictions[i] > 0.5:
        print(f"✓ {group}: {predictions[i]:.1%}")

# Show all probabilities
print("\n" + "="*60)
print("ALL PROBABILITIES:")
print("="*60)
for i, group in enumerate(group_names):
    bar = '█' * int(predictions[i] * 20)
    print(f"{group:12}: {predictions[i]:.1%} {bar}")

