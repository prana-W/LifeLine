# Problem Statement

**Problem**: During medical emergencies, people lose crucial time searching for specific blood types or medicines. Existing systems are scattered. The hospitals, pharmacies, and donors rarely stay updated.

   **Challenge/Task**: Build a real-time platform that connects hospitals, pharmacies, and verified donors to share live availability of medical resources.

   **Add-ons**:
   - Location-based search and SOS alerts
   - AI-powered prediction of shortages or demand spikes

# Lifeline - Comprehensive Blood Donation & Emergency Management System

This is the repository for LifeLine, developed by Team Hawkins Horizon, in a 24-hour hackathon conducted by Pravardhan-26. LifeLine is a full-stack web application that revolutionizes blood donation management and emergency response with real-time tracking, automated alerts, and integrated hospital coordination.

![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)

## How to run?

`docker compose -f docker-compose.prod.yml up`

## 🌟 Features

### 🔴 Blood Donation System
- **Complete Donation Management**: Register as a blood donor and manage donation history
- **Blood Inventory Tracking**: Real-time monitoring of available blood units by type
- **Recipient Matching**: Connect blood receivers with compatible donors
- **Donation Analytics**: Track total donations, frequency, and trends

### 🚨 Emergency Alert System
- **Auto-Recording**: Automatic video and audio capture when emergency is triggered
- **Live Location Tracking**: Real-time GPS coordinates using Geolocation API
- **Hospital Notifications**: Instant alerts sent to nearby hospitals with emergency details
- **Emergency Dashboard**: Monitor all active emergencies with location mapping

### 🏥 Hospital Management
- **Hospital Dashboard**: Dedicated interface for incoming emergency alerts
- **Real-time Notifications**: Instant updates on emergencies in their vicinity
- **Patient Information**: Access emergency details including location and medical data
- **Response Coordination**: Track and manage emergency responses

### 🚑 Ambulance Services
- **Ambulance Dispatch**: Request and track ambulance services
- **Route Optimization**: Integration with OpenStreet Map API for optimal routing
- **Live Tracking**: Real-time ambulance location updates

### 💊 Pharmacy Management
- **Medicine Inventory**: Add, update, and manage pharmaceutical inventory
- **Pharmacy Dashboard**: Dedicated interface for medicine management
- **Stock Monitoring**: Track medicine availability and expiration dates

### 📊 Analytics & Insights
- **Comprehensive Metrics**:
    - Total blood donations
    - Emergency alerts raised
    - Blood inventory status
    - Hospital response times
    - Pharmacy stock levels
- **Visual Reports**: Data visualization for better decision-making
- **Trend Analysis**: Historical data tracking and forecasting

### 🔐 Security & Authentication
- **JWT-based Authentication**: Secure token-based user authentication
- **Protected Routes**: Role-based access control for different user types
- **Secure API Endpoints**: All backend routes protected with middleware
- **Password Encryption**: Industry-standard password hashing

## 🏗️ Architecture

### Frontend
- **React 18+**: Modern React with hooks and context API
- **Tailwind CSS**: Utility-first styling for responsive design
- **shadcn/ui**: High-quality, accessible component library
- **Real-time Updates**: Live data fetching with no mock data

### Backend
- **Node.js + Express**: RESTful API architecture
- **MongoDB**: NoSQL database for flexible data modeling
- **Mongoose ODM**: Schema-based data modeling

### APIs & Services
- **Geolocation API**: Real-time location tracking
- **MediaRecorder API**: Audio/video recording capabilities
- **OpenStreet Map API**: Location mapping and routing

## 📦 Database Schema

The system uses **MongoDB** with the following collections:

| Collection | Description |
|------------|-------------|
| `users` | User accounts (donors, receivers, admins) |
| `bloodDonations` | Blood donation records and history |
| `bloodReceivers` | Recipients requesting blood |
| `emergencies` | Emergency alerts with location and media |
| `hospitals` | Hospital information and dashboard data |
| `pharmacies` | Pharmacy details and inventory |
| `medicines` | Medicine catalog and stock levels |
| `analytics` | System-wide metrics and statistics |
| `visitors` | Visitor tracking and public access logs |

## 🛡️ Security Features

- **JWT Token Authentication**: Secure, stateless authentication
- **Password Hashing**: bcrypt for password encryption
- **Protected Routes**: Middleware-based route protection
- **Role-based Access Control**: Different permissions for users, hospitals, pharmacies, and admins
- **Input Validation**: Request validation and sanitization
- **CORS Configuration**: Controlled cross-origin requests

## 🎯 User Roles

1. **Donor**: Register, donate blood, view history
2. **Receiver**: Request blood, view matches
3. **Hospital**: Receive emergency alerts, manage responses
4. **Pharmacy**: Manage medicine inventory
5. **Admin**: Full system access, analytics, user management
6. **Visitor**: Limited public access

## 🌐 Key Technologies

| Technology | Purpose |
|------------|---------|
| React | Frontend framework |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Node.js | Backend runtime |
| Express | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Geolocation API | Location tracking |
| MediaRecorder API | Audio/video recording |
| OpenStreet Map | Mapping & routing |


## 👥 Team

**Team Hawkins Horizon**

| Team Member | Role                      | Responsibilities                                                      |
|------|---------------------------|-----------------------------------------------------------------------|
| **Pranaw Kumar** | Backend Developer         | API development, database design, authentication & security           |
| **Sisanta Chhatoi** | AI/ML Developer           | AI Chatbot development, devops and deployment                         |
| **Ashutosh Kumar Rawat** | Frontend Developer        | React components, UI implementation, API integration                  |
| **Ruchika Ruhanshi** | UI/UX Designer & Designer | Design systems, user experience, project coordination & brainstorming |

## 📞 Support

For support, email pranaw.kr.dev@gmail.com or open an issue in the GitHub repository.

---

**Built with ❤️ to save lives**