const prisma = require("./config/database");

async function main() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.driverTimeline.deleteMany();
    await prisma.driver.deleteMany();

    // Create sample drivers
    console.log("👨‍💼 Creating sample drivers...");
    const drivers = await prisma.driver.createMany({
      data: [
        {
          name: "Sachin Meelu",
          email: "sachin.meelu@example.com",
          phone: "+61 400 123 456",
          licenseNumber: "002153614",
          isActive: true,
        },
        {
          name: "Mohamad Ashish",
          email: "mohamad.ashish@example.com",
          phone: "+61 400 789 012",
          licenseNumber: "L100VXN",
          isActive: true,
        },
        {
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "+61 400 345 678",
          licenseNumber: "NSW123456",
          isActive: true,
        },
      ],
    });

    console.log(`✅ Created ${drivers.count} drivers`);

    // Get driver IDs for timeline creation
    const driverRecords = await prisma.driver.findMany({
      select: { id: true, name: true },
    });

    // Create sample timeline events
    console.log("📅 Creating sample timeline events...");

    const timelineEvents = [
      // Sachin Meelu - August 6, 2025
      {
        driverId: driverRecords.find((d) => d.name === "Sachin Meelu").id,
        date: "2025-08-06",
        startTime: "01:00",
        eventType: "Work",
      },
      {
        driverId: driverRecords.find((d) => d.name === "Sachin Meelu").id,
        date: "2025-08-06",
        startTime: "05:45",
        eventType: "Rest",
      },
      {
        driverId: driverRecords.find((d) => d.name === "Sachin Meelu").id,
        date: "2025-08-06",
        startTime: "07:00",
        eventType: "Work",
      },
      {
        driverId: driverRecords.find((d) => d.name === "Sachin Meelu").id,
        date: "2025-08-06",
        startTime: "10:00",
        eventType: "Rest",
      },

      // Sachin Meelu - August 7, 2025
      {
        driverId: driverRecords.find((d) => d.name === "Sachin Meelu").id,
        date: "2025-08-07",
        startTime: "08:00",
        eventType: "Work",
      },
      {
        driverId: driverRecords.find((d) => d.name === "Sachin Meelu").id,
        date: "2025-08-07",
        startTime: "17:00",
        eventType: "Rest",
      },

      // Mohamad Ashish - August 6, 2025
      {
        driverId: driverRecords.find((d) => d.name === "Mohamad Ashish").id,
        date: "2025-08-06",
        startTime: "09:00",
        eventType: "Work",
      },
      {
        driverId: driverRecords.find((d) => d.name === "Mohamad Ashish").id,
        date: "2025-08-06",
        startTime: "18:00",
        eventType: "Rest",
      },

      // John Smith - August 6, 2025
      {
        driverId: driverRecords.find((d) => d.name === "John Smith").id,
        date: "2025-08-06",
        startTime: "06:00",
        eventType: "Work",
      },
      {
        driverId: driverRecords.find((d) => d.name === "John Smith").id,
        date: "2025-08-06",
        startTime: "14:00",
        eventType: "Rest",
      },
      {
        driverId: driverRecords.find((d) => d.name === "John Smith").id,
        date: "2025-08-06",
        startTime: "16:00",
        eventType: "Work",
      },
      {
        driverId: driverRecords.find((d) => d.name === "John Smith").id,
        date: "2025-08-06",
        startTime: "22:00",
        eventType: "Rest",
      },
    ];

    const timelineResult = await prisma.driverTimeline.createMany({
      data: timelineEvents,
    });

    console.log(`✅ Created ${timelineResult.count} timeline events`);

    // Display summary
    console.log("\n📊 Database Seeding Summary:");
    console.log("================================");
    console.log(`Drivers created: ${drivers.count}`);
    console.log(`Timeline events created: ${timelineResult.count}`);

    console.log("\n👥 Sample Drivers:");
    driverRecords.forEach((driver) => {
      console.log(`  - ${driver.name} (ID: ${driver.id})`);
    });

    console.log("\n🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
