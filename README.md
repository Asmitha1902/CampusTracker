# 🎓 Campus Track - Intelligent Lost & Found System

Campus Track is an intelligent web-based platform that helps students report, track, and recover lost or found items within a campus. The system also includes an **Admin Dashboard** for monitoring, moderation, and analytics.

---

##  Key Features

###  User Features

*  Authentication (Student / Admin roles with JWT)
*  Post Lost Items
*  Post Found Items
*  Smart Search & Filtering
*  Auto Matching System (based on keywords & location)
*  Chat / Contact System
*  View Item Status (Lost / Found / Claimed)

---

###  Admin Features (Dashboard)

*  View all lost & found posts
*  Approve / Reject items
*  Delete inappropriate content
*  Manage flagged posts
*  Analytics & Reporting Dashboard

  * Total items reported
  * Matched items
  * Recovered items
  * Active users

---

##  Tech Stack

### Frontend:

* React.js
* Bootstrap

### Backend:

* Java Spring Boot
* REST APIs

### Database:

* MySQL
----

##  How to Run the Project

### Clone Repository

```bash
git clone https://github.com/Asmitha1902/Campus_Track_lost_and_found.git
cd Campus_Track_lost_and_found
```

---

##  Database Setup (MySQL)

1. Create database:

```sql
CREATE DATABASE campus_track;
```

2. Import SQL file from `/database` folder

3. Update DB config in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campus_track
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

---

##  Run Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

👉 Runs on:
http://localhost:5173

---

##  Run Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

👉 Runs on:
http://localhost:9090

---

##  System Workflow

1. User logs in / registers
2. Posts lost or found item
3. System stores data in MySQL
4. Matching algorithm suggests possible matches
5. Users communicate via chat
6. Admin monitors and manages platform
7. Reports generated in admin dashboard

---

##  Intelligent Features

*  Keyword-based matching
*  Location-based suggestions
*  Category & tag filtering
*  Admin analytics dashboard

---

##  Modules Implemented

1. Authentication & Role Management
2. Lost/Found Item Posting
3. Auto Matching System
4. Chat / Contact Module
5. Admin Dashboard & Reporting

---


##  Author

* Asmitha

---

##  License

This project is developed for academic purposes and is open for learning.
