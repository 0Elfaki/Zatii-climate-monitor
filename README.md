# 🌍 Zatii Climate Monitor
A physics-informed machine learning pipeline designed to predict agricultural dry spells in the Algadarif region.
This project leverages domain-driven meteorological features and a transparent inference interface for community use.
***
## 📜 Description
This project allows researchers and farmers to predict dry spell risks with high precision by leveraging:
- A **Physics-Informed Approach** (e.g., "Thirsty Air" detection via VPD & Soil Moisture interactions)
- **Noise Reduction strategies** (removing complex rolling variances that caused overfitting)
- An **Open Inference Pipeline** where users can upload custom datasets to get immediate predictions
The pipeline addresses the critical issue of food security in Algadarif by filtering out statistical noise and focusing on physical meteorological realities.
***
## 🔧 Features
- 📤 **Upload & Test Interface**: Allows users to test their own `.csv` weather data against the model
- ⚛️ **Physics-Based Features**: Uses interaction terms (VPD × Soil Moisture) to model evaporation physics
- 📉 **Noise Filtering**: Explicitly excludes rolling statistical aggregates (variance/std dev) to prevent overfitting
- ⚖️ **Imbalance Handling**: Optimizes `scale_pos_weight` and probability thresholds (0.35–0.40) to detect rare dry events
- ⏳ **Lag Features**: Captures weather sequences using simple lag1 and lag2 history
***
## 📡 Multi-Channel Access (AI Agent Layer)

Farmers do not interact with the model directly. An AI agent sits between the farmer and the prediction pipeline, handling natural-language queries, running them through the model, and returning a clear, actionable answer, no CSV uploads, thresholds, or machine learning knowledge required.

Because reliable internet access cannot be assumed in the regions this project serves, the agent is reachable through whatever channel a farmer already has:

- 📱 **Mobile App** — for smartphone users
- 💬 **SMS** — for basic phones with no data connection
- ☎️ **USSD** — for areas with the weakest network coverage
- 🗣️ **Voice / IVR** — spoken queries and responses in the farmer's own language, no literacy required

A farmer can simply ask, in plain language, *"Is a dry spell coming this week?"* and receive a direct answer back through the channel of their choice.

**Why this matters:** a prediction model is only as useful as the number of people who can act on it. The core pipeline proved the science, ranking top 5 of 130+ participants in the IndabaX Sudan Climate Challenge, but only data scientists could use it directly. This access layer closes that last-mile gap, extending the same underlying prediction to farmers with no smartphone, no internet, and no technical background.
***
## 🛠 Built With
- **Python 3.10+**: Core programming language
- **XGBoost**: For gradient boosting classification with custom weighting
- **Scikit-Learn**: For data preprocessing and metric evaluation
- **Weights & Biases**: For experiment tracking and artifact management
***
## 🚀 Getting Started
### Installation & Setup
1. Clone the repository
```bash
git clone git@github.com:0Elfaki/Zatii-climate-monitor.git
cd Zatii-climate-monitor
```
2. Install dependencies
```bash
pip install -r requirements.txt
```
3. Run prediction (Upload & Test)
Place your weather data CSV in the `data/` folder and run:
```bash
python predict.py --input data/my_weather.csv --output results.csv
```
***
## 🧪 Usage
### The Physics Approach
Instead of "black box" statistics, features are engineered based on physical laws:
- **Interaction (Thirsty Air)**: `VPD × Soil_Moisture` — Identifies guaranteed dry conditions
- **SPI Proxy**: Calculates the percentile rank of soil moisture to remove seasonal bias
- **Simple Lags**: `Previous_Day_Temp` — Because weather is a sequence, not a random event
### Key Functions
- `predict.py` — Execute predictions on custom weather datasets
- `train.py` — Retrain the model with new data
- `evaluate.py` — Generate F1 scores and performance metrics
- `preprocess.py` — Apply physics-informed feature engineering
***
## 💡 Example Use Case
An agricultural researcher in Algadarif has a dataset of local soil moisture readings but lacks a prediction model. They clone this repo, upload their `.csv` file, and the pipeline automatically applies the physics-informed transformation to warn them of incoming dry spells for the next 7 days.

A farmer with no internet access and a basic phone can dial a USSD code or send an SMS asking about the week ahead, and receive the same underlying prediction translated into a plain-language answer.
***
## 📜 License
This project is open-source and available for community use.
***
## 🙋‍♂️ Author
**Almegdad Elfaki**  
Software Engineer | AI & Climate Tech  
GitHub: [@0Elfaki](https://github.com/0Elfaki)
