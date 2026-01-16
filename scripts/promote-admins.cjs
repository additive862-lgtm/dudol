const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminEmails = ["pjh862@naver.com", "additive862@gmail.com"];

async function main() {
    console.log('Updating user roles to ADMIN for:', adminEmails);

    const result = await prisma.user.updateMany({
        where: {
            email: {
                in: adminEmails
            }
        },
        data: {
            role: 'ADMIN'
        }
    });

    console.log(`Updated ${result.count} users.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
