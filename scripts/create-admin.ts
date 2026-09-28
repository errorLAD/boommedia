import bcrypt from 'bcryptjs'
import connectDB from '../lib/db/mongoose'
import User from '../lib/db/models/User'

async function main() {
  const args = process.argv.slice(2)
  const argEmail = args[0]
  const argPassword = args[1]

  const email = (argEmail || process.env.ADMIN_EMAIL || 'admin@boommedia.in').trim().toLowerCase()
  const rawPassword = (argPassword || process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH || 'Password@123').trim()

  if (!email) {
    throw new Error('Please specify an admin email in ADMIN_EMAIL or as a CLI argument.')
  }

  // If already a bcrypt hash, use it; otherwise automatically hash the plain-text password
  const isAlreadyBcryptHash =
    rawPassword.startsWith('$2a$') ||
    rawPassword.startsWith('$2b$') ||
    rawPassword.startsWith('$2y$')

  const passwordHash = isAlreadyBcryptHash
    ? rawPassword
    : await bcrypt.hash(rawPassword, 10)

  await connectDB()

  await User.findOneAndUpdate(
    { email },
    {
      name: 'Administrator',
      email,
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      isActive: true,
      emailVerified: true,
      loginAttempts: 0,
      lockUntil: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  console.log('\n======================================================')
  console.log('✅ Admin Account Successfully Configured!')
  console.log('======================================================')
  console.log(`Email / Username : ${email}`)
  if (!isAlreadyBcryptHash) {
    console.log(`Password         : ${rawPassword}`)
  }
  console.log(`Role             : ADMIN`)
  console.log(`Login URL        : http://localhost:3000/admin/login`)
  console.log(`Dashboard URL    : http://localhost:3000/admin/dashboard`)
  console.log('======================================================\n')
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to create admin:', error)
  process.exit(1)
})
