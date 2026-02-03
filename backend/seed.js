const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const dummyTurfs = [
    {
        name: "Green Field Arena",
        description: "Premium football turf with international standard grass and floodlights. Perfect for night matches and tournaments.",
        location: "Koramangala",
        address: "123, 5th Block, Koramangala",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560095",
        latitude: 12.9352,
        longitude: 77.6245,
        images: [
            "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
            "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800"
        ],
        pricePerHour: 1500,
        sportTypes: ["football", "cricket"],
        amenities: ["parking", "changing room", "floodlights", "drinking water", "washroom"],
        openTime: "06:00",
        closeTime: "23:00",
        isActive: true
    },
    {
        name: "Sports Hub Central",
        description: "Multi-sport facility with dedicated areas for football, cricket, and basketball. Well-maintained artificial turf.",
        location: "Indiranagar",
        address: "45, 100 Feet Road, Indiranagar",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560038",
        latitude: 12.9784,
        longitude: 77.6408,
        images: [
            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
            "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800"
        ],
        pricePerHour: 1800,
        sportTypes: ["football", "cricket", "basketball"],
        amenities: ["parking", "changing room", "floodlights", "cafeteria", "first aid", "wifi"],
        openTime: "05:00",
        closeTime: "22:00",
        isActive: true
    },
    {
        name: "Victory Ground",
        description: "Affordable turf for casual games and practice sessions. Great for beginners and weekend players.",
        location: "HSR Layout",
        address: "78, Sector 2, HSR Layout",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560102",
        latitude: 12.9116,
        longitude: 77.6389,
        images: [
            "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800"
        ],
        pricePerHour: 800,
        sportTypes: ["football", "volleyball"],
        amenities: ["parking", "drinking water", "washroom"],
        openTime: "06:00",
        closeTime: "21:00",
        isActive: true
    },
    {
        name: "Elite Sports Complex",
        description: "State-of-the-art facility with FIFA approved turf. Hosts corporate events and professional matches.",
        location: "Whitefield",
        address: "Tech Park Road, Whitefield",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560066",
        latitude: 12.9698,
        longitude: 77.7500,
        images: [
            "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
            "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800",
            "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"
        ],
        pricePerHour: 2500,
        sportTypes: ["football"],
        amenities: ["parking", "changing room", "floodlights", "drinking water", "washroom", "first aid", "cafeteria", "wifi"],
        openTime: "00:00",
        closeTime: "23:59",
        isActive: true
    },
    {
        name: "Cricket Zone",
        description: "Specialized cricket practice nets and open ground for matches. Professional coaching available.",
        location: "JP Nagar",
        address: "15th Cross, JP Nagar Phase 2",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560078",
        latitude: 12.9063,
        longitude: 77.5857,
        images: [
            "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
            "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800"
        ],
        pricePerHour: 1200,
        sportTypes: ["cricket"],
        amenities: ["parking", "changing room", "drinking water", "washroom", "first aid"],
        openTime: "05:30",
        closeTime: "20:30",
        isActive: true
    },
    {
        name: "Mumbai Sports Arena",
        description: "Premium multi-sport facility in the heart of Mumbai. Perfect for corporate events and tournaments.",
        location: "Andheri West",
        address: "Link Road, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400053",
        latitude: 19.1364,
        longitude: 72.8296,
        images: [
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"
        ],
        pricePerHour: 2000,
        sportTypes: ["football", "cricket", "basketball", "tennis"],
        amenities: ["parking", "changing room", "floodlights", "drinking water", "washroom", "cafeteria"],
        openTime: "06:00",
        closeTime: "23:00",
        isActive: true
    },
    {
        name: "Powai Football Club",
        description: "Community football ground with natural grass. Great ambiance with lake view.",
        location: "Powai",
        address: "Near Powai Lake, Hiranandani",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400076",
        latitude: 19.1176,
        longitude: 72.9060,
        images: [
            "https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=800"
        ],
        pricePerHour: 1600,
        sportTypes: ["football"],
        amenities: ["parking", "changing room", "floodlights", "drinking water"],
        openTime: "05:00",
        closeTime: "22:00",
        isActive: true
    },
    {
        name: "Delhi Sports Hub",
        description: "Modern sports complex with international standard facilities. Air-cooled indoor arena available.",
        location: "Dwarka",
        address: "Sector 21, Dwarka",
        city: "Delhi",
        state: "Delhi",
        pincode: "110077",
        latitude: 28.5733,
        longitude: 77.0420,
        images: [
            "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800",
            "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800"
        ],
        pricePerHour: 1800,
        sportTypes: ["football", "cricket", "badminton", "basketball"],
        amenities: ["parking", "changing room", "floodlights", "drinking water", "washroom", "first aid", "cafeteria", "wifi"],
        openTime: "06:00",
        closeTime: "23:00",
        isActive: true
    },
    {
        name: "Chennai Turf Park",
        description: "Well-maintained artificial turf suitable for all weather conditions. Popular among local clubs.",
        location: "Velachery",
        address: "100 Feet Road, Velachery",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600042",
        latitude: 12.9815,
        longitude: 80.2180,
        images: [
            "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800"
        ],
        pricePerHour: 1100,
        sportTypes: ["football", "cricket"],
        amenities: ["parking", "changing room", "floodlights", "drinking water", "washroom"],
        openTime: "05:00",
        closeTime: "22:00",
        isActive: true
    },
    {
        name: "Sunset Sports Ground",
        description: "Budget-friendly turf perfect for friendly matches. Beautiful sunset views during evening games.",
        location: "Electronic City",
        address: "Phase 1, Electronic City",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560100",
        latitude: 12.8399,
        longitude: 77.6770,
        images: [
            "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=800"
        ],
        pricePerHour: 700,
        sportTypes: ["football", "volleyball"],
        amenities: ["parking", "drinking water", "washroom"],
        openTime: "06:00",
        closeTime: "20:00",
        isActive: false // Inactive for demo
    }
];

async function seed() {
    console.log('🌱 Starting seed...');

    try {
        // Check if admin user exists, if not create one
        let adminUser = await prisma.user.findFirst({
            where: { role: 'admin' }
        });

        if (!adminUser) {
            console.log('Creating admin user...');
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            adminUser = await prisma.user.create({
                data: {
                    fullname: 'Admin User',
                    email: 'admin@turfplay.com',
                    pass: hashedPassword,
                    role: 'admin'
                }
            });
            console.log('✅ Admin user created: admin@turfplay.com / admin123');
        } else {
            console.log('✅ Admin user already exists');
        }

        // Delete existing turfs
        console.log('Clearing existing turfs...');
        await prisma.turf.deleteMany({});

        // Create turfs
        console.log('Creating dummy turfs...');
        for (const turf of dummyTurfs) {
            await prisma.turf.create({
                data: {
                    ...turf,
                    ownerId: adminUser.id
                }
            });
            console.log(`  ✅ Created: ${turf.name}`);
        }

        console.log(`\n🎉 Seed completed! Created ${dummyTurfs.length} turfs.`);
        console.log('\nAdmin credentials:');
        console.log('  Email: admin@turfplay.com');
        console.log('  Password: admin123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
