const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database roles, Super Admin, Demo Store, and Demo Customer...');

  // 1. Seed Roles
  const roles = ['SUPER_ADMIN', 'SELLER', 'CUSTOMER', 'STAFF'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `${roleName} role`,
      },
    });
  }
  console.log('Roles seeded successfully.');

  // 2. Seed Super Admin
  const adminEmail = 'admin@comzilo.com';
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('AdminPass@123', salt);

    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        isActive: true,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    });

    console.log('Super Admin user created: admin@comzilo.com / AdminPass@123');
  } else {
    console.log('Super Admin user already exists.');
  }

  // 3. Seed Demo Active Store & StoreSettings
  const demoStoreId = 'demo-store-id';
  let demoStore = await prisma.store.findUnique({ where: { id: demoStoreId } });

  if (!demoStore) {
    demoStore = await prisma.store.create({
      data: {
        id: demoStoreId,
        name: 'Comzilo Demo Store',
        slug: 'demo-store',
        subdomain: 'demo-store',
        storeUrl: 'https://demo-store.comzilo.com',
        status: 'ACTIVE',
        ownerName: 'Demo Merchant',
        mobileNumber: '9876543210',
        address: '123 E-Commerce Way',
      },
    });

    await prisma.storeSettings.upsert({
      where: { storeId: demoStore.id },
      update: {},
      create: {
        storeId: demoStore.id,
        currency: 'INR',
        language: 'en',
        timezone: 'Asia/Kolkata',
        theme: 'default',
        email: 'merchant@demostore.com',
        phone: '9876543210',
        address: '123 E-Commerce Way',
      },
    });

    console.log('Demo Active Store created: ID "demo-store-id" (slug: demo-store)');
  }

  // 4. Seed Demo Customer Account
  const customerEmail = 'customer@example.com';
  const customerRole = await prisma.role.findUnique({ where: { name: 'CUSTOMER' } });
  const existingCustomer = await prisma.user.findUnique({ where: { email: customerEmail } });

  if (!existingCustomer) {
    const salt = await bcrypt.genSalt(10);
    const customerPasswordHash = await bcrypt.hash('Pass@1234', salt);

    const customerUser = await prisma.user.create({
      data: {
        email: customerEmail,
        passwordHash: customerPasswordHash,
        firstName: 'Demo',
        lastName: 'Customer',
        mobileNumber: '9876543210',
        isActive: true,
        emailVerified: true,
      },
    });

    await prisma.storeUser.create({
      data: {
        storeId: demoStore.id,
        userId: customerUser.id,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: customerUser.id,
        roleId: customerRole.id,
        storeId: demoStore.id,
      },
    });

    console.log('Demo Customer created: customer@example.com / Pass@1234 (Store Scope: demo-store-id)');
  } else {
    console.log('Demo Customer already exists.');
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
