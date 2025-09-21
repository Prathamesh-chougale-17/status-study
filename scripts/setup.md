# Setup Instructions

## 1. Environment Setup

Create a `.env.local` file in the root directory with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/study-dashboard?retryWrites=true&w=majority
NODE_ENV=development
```

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Initialize Database (Optional)

This will populate your database with default study topics and sample resources:

```bash
pnpm run init-db
```

## 4. Start Development Server

```bash
pnpm dev
```

## 5. Open Your Browser

Navigate to `http://localhost:3000` to see your study dashboard.

## Features Now Available

✅ **Dynamic Data Loading**: The frontend now fetches data from MongoDB
✅ **Error Handling**: Graceful fallbacks when API calls fail
✅ **Refresh Functionality**: Refresh buttons to reload data
✅ **Create New Topics**: Add new study topics dynamically
✅ **Real-time Updates**: Changes are reflected immediately
✅ **Loading States**: Proper loading indicators
✅ **Error Messages**: User-friendly error notifications

## Testing the Dynamic Features

1. **Test Data Loading**: The dashboard should load topics from MongoDB
2. **Test Error Handling**: Disconnect from internet to see fallback behavior
3. **Test Refresh**: Use the refresh button to reload data
4. **Test New Topics**: Click "New Topic" buttons to create topics
5. **Test Resource Management**: Navigate to topic pages and add resources

## Troubleshooting

- **No data showing**: Run `pnpm run init-db` to populate the database
- **API errors**: Check your MongoDB connection string in `.env.local`
- **Build errors**: Make sure all dependencies are installed with `pnpm install`
