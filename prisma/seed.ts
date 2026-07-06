import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-1234";

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  const farmCount = await prisma.farm.count();
  if (farmCount > 0) {
    console.log("샘플 농가가 이미 존재합니다. 시드를 건너뜁니다.");
    return;
  }

  const sunshineFarm = await prisma.farm.create({
    data: {
      name: "햇살농장",
      region: "전남",
      regionDetail: "나주시",
      description: "3대째 배 농사를 짓는 가족 농장입니다. 당도 높은 나주 배를 직접 재배합니다.",
      contactName: "김농부",
      contactPhone: "010-1234-5678",
      contactEmail: "sunshine-farm@example.com",
      products: {
        create: [
          {
            name: "나주 배 (5kg)",
            category: "과일",
            price: 25000,
            unit: "박스",
            description: "당도 높은 나주 배 5kg 박스입니다.",
            stockStatus: "AVAILABLE",
          },
          {
            name: "나주 배 (10kg)",
            category: "과일",
            price: 45000,
            unit: "박스",
            description: "당도 높은 나주 배 10kg 박스입니다. 선물용으로 좋습니다.",
            stockStatus: "AVAILABLE",
          },
        ],
      },
    },
  });

  const greenValleyFarm = await prisma.farm.create({
    data: {
      name: "초록골농원",
      region: "강원",
      regionDetail: "평창군",
      description: "고랭지 채소를 재배하는 청년 농부입니다. 유기농 인증을 받았습니다.",
      contactName: "이청년",
      contactPhone: "010-9876-5432",
      contactEmail: "greenvalley@example.com",
      products: {
        create: [
          {
            name: "유기농 상추 (1kg)",
            category: "채소",
            price: 8000,
            unit: "봉",
            description: "고랭지에서 재배한 유기농 상추입니다.",
            stockStatus: "AVAILABLE",
          },
          {
            name: "감자 (5kg)",
            category: "채소",
            price: 15000,
            unit: "박스",
            description: "평창 고랭지 감자입니다.",
            stockStatus: "SOLD_OUT",
          },
        ],
      },
    },
  });

  console.log("시드 완료:", { adminEmail, farms: [sunshineFarm.name, greenValleyFarm.name] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
