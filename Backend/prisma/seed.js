const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.work.createMany({
    data: [
      {
        title: "Преступление и наказание",
        summary: "Родион Раскольников совершает убийство и проходит через внутренний кризис, страх, вину и путь к раскаянию."
      },
      {
        title: "Война и мир",
        summary: "Роман о судьбах нескольких семей на фоне войны 1812 года, любви, поиска смысла жизни и исторических перемен."
      },
      {
        title: "Евгений Онегин",
        summary: "История Онегина, Татьяны и Ленского о любви, разочаровании, выборе и упущенных возможностях."
      },
      {
        title: "Герой нашего времени",
        summary: "Печорин предстает как сложный и противоречивый герой, чья жизнь раскрывает проблемы поколения и внутреннюю пустоту."
      },
      {
        title: "Мёртвые души",
        summary: "Чичиков путешествует по России и скупает мёртвые души, раскрывая пороки общества и человеческую жадность."
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });