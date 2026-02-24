-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "altPhone" TEXT,
    "cnic" TEXT,
    "address" TEXT,
    "siteLocation" TEXT,
    "customerType" TEXT NOT NULL DEFAULT 'individual',
    "paymentTerms" INTEGER DEFAULT 0,
    "creditLimit" REAL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BrickGrade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameEn" TEXT NOT NULL,
    "nameLocal" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "defaultRate" REAL,
    "trackStock" BOOLEAN NOT NULL DEFAULT true,
    "isWastage" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "StockLedger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradeId" INTEGER NOT NULL,
    "transactionType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "referenceType" TEXT,
    "referenceId" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockLedger_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "BrickGrade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SaleDispatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dispatchDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "challanNo" TEXT,
    "siteLocation" TEXT,
    "vehicleType" TEXT,
    "vehicleNo" TEXT,
    "driverName" TEXT,
    "subtotal" REAL NOT NULL,
    "transportCost" REAL NOT NULL DEFAULT 0,
    "loadingCost" REAL NOT NULL DEFAULT 0,
    "discount" REAL NOT NULL DEFAULT 0,
    "totalAmount" REAL NOT NULL,
    "paymentType" TEXT NOT NULL,
    "amountReceived" REAL NOT NULL DEFAULT 0,
    "balanceDue" REAL NOT NULL DEFAULT 0,
    "dueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'open',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SaleDispatch_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SaleDispatchItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dispatchId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'pieces',
    "rate" REAL NOT NULL,
    "amount" REAL NOT NULL,
    CONSTRAINT "SaleDispatchItem_dispatchId_fkey" FOREIGN KEY ("dispatchId") REFERENCES "SaleDispatch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SaleDispatchItem_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "BrickGrade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentAllocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paymentId" INTEGER NOT NULL,
    "dispatchId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    CONSTRAINT "PaymentAllocation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PaymentAllocation_dispatchId_fkey" FOREIGN KEY ("dispatchId") REFERENCES "SaleDispatch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
