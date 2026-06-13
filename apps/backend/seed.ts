import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create Business
  const business = await prisma.business.create({
    data: {
      name: 'Axis Datatech',
      industryType: 'Electronics',
      phone: '+94788735561',
      whatsappNumber: '+94788735561',
      address: 'Colombo, Sri Lanka'
    }
  });

  console.log(`Created business: ${business.name}`);

  // Create Products
  const products = await prisma.product.createMany({
    data: [
      {
        businessId: business.id,
        sku: 'PRN-EPS-3250',
        name: 'Epson L3250 Printer',
        category: 'Printers',
        costPrice: 35000,
        sellingPrice: 48500,
        stockQuantity: 15
      },
      {
        businessId: business.id,
        sku: 'GEN-HON-2KW',
        name: 'Honda 2KW Generator',
        category: 'Generators',
        costPrice: 90000,
        sellingPrice: 120000,
        stockQuantity: 5
      }
    ]
  });

  console.log(`Created ${products.count} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
