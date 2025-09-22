# Authentication Setup Guide

Your Study Dashboard now has complete authentication protection using [Better Auth](https://www.better-auth.com/docs/integrations/next). Only you (as the admin) can access and modify the application.

## 🔐 What's Protected

**All API Routes:**
- `/api/kanban/*` - Task management
- `/api/topics/*` - Topic management  
- `/api/resources/*` - Resource management
- `/api/tasks/*` - Task operations
- `/api/subtopics/*` - Subtopic operations
- `/api/progress/*` - Progress tracking

**All Pages:**
- Dashboard (`/`)
- Kanban Board (`/kanban`)
- Calendar (`/calendar`) 
- Topic pages (`/topic/*`)

## 🚀 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root with:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production-make-it-long-and-random-at-least-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Admin credentials (only you can access)
ADMIN_EMAIL=your-email@domain.com
ADMIN_PASSWORD=your-secure-password
```

**Important:** 
- Use a strong, unique password
- Keep your credentials secure
- The `BETTER_AUTH_SECRET` should be at least 32 characters long

### 2. Create Your Admin Account

Run the setup script to create your admin user:

```bash
npm run dev
# In another terminal:
npx tsx scripts/create-admin.ts
```

Or create the user manually by visiting `/sign-in` and trying to sign in - the system will create your admin account automatically if it doesn't exist.

### 3. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` - you'll be redirected to the sign-in page.

## 🔑 How It Works

1. **Middleware Protection**: All routes except `/sign-in` and `/api/auth/*` require authentication
2. **API Route Protection**: Every API endpoint validates your admin session
3. **Role-Based Access**: Only users with `admin` role can access the system
4. **Email Restriction**: Only your specified admin email can register/sign in
5. **Secure Sessions**: Uses Better Auth's secure session management

## 🎯 Features

- **Secure Authentication**: Industry-standard security with Better Auth
- **Single Admin Access**: Only your email can access the system
- **Session Management**: Automatic session handling and refresh
- **Protected Routes**: All pages and APIs are protected
- **Clean UI**: Integrated sign-in/sign-out controls
- **Middleware Protection**: Fast route protection without database calls

## 🛠️ Customization

### Change Admin Email
Update `ADMIN_EMAIL` in `.env.local` and restart the application.

### Add More Users (Optional)
Edit `lib/auth.ts` and modify the `callbacks.user.create.before` and `callbacks.user.signIn.before` functions to allow additional emails.

### Customize Session Duration
Edit `lib/auth.ts` and modify the `session.expiresIn` value (default: 7 days).

## 🔧 Troubleshooting

### "Authentication required" error
- Check that your `.env.local` file exists and has the correct variables
- Ensure you're signed in by visiting `/sign-in`
- Clear browser cookies and sign in again

### Can't create admin user
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `.env.local`
- Check MongoDB connection is working
- Try deleting the user from MongoDB and creating again

### Middleware redirect loop
- Check that `/sign-in` page is accessible
- Verify middleware.ts configuration
- Clear browser cache and cookies

## 📚 Better Auth Documentation

For advanced configuration, refer to the [Better Auth documentation](https://www.better-auth.com/docs/integrations/next).

---

**Your Study Dashboard is now fully secured! 🎉**

Only you can create, edit, and delete cards and manage your study progress.
