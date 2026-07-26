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

  // 5. Seed Demo Categories and Products for Demo Store
  const catElectronics = await prisma.category.upsert({
    where: { storeId_slug: { storeId: demoStore.id, slug: 'electronics' } },
    update: {},
    create: {
      storeId: demoStore.id,
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets, audio & smart accessories',
      status: 'ACTIVE',
      sortOrder: 1,
    },
  });

  const catApparel = await prisma.category.upsert({
    where: { storeId_slug: { storeId: demoStore.id, slug: 'apparel' } },
    update: {},
    create: {
      storeId: demoStore.id,
      name: 'Apparel & Fashion',
      slug: 'apparel',
      description: 'Modern clothing and accessories',
      status: 'ACTIVE',
      sortOrder: 2,
    },
  });

  // Seed Product 1
  const prod1Sku = 'PROD-HEADPHONES-001';
  const existingProd1 = await prisma.product.findFirst({
    where: { storeId: demoStore.id, sku: prod1Sku },
  });

  if (!existingProd1) {
    const prod1 = await prisma.product.create({
      data: {
        storeId: demoStore.id,
        categoryId: catElectronics.id,
        name: 'Noise-Cancelling Wireless Headphones',
        slug: 'noise-cancelling-wireless-headphones',
        sku: prod1Sku,
        shortDescription: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
        description: 'Immerse yourself in crystal-clear audio quality with ultra-soft memory foam ear cushions, dual Bluetooth pairing, and rapid USB-C fast charging.',
        brand: 'SoundPulse',
        regularPrice: 4999.00,
        salePrice: 3499.00,
        stockQuantity: 45,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        featured: true,
      },
    });

    await prisma.productImage.createMany({
      data: [
        {
          productId: prod1.id,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          productId: prod1.id,
          imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
          isPrimary: false,
          sortOrder: 1,
        },
      ],
    });
  }

  // Seed Product 2
  const prod2Sku = 'PROD-SMARTWATCH-002';
  const existingProd2 = await prisma.product.findFirst({
    where: { storeId: demoStore.id, sku: prod2Sku },
  });

  if (!existingProd2) {
    const prod2 = await prisma.product.create({
      data: {
        storeId: demoStore.id,
        categoryId: catElectronics.id,
        name: 'Amoled Fitness Smartwatch V2',
        slug: 'amoled-fitness-smartwatch-v2',
        sku: prod2Sku,
        shortDescription: 'Sleek fitness tracker with AMOLED display, heart rate monitor, and GPS.',
        description: 'Track your workouts, sleep quality, blood oxygen levels, and step counts with precision. Features IP68 water resistance.',
        brand: 'TechGear',
        regularPrice: 2999.00,
        salePrice: 2499.00,
        stockQuantity: 20,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        featured: true,
      },
    });

    await prisma.productImage.create({
      data: {
        productId: prod2.id,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        isPrimary: true,
        sortOrder: 0,
      },
    });
  }

  console.log('Demo Categories & Products seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
