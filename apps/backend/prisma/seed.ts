import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // 1. Create Business
  const business = await prisma.business.create({
    data: {
      name: 'BizPilot Enterprises',
      industryType: 'Electronics',
      phone: '+94 11 234 5678',
      whatsappNumber: '+94 77 000 0000',
      address: '123 Tech Lane, Colombo 03',
    },
  });
  console.log(`Created business: ${business.name}`);

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash('password', 10);
  const admin = await prisma.user.create({
    data: {
      businessId: business.id,
      name: 'Admin User',
      email: 'admin@bizpilot.com',
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 3. Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        businessId: business.id,
        sku: 'PRN-EPS-001',
        name: 'Epson L3250 EcoTank Printer',
        category: 'Printers',
        costPrice: 40000,
        sellingPrice: 48500,
        stockQuantity: 15,
      },
    }),
    prisma.product.create({
      data: {
        businessId: business.id,
        sku: 'PRN-CAN-002',
        name: 'Canon Pixma G3010',
        category: 'Printers',
        costPrice: 30000,
        sellingPrice: 35000,
        stockQuantity: 8,
      },
    }),
    prisma.product.create({
      data: {
        businessId: business.id,
        sku: 'INK-EPS-001',
        name: 'Epson 003 Black Ink',
        category: 'Consumables',
        costPrice: 1500,
        sellingPrice: 2200,
        stockQuantity: 50,
      },
    }),
  ]);
  console.log(`Created ${products.length} products`);

  // 4. Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        businessId: business.id,
        name: 'Nimal Perera',
        whatsappNumber: '+94 78 873 3314',
      },
    }),
    prisma.customer.create({
      data: {
        businessId: business.id,
        name: 'Kamal Silva',
        whatsappNumber: '+94 77 123 4567',
      },
    }),
  ]);
  console.log(`Created ${customers.length} customers`);

  // 5. Create Orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        businessId: business.id,
        customerId: customers[0].id,
        status: OrderStatus.COMPLETED,
        totalAmount: 50700, // Printer + Ink
        items: {
          create: [
            { productId: products[0].id, quantity: 1, price: 48500 },
            { productId: products[2].id, quantity: 1, price: 2200 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        businessId: business.id,
        customerId: customers[1].id,
        status: OrderStatus.PROCESSING,
        totalAmount: 35000, // Canon Printer
        items: {
          create: [
            { productId: products[1].id, quantity: 1, price: 35000 },
          ],
        },
      },
    }),
  ]);
  console.log(`Created ${orders.length} orders`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
