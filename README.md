# HSR Lead Manager

A modern lead management web application built for **HSR Motors** as part of the **DeltaX Product Specialist Assignment**.  
This project demonstrates end-to-end product thinking, UI/UX design, workflow planning, and front-end implementation of a lead management system.

---

## 🚗 Overview

HSR Motors receives leads from digital channels like Facebook, Google Ads, their website, and offline events.  
Managing these leads through spreadsheets created issues such as:

- No real-time collaboration  
- Difficult follow-up tracking  
- No dashboard or analytics  
- No proper workflow structure  

**HSR Lead Manager** solves this by offering a structured, user-friendly lead management tool for:

- **Sales Team** → Add, view, update leads  
- **Managers** → Monitor dashboards, pipeline, and performance  

This system includes screens for **Dashboard**, **Lead Listing**, **Lead Details**, and **Lead Management (Kanban Board)**.

---

## 🧩 Features

### ✔ 1. Dashboard
- Clean UI for managers  
- Intended to show key KPIs (Total Leads, Contacted Leads, Converted Leads)  
- Uses Chart.js for visual graphs (leads by source, status, monthly trends)

### ✔ 2. Lead Listing (Main Screen)
- Complete searchable & filterable lead table  
- Columns: Name, Contact, Source, Last Contact, Next Follow-up, Status  
- Status filters: All, New, Contacted, Follow-Up, Converted  
- Pagination + Rows-per-page selector  
- “Add Lead” modal for entering a new lead  
- “View” button opens full details modal  

### ✔ 3. Lead Details (Modal Screen)
- Shows the full profile of a lead  
- Name, source, email, phone  
- Last contact + next follow-up  
- Status badge  
- Buttons: Call, WhatsApp, Email  
- Notes & history timeline  
- Add note option for sales follow-ups  

### ✔ 4. Lead Management (Kanban Board)
- Visual pipeline of leads across stages:
  - New  
  - Contacted  
  - Follow-up  
  - Converted  
- Each column shows lead cards  
- Great for tracking sales progress  
- Toggle between **Board View** and **Table View**  

### ✔ 5. Add Lead Modal
- Form to add a new lead  
- Supports multiple sources (Website, Google, Facebook, Referral)  
- Required field validation  

### ✔ 6. Notifications System
- Notification dropdown  
- Shows unread and recent updates (follow-up reminders, new lead alerts)

---

## 📁 Project Structure

/css
style.css
/js
app.js
leads-data.js
kanban.js
leads-management.js
dashboard.js
dashboard-utils.js
notifications.js
reports.js
settings.js

