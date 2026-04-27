import { PrismaClient, PropertyType, ListingType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CITIES = [
  { name: "Tirana", lat: 41.3275, lng: 19.8187, neighborhoods: ["Bllok", "Komuna e Parisit", "Pazari i Ri", "Don Bosko", "Ali Demi", "Kodra e Diellit"] },
  { name: "Durrës", lat: 41.3231, lng: 19.4414, neighborhoods: ["Plazh", "Qender", "Currila", "Plepa"] },
  { name: "Vlorë", lat: 40.4686, lng: 19.4890, neighborhoods: ["Lungomare", "Skele", "Uji i Ftohtë", "Radhimë"] },
  { name: "Sarandë", lat: 39.8756, lng: 20.0053, neighborhoods: ["Qender", "Ksamil", "Lekursi"] },
  { name: "Shkodër", lat: 42.0693, lng: 19.5126, neighborhoods: ["Qender", "Rus"] },
  { name: "Pogradec", lat: 40.9025, lng: 20.6524, neighborhoods: ["Drilon", "Qender"] },
];

const TITLES = [
  "Luxury Sea-View Villa",
  "Modern Downtown Apartment",
  "Spacious Family Penthouse",
  "Cozy Studio in the Center",
  "Premium Duplex with Terrace",
  "Elegant Office Space",
  "Prime Retail Shop",
  "Beachfront Development Land",
  "Renovated 3-Bedroom Flat",
  "Exclusive Private Villa",
  "Chic Loft Apartment",
  "Contemporary Townhouse",
];

const DESC = (t: string, city: string, hood: string) =>
  `${t} located in the highly sought-after ${hood} area of ${city}. Featuring premium finishes, thoughtful layouts, and an unbeatable location close to schools, cafes, and transport. A rare opportunity to own or lease in one of the most vibrant neighborhoods.`;

const IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&q=80",
  "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1600&q=80",
];

const AMENITIES = [
  { name: "Parking", icon: "car" },
  { name: "Elevator", icon: "arrow-up-down" },
  { name: "Balcony", icon: "flower" },
  { name: "Garden", icon: "trees" },
  { name: "Pool", icon: "waves" },
  { name: "Air Conditioning", icon: "wind" },
  { name: "Furnished", icon: "sofa" },
  { name: "Security", icon: "shield" },
  { name: "Sea View", icon: "sunset" },
  { name: "Gym", icon: "dumbbell" },
  { name: "Fireplace", icon: "flame" },
  { name: "Storage", icon: "box" },
];

const AGENT_NAMES = [
  "Ardit Hoxha", "Eliona Kola", "Bledar Shehu", "Mirela Dervishi",
  "Gentian Rama", "Alda Kushi", "Endri Bajrami", "Sofia Leka",
  "Klara Gjoka", "Rajmond Pali", "Xhenis Tola", "Anisa Mema",
];

const TITLES_AGENT = ["Senior Agent", "Partner Agent", "Lead Broker", "Assistant Agent", "Associate"];

const slugify = (s: string, id: number) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + id;

const rand = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const jitter = (v: number, d = 0.02) => v + (Math.random() - 0.5) * d;

