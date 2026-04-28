# 🧠 Memory Usage Profiler & Leak Detector

A modern frontend-based system monitoring dashboard designed to visualize process memory usage, identify abnormal memory behavior, and detect possible memory leaks in real time.

This project helps users monitor system processes through an interactive and professional UI, providing intelligent alerts, analytics, and leak detection insights for better system performance management.

---

# 🚀 Live Demo

✨ Explore the live application here:  
👉 https://mem-profiler-os.vercel.app/

---

# 📌 Key Features

## 📊 Real-Time Memory Monitoring
Track live memory usage of running processes with clear and interactive visualizations.

## 🔍 Process Analysis
Monitor important process details such as:

- Process ID (PID)
- RSS (Resident Set Size)
- Virtual Memory Usage
- Memory Growth Trends

## ⚠️ Memory Leak Detection
Detect suspicious memory behavior using trend-based analysis and threshold monitoring.

## 🔔 Smart Alert System
Processes are automatically classified into:

- 🟢 Normal
- 🟡 Warning
- 🔴 Critical

Each alert includes:

- Possible reason for the issue
- Recommended solution
- Severity level

## 📈 Interactive Analytics
View memory usage trends using charts and graphical insights for better understanding.

## 🌙 Modern Dark Mode UI
Clean, responsive, and professional interface built for better user experience.

## 🔄 Live Simulated Updates
Real-time monitoring experience using simulated live process data.

---

# 🧠 Memory Leak Detection Logic

The application identifies abnormal memory behavior using:

- Continuous memory growth tracking
- Moving average analysis
- Threshold-based detection
- Time-window trend analysis

This helps in detecting:

- Gradual memory leaks
- Sudden abnormal spikes
- Long-term unstable processes

---

# 🛠️ Tech Stack

## Frontend
- React (Vite)

## Styling
- Tailwind CSS
- ShadCN UI

## Charts & Visualization
- Recharts
- Chart.js

## State Management
- React Hooks

## Deployment
- Vercel

---

# ⚡ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/memory-guardian.git

##  Navigate into folder
```bash
cd memory-guardian

## Install dependencies
```bash
npm install

##  Run project
```bash
npm run dev
