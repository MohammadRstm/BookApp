# 📚 Book Review App

A full-stack web application for browsing, reviewing, and managing books.  
Users can explore books without signing in, but certain actions like adding, editing, or reviewing books require authentication.  

---

## 🚀 Features

- **Browse Books (No Account Needed)**  
  - Paginated home page showing available books with key details.  
  - Click on a book to view its full details.  
  - Sort books by year or rating
  - Search for books

- **User Authentication**  
  - Create an account and log in to unlock more features.  
  - Authentication handled via JWT tokens.  

- **Reviews & Ratings**  
  - Only signed-in users can leave reviews and ratings.  
  - Users **cannot** review or rate their own books.  

- **Add New Books**  
  - Signed-in users can contribute new books to the collection.  

- **Edit Books**  
  - You may edit details of books you’ve added.  
  - No user can edit books added by others. 

- **Dark Mode Toggle**
  - Switch between dark mode and ligh mode seemlessly

---

## 🛠️ Tech Stack

- **Frontend:** React (with Axios for API calls)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JSON Web Tokens (JWT)  

---

## 📂 Project Structure

/view #React Frontend
/backend #Nodjs + Express backend

---

## ▶️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/MohammadRstm/BookApp
cd BookApp

### 2. Install dependecies
- Frontend
cd view
npm install

-Backend
cd backend
npm install

### 3. Setup envrionment variables 
Copy .env.example into your .env files
Both frontend and backend have their own .env.example so both have their own .env file

### 4. Run the app
cd backend 
npm run dev
cd frontend 
npm run dev

