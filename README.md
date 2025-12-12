# DropTrack.AI

An **AI-based Student Dropout Prediction and Counseling System** designed to prevent student dropouts and promote education through early intervention and support.

## 🎯 Project Overview

DropTrack.AI is an innovative platform that leverages artificial intelligence to identify students at risk of dropping out and provides timely intervention through a comprehensive counseling system. The project aims to:

- Predict potential dropout cases before they occur
- Provide targeted counseling and support
- Connect students with mentors
- Enable multi-stakeholder collaboration
- Track and improve educational outcomes

## 🚀 Key Features

- **AI-Powered Prediction**: Advanced machine learning models to identify at-risk students
- **Multi-Role System**:
  - **Admin**: System management and oversight
  - **State Authority**: Policy implementation and monitoring
  - **School**: Student management and performance tracking
  - **Student**: Access to resources and counseling
  - **Mentor/Counsellor**: Providing guidance and support
- **Real-time Analytics**: Track student progress and intervention effectiveness
- **Counseling Management**: Schedule and manage counseling sessions
- **Performance Monitoring**: Track academic and behavioral indicators

## 📸 Project Demo
- **Project Video**: [![Watch Video](https://img.youtube.com/vi/WfC9eiZ2A10/0.jpg)](https://youtu.be/WfC9eiZ2A10?si=hdq-AC6gmWAEWRwh)
- **YouTube Demo**: [https://youtu.be/WfC9eiZ2A10?si=hdq-AC6gmWAEWRwh](https://youtu.be/WfC9eiZ2A10?si=hdq-AC6gmWAEWRwh)

## 🛠️ Tech Stack
### Frontend
- React.js
- Tailwind CSS
- Redux for state management
- Axios for API integration

### Backend
- **Express Server**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

- **DRF Server (ML Backend)**
  - Django Rest Framework
  - Python
  - Scikit-learn
  - Pandas
  - MongoDB
  - Gemini API

### Database
- MongoDB Atlas

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB
- Git

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Aakash-Jha3903/AI-based_Student_drop-out_prediction_and_Counseling_system.git
   cd AI-based_Student_drop-out_prediction_and_Counseling_system
   ```

2. **Frontend Setup**
   ```
   Add .env: PORT=3001
   ```
   Terminal : 
   ```bash

   cd Client
   npm install
   npm start
   ```   
   The frontend will be available at http://localhost:3001

3. **Express Backend Setup**
   ```bash
   # .env: 

   ACCESS_TOKEN_SECRET=
   MONGO_URI=
   Email=
   Mail_Password=
   ```
   Terminal : 
   ```bash
   cd Servers/Express_Server
   npm install
   npm start
   ```
   The Express server will run on http://localhost:3000

4. **DRF Backend Setup**
   ```bash
   cd Servers/DRF_Server
   
   # Create and activate virtual environment
   python -m venv sih25_vir
   source sih25_vir/Scripts/activate  # On Windows
   # OR
   source sih25_vir/bin/activate      # On Linux/Mac
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run migrations
   py manage.py makemigrations 
   python manage.py migrate
   
   # Start server
   python manage.py runserver
   ```
   The Django server will run on http://127.0.0.1:8000

## 👥 Team MahaDev.py

### Contributors
1. Aakash Jha
2. Himanshi Rana
3. Akanshu Mittal
4. Isha Gupta
5. Ishmeet Singh Sodhi
6. Abhay Kushwaha
---

Made with ❤️ by Team MahaDev.py