## HUEY - Have U Eaten Yet?

> This is a project for Next.js Hackathon 2025

HUEY is a modern web application that simplifies restaurant waitlist management. It allows diners to join waitlists remotely from their phones and helps restaurants manage their waiting customers efficiently.

### ✨ Features
- for diners: browse restaurants with real-time waitlist information and join waitlists remotely from your phone.
- for restaurant owners: manage waitlist entries and get real-time updates.

### 🙌🏻 Testing
To view the admin page, use the credentials below: <br>
- Email = `wokandwave@gmail.com`
- Password = `123456`

### 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **UI Components**: [shadcn/ui]((https://ui.shadcn.com/))
- **Animations**: Framer Motion
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [Prisma Postgres](https://www.prisma.io/)
- **Styling**: Tailwind CSS with custom configurations

### 👩🏻‍💻 Getting Started
To run this project locally:

#### Installation

1. Clone the repository
    ```bash
    git clone https://github.com/annaw-99/huey.git
    cd huey
    ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
    Create a `.env` file in the root directory with the following variables:
    ```env
    DATABASE_URL="your-database-url"
    NEXTAUTH_SECRET="your-secret"
    ```

4. Run database migrations
    ```bash
    npx prisma migrate dev
    ```

5. Start the development server
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. Open your browser and navigate to `http://localhost:3000`

### Features for Future Development

- SMS notifications for customers through [twilio](https://www.twilio.com/en-us)
- Restaurant profile editing functionalities
- Restaurant analytics dashboard (e.g. average wait time, etc)

### ☎️ Contact
Feel free to reach out if you have any questions or suggestions!

### License

This project is licensed under the MIT License - see the LICENSE file for details.
