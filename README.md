# 🧠 Memory Usage Profiler & Leak Detector

A modern frontend-based system monitoring dashboard that visualizes process memory usage, detects abnormal patterns (possible memory leaks), and provides real-time alerts with a clean and professional UI.

---

## 🚀 Live Demo

✨ Experience the application here:  
👉 **[https://mem-profiler-os.vercel.app/](https://mem-profiler-os.vercel.app/)**

---

## 📌 Features

- 📊 Real-time memory usage visualization  
- 🔍 Process monitoring (PID, RSS, Virtual Memory)  
- ⚠️ Memory leak detection using trend analysis  
- 🔔 Alert system (Normal / Warning / Critical)  
- 🧠 Intelligent alerts with reasons and suggested fixes  
- 📈 Interactive charts and analytics  
- 🌙 Dark mode UI with modern design  
- 🔄 Live updates using simulated real-time data  

---

## 🧠 Leak Detection Logic

The application detects abnormal memory behavior using:

- Continuous memory growth tracking  
- Moving average analysis  
- Threshold-based detection  
- Time-window trend analysis  

Processes are classified as:

- 🟢 Normal  
- 🟡 Suspicious  
- 🔴 Critical  

Each alert also provides:
- 📌 Possible cause of the issue  
- 🛠 Suggested solution  

---

## 🖥️ Pages

- **Home** → Overview and navigation  
- **Dashboard** → Real-time process monitoring  
- **Analytics** → Memory trends visualization  
- **Alerts** → Leak detection notifications with explanations  
- **About** → OS concepts and explanation  

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite)  
- **Styling**: Tailwind CSS / ShadCN UI  
- **Charts**: Recharts / Chart.js  
- **State Management**: React Hooks  
- **Deployment**: Vercel  

---

## ⚡ How to Run Locally

```bash
# Clone the repo
git clone https://github.com/your-username/memory-guardian.git

# Navigate into folder
cd memory-guardian

# Install dependencies
npm install

# Run project
npm run dev
