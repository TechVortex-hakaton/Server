import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const CATEGORIES = ['Health', 'Sport', 'Sleep', 'Nutrition', 'Prevention', 'Wellbeing'];

const DOCTORS = [
  { fullName: 'Dr. Aziz Karimov', email: 'doctor@healthy.uz', specialization: 'Cardiologist', experience: 12, phone: '+998901111111' },
  { fullName: 'Dr. Dilnoza Yusupova', email: 'dilnoza.yusupova@healthy.uz', specialization: 'Therapist', experience: 8, phone: '+998901111112' },
  { fullName: 'Dr. Bekzod Rashidov', email: 'bekzod.rashidov@healthy.uz', specialization: 'Neurologist', experience: 15, phone: '+998901111113' },
  { fullName: 'Dr. Malika Tosheva', email: 'malika.tosheva@healthy.uz', specialization: 'Pediatrician', experience: 6, phone: '+998901111114' },
  { fullName: 'Dr. Sardor Nabiyev', email: 'sardor.nabiyev@healthy.uz', specialization: 'Dentist', experience: 10, phone: '+998901111115' },
];

const PATIENTS = [
  { fullName: 'Jasur Abdullayev', email: 'jasur.abdullayev@example.com', gender: 'MALE' },
  { fullName: 'Nilufar Xamidova', email: 'nilufar.xamidova@example.com', gender: 'FEMALE' },
  { fullName: 'Otabek Yoldoshev', email: 'otabek.yoldoshev@example.com', gender: 'MALE' },
  { fullName: 'Zarina Qodirova', email: 'zarina.qodirova@example.com', gender: 'FEMALE' },
  { fullName: 'Islom Mirzayev', email: 'islom.mirzayev@example.com', gender: 'MALE' },
  { fullName: 'Gulnora Saidova', email: 'gulnora.saidova@example.com', gender: 'FEMALE' },
  { fullName: 'Anvar Toshpulatov', email: 'anvar.toshpulatov@example.com', gender: 'MALE' },
  { fullName: 'Madina Ergasheva', email: 'madina.ergasheva@example.com', gender: 'FEMALE' },
  { fullName: 'Rustam Nazarov', email: 'rustam.nazarov@example.com', gender: 'MALE' },
  { fullName: 'Feruza Aliyeva', email: 'patient@healthy.uz', gender: 'FEMALE' },
];

const SPORTS = [
  { title: 'Running', description: 'Cardio workout to build endurance', category: 'Cardio', duration: 30, difficulty: 'Beginner', calories: 300 },
  { title: 'Swimming', description: 'Full-body low-impact cardio', category: 'Cardio', duration: 45, difficulty: 'Intermediate', calories: 400 },
  { title: 'Yoga', description: 'Improve flexibility and balance', category: 'Flexibility', duration: 40, difficulty: 'Beginner', calories: 150 },
  { title: 'Cycling', description: 'Outdoor or stationary bike cardio', category: 'Cardio', duration: 60, difficulty: 'Intermediate', calories: 500 },
  { title: 'Strength Training', description: 'Build muscle with resistance exercises', category: 'Strength', duration: 45, difficulty: 'Advanced', calories: 350 },
  { title: 'Pilates', description: 'Core strength and flexibility', category: 'Flexibility', duration: 30, difficulty: 'Beginner', calories: 200 },
  { title: 'Boxing', description: 'High-intensity cardio and strength', category: 'Cardio/Strength', duration: 45, difficulty: 'Advanced', calories: 450 },
  { title: 'Hiking', description: 'Outdoor cardio on varied terrain', category: 'Outdoor', duration: 90, difficulty: 'Intermediate', calories: 500 },
];

const ARTICLES = [
  { title: 'Why Hydration Matters', category: 'Health', description: 'Understand the role water plays in everyday health.' },
  { title: 'Building a Sustainable Workout Routine', category: 'Sport', description: 'Tips for creating an exercise habit that lasts.' },
  { title: 'The Science of Sleep Cycles', category: 'Sleep', description: 'How sleep stages affect your rest and recovery.' },
  { title: 'Nutrition Basics: Macros Explained', category: 'Nutrition', description: 'A simple guide to proteins, fats, and carbs.' },
  { title: 'Preventing Common Illnesses', category: 'Prevention', description: 'General habits that support your immune system.' },
  { title: 'Managing Stress for Better Wellbeing', category: 'Wellbeing', description: 'Everyday techniques to manage stress levels.' },
  { title: 'Morning Habits for a Productive Day', category: 'Health', description: 'Start your day with intention and energy.' },
  { title: 'Strength Training for Beginners', category: 'Sport', description: 'How to get started safely with resistance training.' },
  { title: 'How Much Sleep Do You Really Need?', category: 'Sleep', description: 'General guidance on healthy sleep duration.' },
  { title: 'Mindful Eating Explained', category: 'Nutrition', description: 'Practical tips for a more mindful relationship with food.' },
];

