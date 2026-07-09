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

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log("샘플 회원이 이미 존재합니다. 시드를 건너뜁니다.");
    return;
  }

  const password = await bcrypt.hash("password1234", 10);

  const kim = await prisma.user.create({
    data: {
      name: "김농부",
      phone: "010-1234-5678",
      email: "kim@example.com",
      passwordHash: password,
      region: "전남 나주시",
    },
  });

  const lee = await prisma.user.create({
    data: {
      name: "이청년",
      phone: "010-9876-5432",
      email: "lee@example.com",
      passwordHash: password,
      region: "강원 평창군",
    },
  });

  const park = await prisma.user.create({
    data: {
      name: "박도시",
      phone: "010-2222-3333",
      email: "park@example.com",
      passwordHash: password,
      region: "서울 마포구",
    },
  });

  const choi = await prisma.user.create({
    data: {
      name: "최일손",
      phone: "010-5555-6666",
      email: "choi@example.com",
      passwordHash: password,
      region: "전북 김제시",
    },
  });

  const posts = await prisma.$transaction([
    prisma.post.create({
      data: {
        authorId: kim.id,
        postType: "SELL_PRODUCT",
        title: "나주 배 (10kg)",
        category: "과일",
        price: 45000,
        unit: "박스",
        region: "전남",
        regionDetail: "나주시",
        description: "3대째 배 농사를 짓는 가족 농장의 당도 높은 나주 배입니다.",
        imageUrl: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: kim.id,
        postType: "SELL_PRODUCT",
        title: "수박 (3kg 미니)",
        category: "과일",
        price: 18000,
        unit: "개",
        region: "전남",
        regionDetail: "나주시",
        description: "달콤한 미니 수박 3kg입니다.",
        imageUrl: "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: lee.id,
        postType: "SELL_PRODUCT",
        title: "유기농 상추 (1kg)",
        category: "채소",
        price: 8000,
        unit: "봉",
        region: "강원",
        regionDetail: "평창군",
        description: "고랭지에서 재배한 유기농 상추입니다.",
        imageUrl: "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: lee.id,
        postType: "SELL_PRODUCT",
        title: "감자 (5kg)",
        category: "채소",
        price: 15000,
        unit: "박스",
        region: "강원",
        regionDetail: "평창군",
        description: "평창 고랭지 감자입니다.",
        imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: choi.id,
        postType: "SELL_PRODUCT",
        title: "김제 지평선쌀 (10kg)",
        category: "쌀",
        price: 32000,
        unit: "포대",
        region: "전북",
        regionDetail: "김제시",
        description: "김제 평야에서 재배한 신선한 쌀 10kg입니다.",
        imageUrl: "https://images.unsplash.com/photo-1645331465778-eb409d112198?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: park.id,
        postType: "BUY_PRODUCT",
        title: "블루베리 5kg 정기구매 원해요",
        category: "열매",
        price: 40000,
        unit: "박스",
        region: "서울",
        regionDetail: "마포구",
        description: "매달 블루베리 5kg 정도 정기적으로 구매하고 싶습니다. 무농약이면 더 좋아요.",
        imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: park.id,
        postType: "BUY_PRODUCT",
        title: "제철 감귤 10kg 구합니다",
        category: "과일",
        price: 20000,
        unit: "박스",
        region: "서울",
        regionDetail: "마포구",
        description: "선물용으로 당도 높은 감귤 10kg 구매처를 찾고 있습니다.",
        imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: kim.id,
        postType: "FIND_WORKER",
        title: "배 수확 일손 3명 구합니다",
        category: "수확",
        price: 130000,
        unit: "일당",
        region: "전남",
        regionDetail: "나주시",
        description: "9월 중순 배 수확 작업 도와주실 분 3명 구합니다. 숙식 제공 가능합니다.",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: lee.id,
        postType: "FIND_WORKER",
        title: "상추 모종 심기 일손 급구",
        category: "파종",
        price: 110000,
        unit: "일당",
        region: "강원",
        regionDetail: "평창군",
        description: "이틀간 상추 모종 심는 작업 도와주실 분을 찾습니다.",
        imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: park.id,
        postType: "LOOKING_FOR_WORK",
        title: "주말농장 경험 있어요, 일손 도울 수 있습니다",
        category: "수확",
        price: 100000,
        unit: "일당",
        region: "서울",
        regionDetail: "마포구",
        description: "주말마다 근교 농가에서 일할 수 있습니다. 체력 좋고 성실합니다.",
        imageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?w=800&q=80",
      },
    }),
    prisma.post.create({
      data: {
        authorId: choi.id,
        postType: "LOOKING_FOR_WORK",
        title: "농사일 경력 5년, 상시 근무 가능합니다",
        category: "전반",
        price: 120000,
        unit: "일당",
        region: "전북",
        regionDetail: "김제시",
        description: "벼농사, 밭농사 경력 있습니다. 평일 상시 근무 가능합니다.",
        imageUrl: "https://images.unsplash.com/photo-1561102304-85d096b64a27?w=800&q=80",
      },
    }),
  ]);

  const [pearPost, , , , , , , workerPost] = posts;

  await prisma.inquiry.create({
    data: {
      postId: pearPost.id,
      userId: park.id,
      message: "10월 초 배송 가능할까요? 5박스 구매하고 싶습니다.",
      quantity: 5,
    },
  });

  await prisma.inquiry.create({
    data: {
      postId: workerPost.id,
      userId: kim.id,
      message: "다음 주 배 수확 작업에 지원 부탁드립니다.",
    },
  });

  console.log("시드 완료:", {
    adminEmail,
    users: [kim.name, lee.name, park.name, choi.name],
    postCount: posts.length,
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
