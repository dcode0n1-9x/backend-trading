import 'dotenv/config'
import {
    Permission,
    KYCStatus,
    AccountType,
    Segment,
    OTPPreferenceType,
    UserStage,
    Exchange,
    ProductType,
    OrderType,
    TransactionType,
    OrderValidity,
    OrderStatus,
    PositionType,
    GTTType,
    TriggerType,
    AlertType,
    NotificationType,
    Priority,
    FundTransactionType,
    TransactionStatus,
    PaymentMode,
    BankAccountType,
} from '../generated/prisma/enums'
import * as bcrypt from 'bcryptjs'
import { prisma } from '../src/db'

async function main() {
    console.log('🌱 Starting database seeding...')

    // 1️⃣ ROLES & STAFF
    const allPermissions = Object.values(Permission)

    const ceoRole = await prisma.role.upsert({
        where: { name: 'CEO' },
        update: {
            permissions: allPermissions,
            isActive: true,
        },
        create: {
            name: 'CEO',
            permissions: allPermissions,
            isActive: true,
        },
    })

    console.log('✅ CEO Role created/updated:', {
        id: ceoRole.id,
        name: ceoRole.name,
        permissionsCount: ceoRole.permissions.length,
    })

    const saltRounds = 10
    const plainPassword = 'CEO@12345'
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

    const ceoStaff = await prisma.staff.upsert({
        where: { email: 'ceo@company.com' },
        update: {
            roleId: ceoRole.id,
            isActive: true,
        },
        create: {
            email: 'ceo@company.com',
            name: 'Chief Executive Officer',
            dob: new Date('1980-01-01'),
            password: hashedPassword,
            roleId: ceoRole.id,
            phone: '+919999999999',
            isActive: true,
            address: 'Corporate Headquarters',
        },
    })

    console.log('✅ CEO Staff created/updated:', {
        id: ceoStaff.id,
        name: ceoStaff.name,
        email: ceoStaff.email,
        role: ceoRole.name,
    })

    // 2️⃣ USERS + PROFILE + VERIFICATION
    const userPassword = await bcrypt.hash('User@123', saltRounds)

    const usersSeed = [
        {
            email: 'rajesh.kumar@gmail.com',
            phone: '+919876543210',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            panNumber: 'ABCPK1234A',
            aadhaarNumber: '123456789012',
            dob: new Date('1985-03-15'),
            kycStatus: KYCStatus.VERIFIED,
            accountType: AccountType.INDIVIDUAL,
            isVerified: true,
            twoFactorEnabled: true,
            twoFactorPreference: OTPPreferenceType.SMS,
            segment: [Segment.EQUITY, Segment.FUTURES],
            profile: {
                addressLine1: '123, MG Road',
                addressLine2: 'Koramangala',
                city: 'Bangalore',
                state: 'Karnataka',
                pincode: '560034',
                fatherName: 'Suresh Kumar',
                motherName: 'Lakshmi Kumar',
                maritalStatus: 'MARRIED' as any,
                occupation: 'PRIVATE_SECTOR' as any,
                annualIncome: 'BETWEEN_10_TO_25_LAKHS',
                tradingExperience: 'BETWEEN_5_TO_10_YEARS',
                riskProfile: 'HIGH' as any,
            },
            verification: { stage: UserStage.FOURA },
        },
        {
            email: 'priya.sharma@yahoo.com',
            phone: '+919876543211',
            firstName: 'Priya',
            lastName: 'Sharma',
            panNumber: 'DEFPS5678B',
            aadhaarNumber: '234567890123',
            dob: new Date('1990-07-22'),
            kycStatus: KYCStatus.VERIFIED,
            accountType: AccountType.INDIVIDUAL,
            isVerified: true,
            twoFactorEnabled: true,
            twoFactorPreference: OTPPreferenceType.EMAIL,
            segment: [Segment.EQUITY],
            profile: {
                addressLine1: '456, Linking Road',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400050',
                fatherName: 'Vikram Sharma',
                motherName: 'Meera Sharma',
                maritalStatus: 'SINGLE' as any,
                occupation: 'PROFESSIONAL' as any,
                annualIncome: 'BETWEEN_5_TO_10_LAKHS',
                tradingExperience: 'BETWEEN_1_TO_5_YEARS',
                riskProfile: 'MODERATE' as any,
            },
            verification: { stage: UserStage.FOURB },
        },
        {
            email: 'amit.patel@outlook.com',
            phone: '+919876543212',
            firstName: 'Amit',
            lastName: 'Patel',
            panNumber: 'GHIAP9012C',
            aadhaarNumber: '345678901234',
            dob: new Date('1978-11-30'),
            kycStatus: KYCStatus.VERIFIED,
            accountType: AccountType.HUF,
            isVerified: false,
            twoFactorEnabled: false,
            segment: [Segment.EQUITY, Segment.COMMODITY],
            profile: {
                addressLine1: 'Plot 789, Satellite',
                city: 'Ahmedabad',
                state: 'Gujarat',
                pincode: '380015',
                fatherName: 'Ramesh Patel',
                maritalStatus: 'MARRIED' as any,
                occupation: 'BUSINESS' as any,
                annualIncome: 'BETWEEN_25_TO_1_CRORE',
                tradingExperience: 'MORE_THAN_15_YEARS',
                riskProfile: 'HIGH' as any,
            },
            verification: { stage: UserStage.FOURA },
        },
        {
            email: 'sneha.reddy@gmail.com',
            phone: '+919876543213',
            firstName: 'Sneha',
            lastName: 'Reddy',
            panNumber: 'JKLSR3456D',
            aadhaarNumber: '456789012345',
            dob: new Date('1995-05-18'),
            kycStatus: KYCStatus.SUBMITTED,
            accountType: AccountType.INDIVIDUAL,
            isVerified: false,
            twoFactorEnabled: false,
            segment: [Segment.EQUITY],
            profile: {
                addressLine1: '321, Banjara Hills',
                city: 'Hyderabad',
                state: 'Telangana',
                pincode: '500034',
                motherName: 'Padma Reddy',
                maritalStatus: 'SINGLE' as any,
                occupation: 'STUDENT' as any,
                annualIncome: 'BELOW_1_LAKH',
                tradingExperience: 'NEW',
                riskProfile: 'LOW' as any,
            },
            verification: { stage: UserStage.THREEB },
        },
        {
            email: 'dcode.0n1@gmail.com',
            phone: '+916376877564',
            firstName: 'Rakshak',
            lastName: 'Khandelwal',
            panNumber: 'ABCVS6789E',
            aadhaarNumber: '275351556058',
            dob: new Date('1982-09-25'),
            kycStatus: KYCStatus.VERIFIED,
            accountType: AccountType.INDIVIDUAL,
            isVerified: true,
            twoFactorEnabled: true,
            twoFactorPreference: OTPPreferenceType.SMS,
            segment: [Segment.EQUITY, Segment.FUTURES, Segment.OPTIONS],
            profile: {
                addressLine1: 'B-45, Defence Colony',
                city: 'New Delhi',
                state: 'Delhi',
                pincode: '110024',
                fatherName: 'Rajendra Singh',
                maritalStatus: 'MARRIED' as any,
                occupation: 'GOVERMENT_SERVICE' as any,
                annualIncome: 'BETWEEN_10_TO_25_LAKHS',
                tradingExperience: 'BETWEEN_10_TO_15_YEARS',
                riskProfile: 'MODERATE' as any,
            },
            verification: { stage: UserStage.FOURB },
        },
        {
            email: 'anjali.mehta@hotmail.com',
            phone: '+919876543215',
            firstName: 'Anjali',
            lastName: 'Mehta',
            panNumber: 'PQRAM1234F',
            aadhaarNumber: '678901234567',
            dob: new Date('1988-12-10'),
            kycStatus: KYCStatus.VERIFIED,
            accountType: AccountType.INDIVIDUAL,
            isVerified: false,
            twoFactorEnabled: true,
            twoFactorPreference: OTPPreferenceType.EMAIL,
            segment: [Segment.EQUITY, Segment.CURRENCY],
            profile: {
                addressLine1: '67, Park Street',
                city: 'Kolkata',
                state: 'West Bengal',
                pincode: '700016',
                fatherName: 'Sunil Mehta',
                motherName: 'Kavita Mehta',
                maritalStatus: 'MARRIED' as any,
                occupation: 'HOUSEWIFE' as any,
                annualIncome: 'BETWEEN_1_TO_5_LAKHS',
                tradingExperience: 'BETWEEN_1_TO_5_YEARS',
                riskProfile: 'LOW' as any,
            },
            verification: { stage: UserStage.FOURA },
        },
        {
            email: 'karthik.nair@gmail.com',
            phone: '+919876543216',
            firstName: 'Karthik',
            lastName: 'Nair',
            panNumber: 'STUKN5678G',
            aadhaarNumber: '789012345678',
            dob: new Date('1992-02-14'),
            kycStatus: KYCStatus.PENDING,
            accountType: AccountType.INDIVIDUAL,
            isVerified: false,
            twoFactorEnabled: false,
            segment: [Segment.EQUITY],
            profile: {
                city: 'Kochi',
                state: 'Kerala',
                maritalStatus: 'SINGLE' as any,
                occupation: 'PRIVATE_SECTOR' as any,
                riskProfile: 'MODERATE' as any,
            },
            verification: { stage: UserStage.ONE },
        },
        {
            email: 'deepak.gupta@yahoo.in',
            phone: '+919876543217',
            firstName: 'Deepak',
            lastName: 'Gupta',
            panNumber: 'VWXDG9012H',
            aadhaarNumber: '890123456789',
            dob: new Date('1975-06-08'),
            kycStatus: KYCStatus.VERIFIED,
            accountType: AccountType.CORPORATE,
            isVerified: true,
            twoFactorEnabled: true,
            twoFactorPreference: OTPPreferenceType.SMS,
            segment: [Segment.EQUITY, Segment.FUTURES, Segment.OPTIONS, Segment.COMMODITY],
            profile: {
                addressLine1: 'Tower A, Cyber City',
                city: 'Gurugram',
                state: 'Haryana',
                pincode: '122002',
                fatherName: 'Ramesh Gupta',
                maritalStatus: 'MARRIED' as any,
                occupation: 'BUSINESS' as any,
                annualIncome: 'ABOVE_1_CRORE',
                tradingExperience: 'MORE_THAN_15_YEARS',
                riskProfile: 'HIGH' as any,
            },
            verification: { stage: UserStage.FOURB },
        },
        {
            email: 'meera.iyer@gmail.com',
            phone: '+919876543218',
            firstName: 'Meera',
            lastName: 'Iyer',
            panNumber: 'YZAMI3456I',
            aadhaarNumber: '901234567890',
            dob: new Date('1993-08-20'),
            kycStatus: KYCStatus.VERIFIED,
            accountType: AccountType.INDIVIDUAL,
            isVerified: false,
            twoFactorEnabled: false,
            segment: [Segment.EQUITY],
            profile: {
                addressLine1: '89, Anna Nagar',
                city: 'Chennai',
                state: 'Tamil Nadu',
                pincode: '600040',
                fatherName: 'Krishnan Iyer',
                motherName: 'Lakshmi Iyer',
                maritalStatus: 'SINGLE' as any,
                occupation: 'PROFESSIONAL' as any,
                annualIncome: 'BETWEEN_5_TO_10_LAKHS',
                tradingExperience: 'BETWEEN_1_TO_5_YEARS',
                riskProfile: 'MODERATE' as any,
            },
            verification: { stage: UserStage.FOURA },
        },
        {
            email: 'rahul.verma@outlook.in',
            phone: '+919876543219',
            firstName: 'Rahul',
            lastName: 'Verma',
            panNumber: 'BCDRV7890J',
            aadhaarNumber: '012345678901',
            dob: new Date('1987-04-12'),
            kycStatus: KYCStatus.REJECTED,
            accountType: AccountType.INDIVIDUAL,
            isVerified: false,
            twoFactorEnabled: false,
            segment: [Segment.EQUITY],
            profile: {
                addressLine1: '234, Civil Lines',
                city: 'Jaipur',
                state: 'Rajasthan',
                pincode: '302006',
                fatherName: 'Suresh Verma',
                maritalStatus: 'MARRIED' as any,
                occupation: 'PUBLIC_SECTOR' as any,
                riskProfile: 'LOW' as any,
            },
            verification: { stage: UserStage.THREEA },
        },
        {
            email: 'pooja.desai@rediffmail.com',
            phone: '+919876543220',
            firstName: 'Pooja',
            lastName: 'Desai',
            panNumber: 'EFGPD1234K',
            aadhaarNumber: '123450987654',
            dob: new Date('1991-10-05'),
            kycStatus: KYCStatus.VERIFIED,
            accountType: AccountType.INDIVIDUAL,
            isVerified: true,
            twoFactorEnabled: true,
            twoFactorPreference: OTPPreferenceType.EMAIL,
            segment: [Segment.EQUITY, Segment.OPTIONS],
            profile: {
                addressLine1: '567, FC Road',
                city: 'Pune',
                state: 'Maharashtra',
                pincode: '411004',
                fatherName: 'Nitin Desai',
                motherName: 'Sunita Desai',
                maritalStatus: 'SINGLE' as any,
                occupation: 'PRIVATE_SECTOR' as any,
                annualIncome: 'BETWEEN_10_TO_25_LAKHS',
                tradingExperience: 'BETWEEN_5_TO_10_YEARS',
                riskProfile: 'HIGH' as any,
            },
            verification: { stage: UserStage.FOURB },
        },
    ]

    console.log('\n👥 Creating users...')

    for (const userData of usersSeed) {
        const { profile, verification, ...userFields } = userData

        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                ...userFields,
                password: userPassword,
                profile: profile
                    ? {
                        create: profile,
                    }
                    : undefined,
                userVerification: verification
                    ? {
                        create: verification,
                    }
                    : undefined,
                margin: {
                    createMany: {
                        data: userData.segment.map((seg) => ({
                            type: seg,
                        })),
                    },
                },
                dailyPnls: {
                    create: {},
                },
                portfolios: {
                    create: {}
                }
            },
        })
        console.log(`  ✅ User created: ${user.firstName} ${user.lastName} (${user.email})`)
    }

    const users = await prisma.user.findMany({
        where: { email: { in: usersSeed.map((u) => u.email) } },
    })

    const rajesh = users.find((u) => u.email === 'rajesh.kumar@gmail.com')!
    const priya = users.find((u) => u.email === 'priya.sharma@yahoo.com')!

    // 3️⃣ INSTRUMENTS
    console.log('\n📈 Creating instruments...')

    const reliance = await prisma.instrument.upsert({
        where: { instrumentToken: '500325' },
        update: {},
        create: {
            instrumentToken: '500325',
            exchangeToken: '500325',
            tradingSymbol: 'RELIANCE',
            name: 'Reliance Industries',
            exchange: Exchange.NSE,
            segment: Segment.EQUITY,
            instrumentType: 'EQ' as any,
            tickSize: 0.05,
            lotSize: 1,
            lastPrice: 2800.5,
        },
    })

    const niftyFut = await prisma.instrument.upsert({
        where: { instrumentToken: '123456' },
        update: {},
        create: {
            instrumentToken: '123456',
            exchangeToken: '123456',
            tradingSymbol: 'NIFTY24NOVFUT',
            name: 'NIFTY 50 Futures',
            exchange: Exchange.NFO,
            segment: Segment.FUTURES,
            instrumentType: 'FUTIDX' as any,
            tickSize: 0.05,
            lotSize: 50,
            expiry: new Date('2025-11-27'),
            lastPrice: 23450.2,
        },
    })

    console.log('  ✅ Instruments:', reliance.tradingSymbol, ',', niftyFut.tradingSymbol)

    // 4️⃣ BANK ACCOUNTS
    console.log('\n🏦 Creating bank accounts...')

    await prisma.bankAccount.createMany({
        data: [
            {
                userId: rajesh.id,
                accountNumber: '1234567890',
                ifscCode: 'HDFC0000123',
                bankName: 'HDFC Bank',
                branchName: 'Koramangala',
                accountHolderName: 'Rajesh Kumar',
                accountType: BankAccountType.SAVINGS,
                isPrimary: true,
                isVerified: true,
            },
            {
                userId: priya.id,
                accountNumber: '9876543210',
                ifscCode: 'ICIC0000456',
                bankName: 'ICICI Bank',
                branchName: 'Bandra',
                accountHolderName: 'Priya Sharma',
                accountType: BankAccountType.SAVINGS,
                isPrimary: true,
                isVerified: true,
            },
        ],
        skipDuplicates: true,
    })

    // 5️⃣ MARGINS
    console.log('\n💰 Creating margins...')

    await prisma.margin.createMany({
        data: [
            {
                userId: rajesh.id,
                type: Segment.EQUITY,
                availableCash: 100000,
                availableMargin: 120000,
                openingBalance: 100000,
            },
            {
                userId: rajesh.id,
                type: Segment.FUTURES,
                availableCash: 50000,
                availableMargin: 80000,
                openingBalance: 50000,
            },
            {
                userId: priya.id,
                type: Segment.EQUITY,
                availableCash: 50000,
                availableMargin: 60000,
                openingBalance: 50000,
            },
        ],
        skipDuplicates: true,
    })

    // 6️⃣ FUND TRANSACTIONS
    console.log('\n💳 Creating fund transactions...')

    const rajeshBank = await prisma.bankAccount.findFirst({
        where: { userId: rajesh.id, isPrimary: true },
    })

    await prisma.fundTransaction.createMany({
        data: [
            {
                userId: rajesh.id,
                transactionType: FundTransactionType.DEPOSIT,
                amount: 100000,
                status: TransactionStatus.COMPLETED,
                paymentMode: PaymentMode.UPI,
                utrNumber: 'UTR1234567890',
                bankAccountId: rajeshBank?.id,
                remarks: 'Initial deposit',
                processedAt: new Date(),
            },
            {
                userId: priya.id,
                transactionType: FundTransactionType.DEPOSIT,
                amount: 50000,
                status: TransactionStatus.COMPLETED,
                paymentMode: PaymentMode.NET_BANKING,
                utrNumber: 'UTR0987654321',
                remarks: 'Initial deposit',
                processedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    })

    // 7️⃣ PORTFOLIO / HOLDINGS / POSITIONS
    console.log('\n📊 Creating portfolio, holdings and positions...')

    const rajeshPortfolio = await prisma.portfolio.upsert({
        where: { userId: rajesh.id },
        update: {},
        create: {
            userId: rajesh.id,
            totalValue: 150000,
            investedValue: 100000,
            currentValue: 150000,
            dayChange: 2000,
            dayChangePercent: 1.35,
            totalPnl: 50000,
            totalPnlPercent: 50,
        },
    })

    const rajeshHolding = await prisma.holding.upsert({
        where: {
            userId_instrumentId_product: {
                userId: rajesh.id,
                instrumentId: reliance.id,
                product: ProductType.CNC,
            },
        },
        update: {},
        create: {
            userId: rajesh.id,
            instrumentId: reliance.id,
            quantity: 50,
            averagePrice: 2500,
            lastPrice: 2800.5,
            pnl: 15025,
            dayChange: 1000,
            dayChangePercent: 0.72,
            collateralQuantity: 0,
            product: ProductType.CNC,
        },
    })

    const rajeshPosition = await prisma.position.upsert({
        where: {
            userId_instrumentId_product: {
                userId: rajesh.id,
                instrumentId: niftyFut.id,
                product: ProductType.NRML,
            },
        },
        update: {},
        create: {
            userId: rajesh.id,
            instrumentId: niftyFut.id,
            product: ProductType.NRML,
            quantity: 50,
            overnightQuantity: 0,
            averagePrice: 23000,
            lastPrice: 23450.2,
            value: 1172510,
            pnl: 22510,
            m2m: 2000,
            unrealised: 22510,
            realised: 0,
            buyQuantity: 50,
            buyValue: 1150000,
            buyPrice: 23000,
            sellQuantity: 0,
            sellValue: 0,
            sellPrice: 0,
            multiplier: 1,
            tradingSymbol: niftyFut.tradingSymbol,
            exchange: niftyFut.exchange,
            positionType: PositionType.DAY,
        },
    })

    console.log('  ✅ Portfolio ID:', rajeshPortfolio.id)
    console.log('  ✅ Holding ID:', rajeshHolding.id)
    console.log('  ✅ Position ID:', rajeshPosition.id)

    // 8️⃣ ORDERS & TRADES
    console.log('\n🧾 Creating orders & trades...')

    const order1 = await prisma.order.create({
        data: {
            orderId: `ORD0001-${Date.now().toLocaleString()}`,
            userId: rajesh.id,
            instrumentId: reliance.id,
            parentOrderId: null,
            placedBy: 'MP000001',
            variety: 'REGULAR' as any,
            orderType: OrderType.LIMIT,
            transactionType: TransactionType.BUY,
            validity: OrderValidity.DAY,
            product: ProductType.CNC,
            exchange: reliance.exchange,
            tradingSymbol: reliance.tradingSymbol,
            quantity: 50,
            disclosedQuantity: 0,
            price: 2500,
            triggerPrice: 0,
            averagePrice: 2500,
            filledQuantity: 50,
            pendingQuantity: 0,
            cancelledQuantity: 0,
            status: OrderStatus.COMPLETE,
            statusMessage: 'Order executed successfully',
            tag: 'SEED_ORDER',
            clientOrderId: 'CLIENT_ORD_1',
        },
    })

    const trade1 = await prisma.trade.create({
        data: {
            tradeId: 'TRD0001-' + Date.now().toLocaleString(),
            orderId: order1.id,
            userId: rajesh.id,
            instrumentId: reliance.id,
            exchange: reliance.exchange,
            tradingSymbol: reliance.tradingSymbol,
            transactionType: TransactionType.BUY,
            product: ProductType.CNC,
            quantity: 50,
            price: 2500,
            value: 125000,
            exchangeTimestamp: new Date(),
        },
    })

    await prisma.tradeCharges.create({
        data: {
            tradeId: trade1.id,
            brokerage: 20,
            stt: 50,
            exchangeTxnCharge: 10,
            gst: 5,
            sebiTurnover: 1,
            stampDuty: 2,
            totalCharges: 88,
            netAmount: 125000 + 88,
        },
    })

    console.log('  ✅ Order:', order1.orderId, '| Trade:', trade1.tradeId)

    // 9️⃣ GTT ORDERS
    console.log('\n⏰ Creating GTT orders...')

    await prisma.gTTOrder.create({
        data: {
            userId: rajesh.id,
            gttType: GTTType.SINGLE,
            instrumentId: reliance.id,
            tradingSymbol: reliance.tradingSymbol,
            exchange: reliance.exchange,
            triggerType: TriggerType.SINGLE,
            triggerPrice: 2600,
            lastPrice: reliance.lastPrice,
            limitPrice: 2600,
            quantity: 50,
            product: ProductType.CNC,
            orderType: OrderType.LIMIT,
            status: 'ACTIVE',
            expiresAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        },
    })

    // 🔟 WATCHLISTS
    console.log('\n👀 Creating watchlists...')

    const watchlist = await prisma.watchlist.create({
        data: {
            userId: rajesh.id,
            name: 'Core Portfolio',
            isDefault: true,
            groups: {
                create: [
                    {
                        name: 'Equity',
                        color: 1,
                        items: {
                            create: [
                                {
                                    instrumentId: reliance.id,
                                },
                            ],
                        },
                    },
                    {
                        name: 'Futures',
                        color: 2,
                        items: {
                            create: [
                                {
                                    instrumentId: niftyFut.id,
                                },
                            ],
                        },
                    },
                ],
            },
        },
        include: {
            groups: {
                include: { items: true },
            },
        },
    })

    console.log('  ✅ Watchlist:', watchlist.name)

    // 1️⃣1️⃣ BASKETS
    console.log('\n🧺 Creating baskets...')

    await prisma.basket.create({
        data: {
            userId: rajesh.id,
            name: 'Swing Trades',
            description: 'Sample basket for swing trades',
            totalValue: 0,
            isActive: true,
            items: {
                create: [
                    {
                        instrumentId: reliance.id,
                        tradingSymbol: reliance.tradingSymbol,
                        exchange: reliance.exchange,
                        transactionType: TransactionType.BUY,
                        quantity: 10,
                        orderType: OrderType.LIMIT,
                        price: 2600,
                        product: ProductType.MIS,
                    },
                ],
            },
        },
    })

    // 1️⃣2️⃣ ALERTS & NOTIFICATIONS
    console.log('\n🚨 Creating alerts & notifications...')

    await prisma.alert.create({
        data: {
            userId: rajesh.id,
            instrumentId: reliance.id,
            alertType: AlertType.PRICE_ALERT,
            message: 'Price crossed 2700',
            triggerPrice: 2700,
            condition: 'LAST_TRADED_PRICE >= 2700',
            isTriggered: false,
            isRead: false,
            expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
    })

    await prisma.notification.create({
        data: {
            userId: rajesh.id,
            notificationType: NotificationType.ORDER_UPDATE,
            title: 'Order Executed',
            message: `Your order ${order1.orderId} for ${reliance.tradingSymbol} has been executed.`,
            isRead: false,
            priority: Priority.NORMAL,
        },
    })

    // 1️⃣3️⃣ DAILY PNL
    console.log('\n📆 Creating daily PnL...')

    await prisma.dailyPnL.create({
        data: {
            userId: rajesh.id,
            date: new Date(),
            realizedPnl: 5000,
            unrealizedPnl: 20000,
            totalPnl: 25000,
            equityPnl: 15000,
            foPnl: 10000,
            commodityPnl: 0,
            charges: 200,
        },
    })

    // 1️⃣4️⃣ SUPPORT TICKETS
    console.log('\n🎫 Creating support tickets...')

    await prisma.supportTicket.create({
        data: {
            userId: rajesh.id,
            staffId: ceoStaff.id,
            subject: 'Issue with fund withdrawal',
            description: 'Withdrawal request not reflecting in bank account.',
            attachments: [],
            status: 'OPEN',
            priority: Priority.HIGH,
        },
    })

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📝 Login credentials:')
    console.log('   Staff Email:', ceoStaff.email)
    console.log('   Staff Password:', plainPassword)
    console.log('\n   User Password (all users):', 'User@123')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
