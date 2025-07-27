# ToDo Application

The ToDo Application is an online task tracker designed to help users align their daily tasks with their schedules. It allows users to plan their day or month effectively and keep track of their daily or weekly progress. Users can create, update, and prioritize their tasks based on importance.

⚙️ Tech Stack Used \
🔹 Frontend:
Next.js: Used to build the user interface with multiple components.

🔹 Backend:
Node.js with Express and TypeScript: Used to build the server and handle API routes securely and efficiently.

🔹 Database:
PostgreSQL: Used as the primary database for storing user and task data.

🚀 Project Setup \
Step 1: Clone the Repository \
git clone <your-repo-url>\
Step 2: Install Dependencies\
For Backend:\

cd /Server\
npm install\
For Frontend:\

cd /Client\
npm install\
Step 3: Running the Application\
Run the Frontend (Next.js):\

npm run dev\
Runs on http://localhost:3000\

Run the Backend (Express server):\

npm start\
Runs on http://localhost:8000\

🗂️ Database Configuration\
Create a .env file inside the /Server folder with the following fields:\

env

PG_HOST=your_host_name\
PG_USER=postgres\
PG_PASSWORD=your_database_password\
PG_PORT=5432\
PG_DATABASE=your_database_name\

JWT_SECRET=your_jwt_secret_key\
🔸 After this setup, the system will automatically create the required tables in your PostgreSQL database when the backend is started.\

✅ Features\
Create, update, and delete tasks

Set task priorities

Track daily and weekly progress

Fully functional authentication system
