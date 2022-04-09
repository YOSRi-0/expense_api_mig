export const config = {
  secrets: {
    jwt: process.env.JWT_SECRET,
  },
  dbUrl:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_tracker_api',
}
