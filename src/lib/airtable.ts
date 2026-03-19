import Airtable from 'airtable'

function getBase() {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  )
}

// Helper to map Airtable record to plain object
function mapRecord<T>(record: Airtable.Record<Airtable.FieldSet>): T {
  return { id: record.id, ...record.fields } as T
}

// Users
export async function getUserByEmail(email: string) {
  const records = await getBase()('Users')
    .select({ filterByFormula: `{email} = '${email}'`, maxRecords: 1 })
    .firstPage()
  if (!records.length) return null
  return mapRecord<any>(records[0])
}

export async function getUserById(id: string) {
  try {
    const record = await getBase()('Users').find(id)
    return mapRecord<any>(record)
  } catch {
    return null
  }
}

export async function createUser(data: {
  name: string
  email: string
  passwordHash: string
  role?: string
  niche?: string
  businessStage?: string
}) {
  const record = await getBase()('Users').create({
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    role: data.role || 'member',
    niche: data.niche || '',
    businessStage: data.businessStage || '',
    createdAt: new Date().toISOString(),
  })
  return mapRecord<any>(record)
}

export async function updateUser(id: string, fields: Record<string, any>) {
  const record = await getBase()('Users').update(id, fields)
  return mapRecord<any>(record)
}

export async function getAllUsers() {
  const records = await getBase()('Users')
    .select({ sort: [{ field: 'createdAt', direction: 'desc' }] })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

// Membership Plans
export async function getMembershipPlans() {
  const records = await getBase()('MembershipPlans')
    .select({
      filterByFormula: '{isActive} = TRUE()',
      sort: [{ field: 'price', direction: 'asc' }],
    })
    .all()
  return records.map((r) => {
    const rec = mapRecord<any>(r)
    rec.features = rec.features
      ? rec.features.split(',').map((f: string) => f.trim())
      : []
    return rec
  })
}

export async function getMembershipPlanById(id: string) {
  const record = await getBase()('MembershipPlans').find(id)
  const rec = mapRecord<any>(record)
  rec.features = rec.features
    ? rec.features.split(',').map((f: string) => f.trim())
    : []
  return rec
}

// Subscriptions
export async function getUserSubscription(userId: string) {
  const records = await getBase()('Subscriptions')
    .select({
      filterByFormula: `AND({userId} = '${userId}', {status} = 'active')`,
      maxRecords: 1,
    })
    .firstPage()
  if (!records.length) return null
  return mapRecord<any>(records[0])
}

export async function createSubscription(data: Record<string, any>) {
  const record = await getBase()('Subscriptions').create(data)
  return mapRecord<any>(record)
}

export async function updateSubscription(id: string, fields: Record<string, any>) {
  const record = await getBase()('Subscriptions').update(id, fields)
  return mapRecord<any>(record)
}

export async function getAllSubscriptions() {
  const records = await getBase()('Subscriptions')
    .select({ sort: [{ field: 'currentPeriodEnd', direction: 'desc' }] })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

// Purchases
export async function getUserPurchases(userId: string) {
  const records = await getBase()('Purchases')
    .select({
      filterByFormula: `{userId} = '${userId}'`,
      sort: [{ field: 'createdAt', direction: 'desc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function createPurchase(data: Record<string, any>) {
  const record = await getBase()('Purchases').create({
    ...data,
    createdAt: new Date().toISOString(),
  })
  return mapRecord<any>(record)
}

export async function getAllPurchases() {
  const records = await getBase()('Purchases')
    .select({ sort: [{ field: 'createdAt', direction: 'desc' }] })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

// Courses
export async function getPublishedCourses() {
  const records = await getBase()('Courses')
    .select({
      filterByFormula: '{isPublished} = TRUE()',
      sort: [{ field: 'order', direction: 'asc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function getAllCourses() {
  const records = await getBase()('Courses')
    .select({ sort: [{ field: 'order', direction: 'asc' }] })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function getCourseById(id: string) {
  const record = await getBase()('Courses').find(id)
  return mapRecord<any>(record)
}

export async function createCourse(data: Record<string, any>) {
  const record = await getBase()('Courses').create(data)
  return mapRecord<any>(record)
}

export async function updateCourse(id: string, fields: Record<string, any>) {
  const record = await getBase()('Courses').update(id, fields)
  return mapRecord<any>(record)
}

// Modules
export async function getModulesByCourse(courseId: string) {
  const records = await getBase()('Modules')
    .select({
      filterByFormula: `{courseId} = '${courseId}'`,
      sort: [{ field: 'order', direction: 'asc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function createModule(data: Record<string, any>) {
  const record = await getBase()('Modules').create(data)
  return mapRecord<any>(record)
}

export async function updateModule(id: string, fields: Record<string, any>) {
  const record = await getBase()('Modules').update(id, fields)
  return mapRecord<any>(record)
}

// Lessons
export async function getLessonsByModule(moduleId: string) {
  const records = await getBase()('Lessons')
    .select({
      filterByFormula: `{moduleId} = '${moduleId}'`,
      sort: [{ field: 'order', direction: 'asc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function getLessonsByCourse(courseId: string) {
  const records = await getBase()('Lessons')
    .select({
      filterByFormula: `{courseId} = '${courseId}'`,
      sort: [{ field: 'order', direction: 'asc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function getLessonById(id: string) {
  const record = await getBase()('Lessons').find(id)
  return mapRecord<any>(record)
}

export async function createLesson(data: Record<string, any>) {
  const record = await getBase()('Lessons').create(data)
  return mapRecord<any>(record)
}

export async function updateLesson(id: string, fields: Record<string, any>) {
  const record = await getBase()('Lessons').update(id, fields)
  return mapRecord<any>(record)
}

// User Progress
export async function getUserProgress(userId: string) {
  const records = await getBase()('UserProgress')
    .select({ filterByFormula: `{userId} = '${userId}'` })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function markLessonComplete(userId: string, lessonId: string) {
  // Check if already exists
  const existing = await getBase()('UserProgress')
    .select({
      filterByFormula: `AND({userId} = '${userId}', {lessonId} = '${lessonId}')`,
      maxRecords: 1,
    })
    .firstPage()
  if (existing.length) return mapRecord<any>(existing[0])
  const record = await getBase()('UserProgress').create({
    userId,
    lessonId,
    completedAt: new Date().toISOString(),
  })
  return mapRecord<any>(record)
}

// Classes
export async function getPublishedClasses() {
  const records = await getBase()('Classes')
    .select({
      filterByFormula: '{isPublished} = TRUE()',
      sort: [{ field: 'dateTime', direction: 'asc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function getAllClasses() {
  const records = await getBase()('Classes')
    .select({ sort: [{ field: 'dateTime', direction: 'asc' }] })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function createClass(data: Record<string, any>) {
  const record = await getBase()('Classes').create(data)
  return mapRecord<any>(record)
}

export async function updateClass(id: string, fields: Record<string, any>) {
  const record = await getBase()('Classes').update(id, fields)
  return mapRecord<any>(record)
}

export async function deleteClass(id: string) {
  await getBase()('Classes').destroy(id)
}

// Community Posts
export async function getCommunityPostById(id: string) {
  const record = await getBase()('CommunityPosts').find(id)
  return mapRecord<any>(record)
}

export async function getCommunityPosts(category?: string) {
  const formula =
    category && category !== 'all' ? `{category} = '${category}'` : ''
  const records = await getBase()('CommunityPosts')
    .select({
      filterByFormula: formula || undefined,
      sort: [{ field: 'createdAt', direction: 'desc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function createCommunityPost(data: Record<string, any>) {
  const record = await getBase()('CommunityPosts').create({
    ...data,
    createdAt: new Date().toISOString(),
    likesCount: 0,
  })
  return mapRecord<any>(record)
}

export async function updateCommunityPost(id: string, fields: Record<string, any>) {
  const record = await getBase()('CommunityPosts').update(id, fields)
  return mapRecord<any>(record)
}

export async function deleteCommunityPost(id: string) {
  await getBase()('CommunityPosts').destroy(id)
}

// Comments
export async function getCommentsByPost(postId: string) {
  const records = await getBase()('Comments')
    .select({
      filterByFormula: `{postId} = '${postId}'`,
      sort: [{ field: 'createdAt', direction: 'asc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function createComment(data: Record<string, any>) {
  const record = await getBase()('Comments').create({
    ...data,
    createdAt: new Date().toISOString(),
  })
  return mapRecord<any>(record)
}

// Messages
export async function getUserMessages(userId: string) {
  const records = await getBase()('Messages')
    .select({
      filterByFormula: `OR({fromUserId} = '${userId}', {toUserId} = '${userId}')`,
      sort: [{ field: 'createdAt', direction: 'desc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function createMessage(data: Record<string, any>) {
  const record = await getBase()('Messages').create({
    ...data,
    createdAt: new Date().toISOString(),
    isRead: false,
  })
  return mapRecord<any>(record)
}

export async function markMessageRead(id: string) {
  const record = await getBase()('Messages').update(id, { isRead: true })
  return mapRecord<any>(record)
}

// Resources
export async function getResources(category?: string) {
  const formula =
    category && category !== 'all' ? `{category} = '${category}'` : ''
  const records = await getBase()('Resources')
    .select({
      filterByFormula: formula || undefined,
      sort: [{ field: 'createdAt', direction: 'desc' }],
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function createResource(data: Record<string, any>) {
  const record = await getBase()('Resources').create({
    ...data,
    createdAt: new Date().toISOString(),
  })
  return mapRecord<any>(record)
}

// Notifications
export async function getUserNotifications(userId: string) {
  const records = await getBase()('Notifications')
    .select({
      filterByFormula: `{userId} = '${userId}'`,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      maxRecords: 20,
    })
    .all()
  return records.map((r) => mapRecord<any>(r))
}

export async function createNotification(data: Record<string, any>) {
  const record = await getBase()('Notifications').create({
    ...data,
    createdAt: new Date().toISOString(),
    isRead: false,
  })
  return mapRecord<any>(record)
}

export async function markNotificationRead(id: string) {
  const record = await getBase()('Notifications').update(id, { isRead: true })
  return mapRecord<any>(record)
}
