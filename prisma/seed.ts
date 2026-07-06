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
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      products: {
        create: [
          {
            name: "수박 (3kg)",
            category: "과일",
            price: 18000,
            unit: "개",
            description: "달콤한 미니 수박 3kg입니다.",
            stockStatus: "AVAILABLE",
            imageUrl: "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=800&q=80",
          },
          {
            name: "나주 배 (10kg)",
            category: "과일",
            price: 45000,
            unit: "박스",
            description: "당도 높은 나주 배 10kg 박스입니다. 선물용으로 좋습니다.",
            stockStatus: "AVAILABLE",
            imageUrl: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80",
      products: {
        create: [
          {
            name: "유기농 상추 (1kg)",
            category: "채소",
            price: 8000,
            unit: "봉",
            description: "고랭지에서 재배한 유기농 상추입니다.",
            stockStatus: "AVAILABLE",
            imageUrl: "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=800&q=80",
          },
          {
            name: "감자 (5kg)",
            category: "채소",
            price: 15000,
            unit: "박스",
            description: "평창 고랭지 감자입니다.",
            stockStatus: "SOLD_OUT",
            imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
          },
          {
            name: "당근 (3kg)",
            category: "채소",
            price: 9000,
            unit: "봉",
            description: "평창 고랭지에서 재배한 당근입니다.",
            stockStatus: "AVAILABLE",
            imageUrl: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800&q=80",
          },
        ],
      },
    },
  });

  const jejuCitrusFarm = await prisma.farm.create({
    data: {
      name: "제주감귤농원",
      region: "제주",
      regionDetail: "서귀포시",
      description: "제주의 바람과 햇살을 맞고 자란 감귤을 재배하는 농원입니다.",
      contactName: "박제주",
      contactPhone: "010-2222-3333",
      contactEmail: "jeju-citrus@example.com",
      imageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?w=1200&q=80",
      products: {
        create: [
          {
            name: "제주 감귤 (5kg)",
            category: "과일",
            price: 20000,
            unit: "박스",
            description: "새콤달콤한 제주 감귤 5kg 박스입니다.",
            stockStatus: "AVAILABLE",
            imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80",
          },
        ],
      },
    },
  });

  const nonsanStrawberryFarm = await prisma.farm.create({
    data: {
      name: "논산딸기농장",
      region: "충남",
      regionDetail: "논산시",
      description: "유리온실에서 설향 딸기를 재배하는 농장입니다.",
      contactName: "정딸기",
      contactPhone: "010-4444-5555",
      contactEmail: "nonsan-strawberry@example.com",
      imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=1200&q=80",
      products: {
        create: [
          {
            name: "설향 딸기 (1kg)",
            category: "과일",
            price: 12000,
            unit: "팩",
            description: "달콤한 설향 딸기 1kg 팩입니다.",
            stockStatus: "AVAILABLE",
            imageUrl: "https://images.unsplash.com/photo-1543528176-61b239494933?w=800&q=80",
          },
        ],
      },
    },
  });

  const gimjeRiceFarm = await prisma.farm.create({
    data: {
      name: "김제평야농장",
      region: "전북",
      regionDetail: "김제시",
      description: "김제 평야의 너른 들판에서 벼농사를 짓는 농장입니다.",
      contactName: "최농부",
      contactPhone: "010-5555-6666",
      contactEmail: "gimje-rice@example.com",
      imageUrl: "https://images.unsplash.com/photo-1561102304-85d096b64a27?w=1200&q=80",
      products: {
        create: [
          {
            name: "김제 지평선쌀 (10kg)",
            category: "쌀",
            price: 32000,
            unit: "포대",
            description: "김제 평야에서 재배한 신선한 쌀 10kg입니다.",
            stockStatus: "AVAILABLE",
            imageUrl: "https://images.unsplash.com/photo-1645331465778-eb409d112198?w=800&q=80",
          },
        ],
      },
    },
  });

  const goesanBlueberryFarm = await prisma.farm.create({
    data: {
      name: "산골블루베리농원",
      region: "충북",
      regionDetail: "괴산군",
      description: "산골 청정 지역에서 블루베리를 재배하는 농원입니다.",
      contactName: "한열매",
      contactPhone: "010-7777-8888",
      contactEmail: "goesan-blueberry@example.com",
      imageUrl: "https://images.unsplash.com/photo-1627056027816-5c88854acf46?w=1200&q=80",
      products: {
        create: [
          {
            name: "블루베리 (500g)",
            category: "열매",
            price: 9000,
            unit: "팩",
            description: "제철에 수확한 신선한 블루베리 500g입니다.",
            stockStatus: "AVAILABLE",
            imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80",
          },
        ],
      },
    },
  });

  const andongBeefFarm = await prisma.farm.create({
    data: {
      name: "안동한우농장",
      region: "경북",
      regionDetail: "안동시",
      description: "안동에서 한우를 사육하는 축산 농가입니다.",
      contactName: "류축산",
      contactPhone: "010-9999-1111",
      contactEmail: "andong-beef@example.com",
      imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=1200&q=80",
      products: {
        create: [
          {
            name: "안동 한우 (1kg)",
            category: "육류",
            price: 55000,
            unit: "팩",
            description: "안동에서 정성껏 키운 한우 1kg입니다.",
            stockStatus: "AVAILABLE",
            imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&q=80",
          },
        ],
      },
    },
  });

  console.log("시드 완료:", {
    adminEmail,
    farms: [
      sunshineFarm.name,
      greenValleyFarm.name,
      jejuCitrusFarm.name,
      nonsanStrawberryFarm.name,
      gimjeRiceFarm.name,
      goesanBlueberryFarm.name,
      andongBeefFarm.name,
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