async function main() {
  console.log("🧹 Clearing database...");
  await prisma.lead.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.review.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.user.deleteMany();
  await prisma.office.deleteMany();
  await prisma.amenity.deleteMany();

  console.log("🏷  Creating amenities...");
  const amenities = await Promise.all(
    AMENITIES.map((a) => prisma.amenity.create({ data: a }))
  );

  console.log("🏢 Creating offices...");
  const offices = await Promise.all(
    CITIES.slice(0, 5).map((c, i) =>
      prisma.office.create({
        data: {
          name: `Brunes ${c.name}`,
          city: c.name,
          address: `Rruga Kryesore ${i + 10}, ${c.name}`,
          lat: c.lat,
          lng: c.lng,
          phone: `+3554221212${i}`,
          email: `${c.name.toLowerCase()}@brunes.al`,
          photo: IMAGES[i],
        },
      })
    )
  );

  console.log("👤 Creating admin + agents...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@brunes.al",
      passwordHash: adminPassword,
      name: "Admin",
      role: Role.ADMIN,
    },
  });
  console.log("   → admin@brunes.al / admin123");

  const agents = [] as { id: string }[];
  for (let i = 0; i < AGENT_NAMES.length; i++) {
    const name = AGENT_NAMES[i];
    const user = await prisma.user.create({
      data: {
        email: `${name.toLowerCase().replace(/\s/g, ".")}@brunes.al`,
        name,
        role: Role.AGENT,
        phone: `+35569${Math.floor(1000000 + Math.random() * 9000000)}`,
        avatar: `https://i.pravatar.cc/200?img=${i + 5}`,
      },
    });
    const agent = await prisma.agent.create({
      data: {
        userId: user.id,
        officeId: offices[i % offices.length].id,
        title: rand(TITLES_AGENT),
        bio: `${name} is a dedicated real estate professional with years of experience helping clients find their ideal home across Albania.`,
        languages: rand([["English", "Albanian"], ["English", "Albanian", "Italian"], ["English", "Albanian", "German"]]),
        photo: `https://i.pravatar.cc/400?img=${i + 5}`,
        rating: 4 + Math.random(),
        soldCount: Math.floor(Math.random() * 80) + 10,
        featured: i < 6,
      },
    });
    agents.push(agent);
  }

  console.log("🏠 Creating 60 properties...");
  const types = [PropertyType.APARTMENT, PropertyType.VILLA, PropertyType.DUPLEX, PropertyType.OFFICE, PropertyType.SHOP, PropertyType.LAND];
  const listings = [ListingType.SALE, ListingType.SALE, ListingType.SALE, ListingType.RENT];

  for (let i = 0; i < 60; i++) {
    const city = rand(CITIES);
    const hood = rand(city.neighborhoods);
    const type = rand(types);
    const listingType = rand(listings);
    const title = rand(TITLES);
    const rooms = type === PropertyType.LAND || type === PropertyType.SHOP ? null : Math.floor(Math.random() * 4) + 1;
    const area = type === PropertyType.LAND ? 500 + Math.random() * 3000 : 40 + Math.random() * 260;
    const basePrice = listingType === ListingType.RENT ? 300 + Math.random() * 1800 : 45000 + Math.random() * 650000;
    const price = Math.round(basePrice);

    const property = await prisma.property.create({
      data: {
        slug: slugify(title, i + 1),
        title: `${title} #${i + 1}`,
        description: DESC(title, city.name, hood),
        type,
        listingType,
        price,
        areaM2: Math.round(area),
        rooms: rooms,
        bathrooms: rooms ? Math.max(1, Math.min(rooms, 3)) : null,
        floor: type === PropertyType.APARTMENT ? Math.floor(Math.random() * 10) + 1 : null,
        yearBuilt: 1990 + Math.floor(Math.random() * 34),
        city: city.name,
        neighborhood: hood,
        address: `Rruga ${hood} ${Math.floor(Math.random() * 200)}`,
        lat: jitter(city.lat, 0.06),
        lng: jitter(city.lng, 0.06),
        featured: Math.random() < 0.25,
        agentId: rand(agents).id,
        officeId: rand(offices).id,
        viewsCount: Math.floor(Math.random() * 1000),
      },
    });

    const imgCount = 4 + Math.floor(Math.random() * 3);
    const picked = [...IMAGES].sort(() => Math.random() - 0.5).slice(0, imgCount);
    for (let j = 0; j < picked.length; j++) {
      await prisma.propertyImage.create({
        data: {
          propertyId: property.id,
          url: picked[j],
          orderIndex: j,
          isCover: j === 0,
        },
      });
    }

    const amenityCount = 3 + Math.floor(Math.random() * 5);
    const pickedAmenities = [...amenities].sort(() => Math.random() - 0.5).slice(0, amenityCount);
    for (const a of pickedAmenities) {
      await prisma.propertyAmenity.create({
        data: { propertyId: property.id, amenityId: a.id },
      });
    }
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