const ARTICLE_CONTENT =
  'This article provides general, educational information intended to support healthy daily habits. ' +
  'It is not a substitute for professional medical advice, diagnosis, or treatment. ' +
  'Always consult a qualified healthcare provider with questions about your individual health.';

const APPOINTMENT_TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
const APPOINTMENT_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;
const REASONS = ['General checkup', 'Follow-up visit', 'Consultation', 'Routine screening'];

async function main() {
  console.log('Seeding database...');

  const categoryMap = new Map<string, string>();
  for (const name of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: slugify(name) },
    });
    categoryMap.set(name, category.id);
  }
  console.log(`  categories: ${CATEGORIES.length}`);

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@healthy.uz' },
    update: {},
    create: {
      fullName: 'Admin User',
      email: 'admin@healthy.uz',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('  admin created');

  const doctorIds: string[] = [];
  for (const doc of DOCTORS) {
    const password = doc.email === 'doctor@healthy.uz' ? 'Doctor123!' : 'Doctor123!';
    const hashed = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { email: doc.email } });
    let doctorId: string;
    if (existingUser) {
      const existingDoctor = await prisma.doctor.findUnique({ where: { userId: existingUser.id } });
      doctorId = existingDoctor!.id;
    } else {
      const doctor = await prisma.doctor.create({
        data: {
          fullName: doc.fullName,
          specialization: doc.specialization,
          experience: doc.experience,
          phone: doc.phone,
          email: doc.email,
          user: {
            create: {
              fullName: doc.fullName,
              email: doc.email,
              password: hashed,
              role: 'DOCTOR',
            },
          },
        },
      });
      doctorId = doctor.id;
    }
    doctorIds.push(doctorId);
  }
  console.log(`  doctors: ${DOCTORS.length}`);

  const patientIds: string[] = [];
  for (const pat of PATIENTS) {
    const password = pat.email === 'patient@healthy.uz' ? 'Patient123!' : 'Patient123!';
    const hashed = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { email: pat.email } });
    let patientId: string;
    if (existingUser) {
      const existingPatient = await prisma.patient.findUnique({ where: { userId: existingUser.id } });
      patientId = existingPatient!.id;
    } else {
      const patient = await prisma.patient.create({
        data: {
          fullName: pat.fullName,
          gender: pat.gender,
          user: {
            create: {
              fullName: pat.fullName,
              email: pat.email,
              password: hashed,
              role: 'PATIENT',
            },
          },
        },
      });
      patientId = patient.id;
    }
    patientIds.push(patientId);
  }
  console.log(`  patients: ${PATIENTS.length}`);

  for (const sport of SPORTS) {
    const existing = await prisma.sport.findFirst({ where: { title: sport.title } });
    if (!existing) {
      await prisma.sport.create({ data: sport });
    }
  }
  console.log(`  sports: ${SPORTS.length}`);

  for (const article of ARTICLES) {
    const slug = slugify(article.title);
    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        title: article.title,
        slug,
        description: article.description,
        content: ARTICLE_CONTENT,
        categoryId: categoryMap.get(article.category),
        authorId: admin.id,
      },
    });
  }
  console.log(`  articles: ${ARTICLES.length}`);

  const existingAppointments = await prisma.appointment.count();
  if (existingAppointments === 0) {
    const appointmentsData = [];
    for (let i = 0; i < 20; i++) {
      const doctorId = doctorIds[i % doctorIds.length];
      const patientId = patientIds[i % patientIds.length];
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - 10 + i);
      date.setUTCHours(0, 0, 0, 0);

      appointmentsData.push({
        doctorId,
        patientId,
        date,
        time: APPOINTMENT_TIMES[i % APPOINTMENT_TIMES.length],
        status: APPOINTMENT_STATUSES[i % APPOINTMENT_STATUSES.length],
        reason: REASONS[i % REASONS.length],
      });
    }
    await prisma.appointment.createMany({ data: appointmentsData });
  }
  console.log('  appointments: 20');

  console.log('Seeding complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
