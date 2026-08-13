/* =========================================================
   PEDDLE PLUS ONE ERP
   FINAL PRICING CALCULATOR JS
   ========================================================= */


/* =========================================================
   PRICES
========================================================= */

const PRICES = {

    additionalSystemUser: 5000,

    cloudYearly: 10000,

    customizationPerManDay: 3500,

    extraCloudStoragePerGB: 5000,

    licenseTransferPerLicense: 2000,

    gst: 18,

    amc: 25

};


/* =========================================================
   ERP PACKAGES
========================================================= */

const packages = {

    "Retail": [

        {
            name: "Single Store Retail Billing & Inventory",
            price: 15000,
            coverage: "1 Store",
            recommended: "Single retail outlet"
        },

        {
            name: "Multi-Store Retail",
            price: 50000,
            coverage: "Up to 5 Stores",
            recommended: "Growing retail chains"
        }

    ],


    "Wholesale & Distribution": [

        {
            name: "Wholesale Distribution",
            price: 25000,
            coverage: "Single Location",
            recommended: "Wholesale businesses"
        },

        {
            name: "Multi-Location Wholesale Distribution",
            price: 75000,
            coverage: "Up to 5 Locations + Warehouse",
            recommended: "Distributors"
        }

    ],


    "Retail + Wholesale": [

        {
            name: "Retail + Wholesale",
            price: 35000,
            coverage: "Single Location",
            recommended: "Hybrid businesses"
        },

        {
            name: "Multi-Location Retail + Wholesale",
            price: 125000,
            coverage: "Up to 5 Locations",
            recommended: "Growing hybrid operations"
        }

    ],


    "Manufacturing": [

        {
            name: "Manufacturing ERP",
            price: 75000,
            coverage: "Manufacturing",
            recommended: "Manufacturers"
        },

        {
            name: "Manufacturing + Retail + Wholesale ERP",
            price: 225000,
            coverage: "Complete Business",
            recommended: "Integrated operations"
        }

    ]

};


/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const QUOTATION_HISTORY_KEY =
    "peddlePlusSavedQuotations";

const QUOTATION_SEQUENCE_KEY =
    "peddlePlusQuotationSequence";


/* =========================================================
   HELPERS
========================================================= */

function el(id) {

    return document.getElementById(id);

}


function value(id) {

    const node = el(id);

    return node
        ? String(node.value || "").trim()
        : "";

}


function num(id) {

    const n = Number(value(id));

    return Number.isFinite(n)
        ? n
        : 0;

}


function setText(id, text) {

    const node = el(id);

    if (node) {

        node.textContent = text;

    }

}


function money(amount) {

    return (
        "₹" +
        Number(amount || 0).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 0
            }
        )
    );

}


/* =========================================================
   CHECKBOX
========================================================= */

function getChecked(name) {

    return Array.from(
        document.querySelectorAll(
            `input[name="${name}"]:checked`
        )
    ).map(
        checkbox => checkbox.value
    );

}


/* =========================================================
   ERP PACKAGE LOADING
========================================================= */

function loadPackages() {

    const category =
        value("category");

    const packageSelect =
        el("package");


    if (!packageSelect) {

        return;

    }


    packageSelect.innerHTML = "";


    const list =
        packages[category] || [];


    if (!list.length) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "No ERP Package Available";

        packageSelect.appendChild(option);

        showPackageInfo();

        return;

    }


    list.forEach(
        (item, index) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                index;


            option.textContent =
                item.name +
                " - " +
                money(item.price);


            packageSelect.appendChild(
                option
            );

        }
    );


    showPackageInfo();

}


/* =========================================================
   PACKAGE INFO
========================================================= */

function showPackageInfo() {

    const category =
        value("category");


    const packageIndex =
        Number(value("package"));


    const item =
        packages[
            category
        ]?.[
            packageIndex
        ];


    setText(
        "packageInfo",

        item
            ? `Coverage: ${item.coverage} | Recommended For: ${item.recommended}`
            : ""
    );

}


/* =========================================================
   SYSTEM USER INFO
========================================================= */

function updateSystemUserInfo() {

    const users =
        Math.max(
            num("users"),
            1
        );


    const extra =
        Math.max(
            users - 1,
            0
        );


    if (extra === 0) {

        setText(
            "systemUserInfo",
            "1 System User Included"
        );

    }
    else {

        setText(
            "systemUserInfo",

            `${extra} Additional System User(s) × ₹5,000 = ${money(
                extra *
                PRICES.additionalSystemUser
            )}`

        );

    }

}


/* =========================================================
   SERVER INFO
========================================================= */

function updateServerInfo() {

    const server =
        value("server");


    if (
        server === "Cloud Server"
    ) {

        setText(
            "cloudInfo",
            "Online Cloud Subscription: ₹10,000 / Year"
        );

    }
    else {

        setText(
            "cloudInfo",
            "Local Server - Offline"
        );

    }

}


/* =========================================================
   MARKETPLACE
========================================================= */

function getMarketplace() {

    return Array.from(
        document.querySelectorAll(
            ".platform-check:checked"
        )
    ).map(
        item => {

            return {

                name:
                    item.dataset.name,

                price:
                    Number(
                        item.dataset.price
                    ) || 0

            };

        }
    );

}


/* =========================================================
   PRICE ROW
========================================================= */

function setRow(
    rowId,
    amountId,
    amount
) {

    const row =
        el(rowId);


    const amountNode =
        el(amountId);


    if (!row) {

        return;

    }


    if (amountNode) {

        amountNode.textContent =
            money(amount);

    }


    row.style.display =
        Number(amount) > 0
            ? "grid"
            : "none";

}


/* =========================================================
   ROW VISIBILITY
========================================================= */

function setRowVisibility(
    rowId,
    show
) {

    const row =
        el(rowId);


    if (row) {

        row.style.display =
            show
                ? "grid"
                : "none";

    }

}


/* =========================================================
   QUOTATION NUMBER
========================================================= */

function getNextQuotationNumber() {

    let sequence =
        Number(
            localStorage.getItem(
                QUOTATION_SEQUENCE_KEY
            )
        );


    if (
        !Number.isFinite(sequence) ||
        sequence < 1000
    ) {

        sequence = 1000;

    }
    else {

        sequence += 1;

    }


    localStorage.setItem(
        QUOTATION_SEQUENCE_KEY,
        sequence
    );


    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        date.getMonth() + 1;


    let startYear;


    if (month >= 4) {

        startYear =
            year % 100;

    }
    else {

        startYear =
            (year - 1) % 100;

    }


    const endYear =
        String(
            (startYear + 1) % 100
        ).padStart(
            2,
            "0"
        );


    return (
        "NR/SK/PP/" +
        String(
            startYear
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        endYear +
        "/" +
        sequence
    );

}


/* =========================================================
   DATE
========================================================= */

function today() {

    return new Date()
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

}


/* =========================================================
   SAVE QUOTATION HISTORY
========================================================= */

function saveQuotation(data) {

    let quotations = [];


    try {

        quotations =
            JSON.parse(
                localStorage.getItem(
                    QUOTATION_HISTORY_KEY
                )
            ) || [];

    }
    catch {

        quotations = [];

    }


    quotations.unshift(data);


    quotations =
        quotations.slice(
            0,
            100
        );


    localStorage.setItem(
        QUOTATION_HISTORY_KEY,
        JSON.stringify(quotations)
    );

}


/* =========================================================
   CALCULATE PRICE
========================================================= */

function calculatePrice() {


    /* -----------------------------------------------------
       CUSTOMER
    ----------------------------------------------------- */

    const customer =
        value("customer");

    const company =
        value("company");

    const mobile =
        value("mobile");

    const city =
        value("city");


    if (
        !customer ||
        !company ||
        !mobile ||
        !city
    ) {

        alert(
            "Please fill Customer Name, Company Name, Mobile Number and City."
        );

        return;

    }


    /* -----------------------------------------------------
       BUSINESS
    ----------------------------------------------------- */

    const businessTypes =
        getChecked("businessType");


    const segmentTypes =
        getChecked("segmentType");


    /* -----------------------------------------------------
       BASIC
    ----------------------------------------------------- */

    const stores =
        Math.max(
            num("stores"),
            1
        );


    const users =
        Math.max(
            num("users"),
            1
        );


    const companies =
        Math.max(
            num("multiCompany"),
            1
        );


    const server =
        value("server");


    /* -----------------------------------------------------
       PACKAGE
    ----------------------------------------------------- */

    const category =
        value("category");


    const packageIndex =
        Number(
            value("package")
        );


    const selectedPackage =
        packages[
            category
        ]?.[
            packageIndex
        ];


    if (!selectedPackage) {

        alert(
            "Please select an ERP package."
        );

        return;

    }


    const basePackagePrice =
        Number(
            selectedPackage.price
        );


    /* -----------------------------------------------------
       MULTI COMPANY
    ----------------------------------------------------- */

    const softwareLicenseValue =
        basePackagePrice *
        companies;


    /* -----------------------------------------------------
       USERS
    ----------------------------------------------------- */

    const additionalUsers =
        Math.max(
            users - 1,
            0
        );


    const userAddon =
        additionalUsers *
        PRICES.additionalSystemUser;


    /* -----------------------------------------------------
       CLOUD
    ----------------------------------------------------- */

    const cloudPrice =
        server === "Cloud Server"
            ? PRICES.cloudYearly
            : 0;


    /* -----------------------------------------------------
       ADDONS
    ----------------------------------------------------- */

    const ecommerce =
        num("ecommerce");


    const shopify =
        num("shopify");


    const unicommerce =
        num("unicommerce");


    const marketplaces =
        getMarketplace();


    const marketplaceTotal =
        marketplaces.reduce(
            (
                total,
                item
            ) =>
                total +
                item.price,
            0
        );


    /* -----------------------------------------------------
       CUSTOMIZATION
    ----------------------------------------------------- */

    const customizationDays =
        num("customization");


    const customization =
        customizationDays *
        PRICES.customizationPerManDay;


    /* -----------------------------------------------------
       STORAGE
    ----------------------------------------------------- */

    const storageGB =
        num("cloudStorage");


    const cloudStorage =
        storageGB *
        PRICES.extraCloudStoragePerGB;


    /* -----------------------------------------------------
       LICENSE TRANSFER
    ----------------------------------------------------- */

    const transferQuantity =
        num("licenseTransfer");


    const licenseTransfer =
        transferQuantity *
        PRICES.licenseTransferPerLicense;


    /* -----------------------------------------------------
       DISCOUNT
    ----------------------------------------------------- */

    const discountPercent =
        Math.min(
            Math.max(
                num("discount"),
                0
            ),
            100
        );


    /* -----------------------------------------------------
       SUBTOTAL
    ----------------------------------------------------- */

    const subtotal =

        softwareLicenseValue +

        userAddon +

        cloudPrice +

        ecommerce +

        shopify +

        marketplaceTotal +

        unicommerce +

        customization +

        cloudStorage +

        licenseTransfer;


    const discountAmount =
        subtotal *
        discountPercent /
        100;


    const taxableAmount =
        subtotal -
        discountAmount;


    const gst =
        taxableAmount *
        PRICES.gst /
        100;


    const grandTotal =
        taxableAmount +
        gst;


    /* =====================================================
       RENEWAL
    ===================================================== */

    const renewalAMC =
        softwareLicenseValue *
        PRICES.amc /
        100;


    const renewalCloud =
        server === "Cloud Server"
            ? PRICES.cloudYearly
            : 0;


    const renewalTaxable =
        renewalAMC +
        renewalCloud;


    const renewalGST =
        renewalTaxable *
        PRICES.gst /
        100;


    const renewalTotal =
        renewalTaxable +
        renewalGST;


    /* =====================================================
       QUOTATION
    ===================================================== */

    const quotationNo =
        getNextQuotationNumber();


    const quotationDate =
        today();


    /* -----------------------------------------------------
       CUSTOMER DETAILS
    ----------------------------------------------------- */

    setText(
        "fQuotationNo",
        quotationNo
    );


    setText(
        "fQuotationDate",
        quotationDate
    );


    setText(
        "fCustomer",
        customer
    );


    setText(
        "fCompany",
        company
    );


    setText(
        "fMobile",
        mobile
    );


    setText(
        "fEmail",
        value("email")
    );


    const fullAddress =
        [
            value("address1"),
            value("address2")
        ]
        .filter(Boolean)
        .join(", ");


    setText(
        "fAddress",
        fullAddress || "-"
    );


    setText(
        "fCity",
        city
    );


    setText(
        "fState",
        value("state")
    );


    setText(
        "fPincode",
        value("pincode")
    );


    setText(
        "fGSTIN",
        value("gstin")
    );


    /* -----------------------------------------------------
       BUSINESS DETAILS
    ----------------------------------------------------- */

    setText(
        "fBusiness",
        businessTypes.length
            ? businessTypes.join(", ")
            : "-"
    );


    setText(
        "fSegment",
        segmentTypes.length
            ? segmentTypes.join(", ")
            : "-"
    );


    setText(
        "fStores",
        stores
    );


    setText(
        "fUsers",
        users
    );


    setText(
        "fCompanies",
        companies
    );


    setText(
        "fServer",

        server === "Cloud Server"
            ? "Cloud Server - Online"
            : "Local Server - Offline"

    );


    /* -----------------------------------------------------
       ERP PACKAGE
    ----------------------------------------------------- */

    const packageLabel =
        `${selectedPackage.name} (${selectedPackage.coverage})`;


    setText(
        "packageDescription",
        packageLabel
    );


    /* -----------------------------------------------------
       PRICE ROWS
    ----------------------------------------------------- */

    setRow(
        "rowPackage",
        "fPackage",
        softwareLicenseValue
    );


    setRow(
        "rowUsers",
        "fUsersAddon",
        userAddon
    );


    setRow(
        "rowCloud",
        "fCloud",
        cloudPrice
    );


    setRow(
        "rowEcommerce",
        "fEcommerce",
        ecommerce
    );


    setRow(
        "rowShopify",
        "fShopify",
        shopify
    );


    setRow(
        "rowUnicommerce",
        "fUnicommerce",
        unicommerce
    );


    setRow(
        "rowCustomization",
        "fCustomization",
        customization
    );


    setRow(
        "rowStorage",
        "fStorage",
        cloudStorage
    );


    setRow(
        "rowTransfer",
        "fTransfer",
        licenseTransfer
    );


    /* -----------------------------------------------------
       MARKETPLACE ROWS
    ----------------------------------------------------- */

    const platformContainer =
        el("platformQuotationRows");


    if (platformContainer) {

        platformContainer.innerHTML = "";


        marketplaces.forEach(
            item => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "charge-row";


                const name =
                    document.createElement(
                        "span"
                    );


                name.textContent =
                    item.name +
                    " Integration";


                const price =
                    document.createElement(
                        "strong"
                    );


                price.textContent =
                    money(item.price);


                row.appendChild(name);

                row.appendChild(price);

                platformContainer.appendChild(row);

            }
        );

    }


    /* -----------------------------------------------------
       TOTALS
    ----------------------------------------------------- */

    setText(
        "fSubtotal",
        money(subtotal)
    );


    setText(
        "fDiscount",
        "-" +
        money(discountAmount)
    );


    setText(
        "fTaxable",
        money(taxableAmount)
    );


    setText(
        "fGST",
        money(gst)
    );


    setText(
        "fTotal",
        money(grandTotal)
    );


    /* -----------------------------------------------------
       DISCOUNT ROW
    ----------------------------------------------------- */

    const discountRow =
        el("rowDiscount");


    if (discountRow) {

        discountRow.style.display =
            discountAmount > 0
                ? "grid"
                : "none";

    }


    /* -----------------------------------------------------
       RENEWAL
    ----------------------------------------------------- */

    setText(
        "fRenewalAMC",
        money(renewalAMC)
    );


    setText(
        "fRenewalCloud",
        money(renewalCloud)
    );


    setRowVisibility(
        "rowRenewalCloud",
        renewalCloud > 0
    );


    setText(
        "fRenewalGST",
        money(renewalGST)
    );


    setText(
        "fRenewalTotal",
        money(renewalTotal)
    );


    /* =====================================================
       SAVE QUOTATION HISTORY
    ===================================================== */

    saveQuotation({

        quotationNo,

        date:
            quotationDate,

        customer,

        company,

        mobile,

        email:
            value("email"),

        address:
            fullAddress,

        city,

        state:
            value("state"),

        pincode:
            value("pincode"),

        gstin:
            value("gstin"),

        businessTypes,

        segmentTypes,

        stores,

        users,

        companies,

        server,

        category,

        package:
            selectedPackage.name,

        packagePrice:
            basePackagePrice,

        softwareLicenseValue,

        userAddon,

        cloudPrice,

        ecommerce,

        shopify,

        marketplaces,

        marketplaceTotal,

        unicommerce,

        customizationDays,

        customization,

        storageGB,

        cloudStorage,

        transferQuantity,

        licenseTransfer,

        discountPercent,

        discountAmount,

        taxableAmount,

        gst,

        grandTotal,

        renewalAMC,

        renewalCloud,

        renewalGST,

        renewalTotal

    });


    /* -----------------------------------------------------
       SHOW QUOTATION
    ----------------------------------------------------- */

    const quotation =
        el("quotationFooter");


    if (quotation) {

        quotation.classList.add(
            "show"
        );


        setTimeout(
            () => {

                quotation.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            },
            100
        );

    }

}


/* =========================================================
   WHATSAPP
========================================================= */

function shareWhatsApp() {

    const quotationNo =
        el("fQuotationNo")?.textContent ||
        "-";


    const business =
        getChecked(
            "businessType"
        ).join(", ") || "-";


    const segment =
        getChecked(
            "segmentType"
        ).join(", ") || "-";


    const companies =
        Math.max(
            num("multiCompany"),
            1
        );


    const users =
        Math.max(
            num("users"),
            1
        );


    const server =
        value("server") === "Cloud Server"

            ? "Cloud Server - Online"

            : "Local Server - Offline";


    const packageName =
        el("packageDescription")?.textContent ||
        "-";


    const total =
        el("fTotal")?.textContent ||
        "₹0";


    const message =

`Peddle Plus One ERP - Quotation

Quotation No.: ${quotationNo}

Customer: ${value("customer")}

Company: ${value("company")}

Mobile: ${value("mobile")}

Business Type: ${business}

Segment Type: ${segment}

ERP Package: ${packageName}

Number of Companies: ${companies}

Number of System Users: ${users}

Server: ${server}

Grand Total: ${total}

Thank you for considering Peddle Plus One ERP.`;


    window.open(

        "https://wa.me/?text=" +
        encodeURIComponent(message),

        "_blank"

    );

}


/* =========================================================
   PRINT
========================================================= */

function printQuotation() {

    const quotation =
        el("quotationFooter");


    if (
        !quotation ||
        !quotation.classList.contains("show")
    ) {

        alert(
            "Please calculate the quotation first."
        );

        return;

    }


    window.print();

}


/* =====================================================
   DOWNLOAD PDF - SAME QUOTATION DESIGN
   ===================================================== */

async function downloadPDF() {

    const quotation = document.getElementById("quotationFooter");

    if (
        !quotation ||
        !quotation.classList.contains("show")
    ) {
        alert("Please calculate the quotation first.");
        return;
    }

    if (
        typeof html2canvas === "undefined" ||
        typeof window.jspdf === "undefined"
    ) {
        alert(
            "PDF library load nahi hui. Internet ON karke page reload karein."
        );
        return;
    }

    const quotationNo =
        document.getElementById("fQuotationNo")?.textContent ||
        "quotation";

    const fileName =
        `quotation-${String(quotationNo)
            .replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;

    /* -------------------------------------------------
       TEMP PDF AREA
       Original quotation ka exact design use hoga
       ------------------------------------------------- */

    const pdfArea = quotation.cloneNode(true);

    pdfArea.id = "pdfQuotationArea";

    pdfArea.style.display = "block";
    pdfArea.style.position = "absolute";
    pdfArea.style.left = "-100000px";
    pdfArea.style.top = "0";
    pdfArea.style.width = "794px";
    pdfArea.style.maxWidth = "794px";
    pdfArea.style.background = "#ffffff";
    pdfArea.style.margin = "0";
    pdfArea.style.padding = "0";

    /* -------------------------------------------------
       Customer ke alawa quotation ka complete format
       maintain rahega
       ------------------------------------------------- */

    document.body.appendChild(pdfArea);

    /* -------------------------------------------------
       Images / QR / Logo ko properly load hone do
       ------------------------------------------------- */

    const images =
        Array.from(
            pdfArea.querySelectorAll("img")
        );

    await Promise.all(
        images.map(
            img => {

                if (img.complete) {
                    return Promise.resolve();
                }

                return new Promise(
                    resolve => {

                        img.onload = resolve;
                        img.onerror = resolve;

                    }
                );

            }
        )
    );

    /* -------------------------------------------------
       Small delay for fonts / layout
       ------------------------------------------------- */

    await new Promise(
        resolve =>
            setTimeout(resolve, 300)
    );

    try {

        const canvas =
            await html2canvas(
                pdfArea,
                {
                    scale: 2,

                    useCORS: true,

                    allowTaint: true,

                    backgroundColor: "#ffffff",

                    logging: false,

                    windowWidth: 794
                }
            );

        const {
            jsPDF
        } = window.jspdf;

        const pdf =
            new jsPDF(
                {
                    orientation: "portrait",

                    unit: "mm",

                    format: "a4"
                }
            );

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        const margin = 0;

        const imgWidth =
            pageWidth;

        const imgHeight =
            canvas.height *
            imgWidth /
            canvas.width;

        let heightLeft =
            imgHeight;

        let position = 0;

        const imgData =
            canvas.toDataURL(
                "image/jpeg",
                0.95
            );

        /* -------------------------------------------------
           FIRST PAGE
           ------------------------------------------------- */

        pdf.addImage(
            imgData,
            "JPEG",
            margin,
            position,
            imgWidth,
            imgHeight,
            undefined,
            "FAST"
        );

        heightLeft -= pageHeight;

        /* -------------------------------------------------
           MULTIPLE PAGES
           ------------------------------------------------- */

        while (
            heightLeft > 0
        ) {

            position =
                heightLeft -
                imgHeight;

            pdf.addPage();

            pdf.addImage(
                imgData,
                "JPEG",
                margin,
                position,
                imgWidth,
                imgHeight,
                undefined,
                "FAST"
            );

            heightLeft -=
                pageHeight;
        }

        /* -------------------------------------------------
           SAVE
           ------------------------------------------------- */

        pdf.save(fileName);

    } catch (error) {

        console.error(
            "PDF generation error:",
            error
        );

        alert(
            "PDF generate nahi ho paya. Console me error check karein."
        );

    } finally {

        /* -------------------------------------------------
           TEMP AREA DELETE
           ------------------------------------------------- */

        if (pdfArea) {
            pdfArea.remove();
        }

    }
    /* -----------------------------------------------------
       jsPDF available
    ----------------------------------------------------- */

    if (
        window.jspdf &&
        window.jspdf.jsPDF
    ) {

        const {
            jsPDF
        } = window.jspdf;


        const doc =
            new jsPDF({

                orientation: "portrait",

                unit: "pt",

                format: "a4"

            });


        const pageWidth =
            doc.internal.pageSize.getWidth();


        const pageHeight =
            doc.internal.pageSize.getHeight();


        const margin = 40;

        const lineHeight = 16;

        let y = 50;


        function checkPage() {

            if (
                y >
                pageHeight - 50
            ) {

                doc.addPage();

                y = 50;

            }

        }


        function addSectionTitle(title) {

            checkPage();


            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.setFontSize(12);


            doc.setTextColor(
                7,
                85,
                181
            );


            doc.text(
                title,
                margin,
                y
            );


            y += 22;

        }


        function addKeyValue(
            label,
            val
        ) {

            checkPage();


            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.setFontSize(10);


            doc.setTextColor(
                0,
                0,
                0
            );


            const text =
                `${label}: ${val || "-"}`;


            const lines =
                doc.splitTextToSize(
                    text,
                    pageWidth -
                    margin * 2
                );


            doc.text(
                lines,
                margin,
                y
            );


            y +=
                lineHeight *
                lines.length;

        }


        /* HEADER */

        doc.setFillColor(
            216,
            27,
            140
        );


        doc.rect(
            0,
            0,
            pageWidth,
            40,
            "F"
        );


        doc.setTextColor(
            255,
            255,
            255
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(18);


        doc.text(
            "Peddle Plus One ERP",
            margin,
            25
        );


        doc.setFontSize(10);


        doc.text(
            "Quotation",
            pageWidth -
            margin -
            60,
            25
        );


        doc.setTextColor(
            0,
            0,
            0
        );


        y = 60;


        /* QUOTATION */

        addSectionTitle(
            "Quotation Details"
        );


        addKeyValue(
            "Quotation No",
            el("fQuotationNo")?.textContent
        );


        addKeyValue(
            "Date",
            el("fQuotationDate")?.textContent
        );


        addKeyValue(
            "Customer",
            el("fCustomer")?.textContent
        );


        addKeyValue(
            "Company",
            el("fCompany")?.textContent
        );


        addKeyValue(
            "Mobile",
            el("fMobile")?.textContent
        );


        addKeyValue(
            "Email",
            el("fEmail")?.textContent
        );


        addKeyValue(
            "Address",
            el("fAddress")?.textContent
        );


        addKeyValue(
            "City",
            el("fCity")?.textContent
        );


        addKeyValue(
            "State",
            el("fState")?.textContent
        );


        addKeyValue(
            "Pincode",
            el("fPincode")?.textContent
        );


        addKeyValue(
            "GSTIN",
            el("fGSTIN")?.textContent
        );


        y += 10;


        /* BUSINESS */

        addSectionTitle(
            "Business Details"
        );


        addKeyValue(
            "Business",
            el("fBusiness")?.textContent
        );


        addKeyValue(
            "Segment",
            el("fSegment")?.textContent
        );


        addKeyValue(
            "Stores",
            el("fStores")?.textContent
        );


        addKeyValue(
            "System Users",
            el("fUsers")?.textContent
        );


        addKeyValue(
            "Companies",
            el("fCompanies")?.textContent
        );


        addKeyValue(
            "Server",
            el("fServer")?.textContent
        );


        addKeyValue(
            "ERP Package",
            el("packageDescription")?.textContent
        );


        y += 10;


        /* PRICING */

        addSectionTitle(
            "Pricing Summary"
        );


        addKeyValue(
            "ERP Package",
            el("fPackage")?.textContent
        );


        addKeyValue(
            "Additional Users",
            el("fUsersAddon")?.textContent
        );


        addKeyValue(
            "Cloud",
            el("fCloud")?.textContent
        );


        addKeyValue(
            "E-Commerce",
            el("fEcommerce")?.textContent
        );


        addKeyValue(
            "Shopify",
            el("fShopify")?.textContent
        );


        addKeyValue(
            "Unicommerce",
            el("fUnicommerce")?.textContent
        );


        addKeyValue(
            "Customization",
            el("fCustomization")?.textContent
        );


        addKeyValue(
            "Cloud Storage",
            el("fStorage")?.textContent
        );


        addKeyValue(
            "License Transfer",
            el("fTransfer")?.textContent
        );


        /* MARKETPLACES */

        const marketplaceRows =
            document.querySelectorAll(
                "#platformQuotationRows .charge-row"
            );


        marketplaceRows.forEach(
            row => {

                const text =
                    row.textContent
                        .replace(
                            /\s+/g,
                            " "
                        )
                        .trim();


                addKeyValue(
                    "Integration",
                    text
                );

            }
        );


        y += 10;


        /* TOTAL */

        addSectionTitle(
            "Total"
        );


        addKeyValue(
            "Subtotal",
            el("fSubtotal")?.textContent
        );


        addKeyValue(
            "Discount",
            el("fDiscount")?.textContent
        );


        addKeyValue(
            "Taxable Amount",
            el("fTaxable")?.textContent
        );


        addKeyValue(
            "GST",
            el("fGST")?.textContent
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(13);


        doc.setTextColor(
            216,
            27,
            140
        );


        checkPage();


        doc.text(
            `Grand Total: ${
                el("fTotal")?.textContent || "₹0"
            }`,
            margin,
            y
        );


        y += 25;


        /* RENEWAL */

        addSectionTitle(
            "Renewal / Next Year"
        );


        addKeyValue(
            "AMC Renewal",
            el("fRenewalAMC")?.textContent
        );


        addKeyValue(
            "Cloud Renewal",
            el("fRenewalCloud")?.textContent
        );


        addKeyValue(
            "GST",
            el("fRenewalGST")?.textContent
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(13);


        doc.setTextColor(
            216,
            27,
            140
        );


        checkPage();


        doc.text(
            `Renewal Total: ${
                el("fRenewalTotal")?.textContent || "₹0"
            }`,
            margin,
            y
        );


        /* FOOTER */

        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(8);


        doc.setTextColor(
            100,
            100,
            100
        );


        doc.text(
            "Peddle Plus One ERP",
            margin,
            pageHeight - 20
        );


        doc.save(
            fileName
        );


        return;

    }


    /* -----------------------------------------------------
       jsPDF NOT AVAILABLE
       Open print dialog so user can Save as PDF
    ----------------------------------------------------- */

    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to download the quotation PDF."
        );

        return;

    }


    const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>${fileName}</title>

<style>

body {

    font-family: Arial, sans-serif;

    padding: 30px;

    color: #18324D;

}

.header {

    background: #D81B8C;

    color: white;

    padding: 15px;

    font-size: 22px;

    font-weight: bold;

    margin-bottom: 20px;

}

.section {

    border: 1px solid #D5E0EC;

    border-radius: 8px;

    padding: 15px;

    margin-bottom: 15px;

}

h2 {

    color: #0755B5;

    margin-top: 0;

}

.row {

    margin: 7px 0;

}

.label {

    font-weight: bold;

}

.total {

    font-size: 18px;

    font-weight: bold;

    color: #D81B8C;

}

@media print {

    body {

        padding: 10px;

    }

}

</style>

</head>

<body>

<div class="header">

Peddle Plus One ERP - Quotation

</div>


<div class="section">

<h2>Quotation Details</h2>

<div class="row">
<span class="label">Quotation No:</span>
${el("fQuotationNo")?.textContent || ""}
</div>

<div class="row">
<span class="label">Date:</span>
${el("fQuotationDate")?.textContent || ""}
</div>

<div class="row">
<span class="label">Customer:</span>
${el("fCustomer")?.textContent || ""}
</div>

<div class="row">
<span class="label">Company:</span>
${el("fCompany")?.textContent || ""}
</div>

<div class="row">
<span class="label">Mobile:</span>
${el("fMobile")?.textContent || ""}
</div>

<div class="row">
<span class="label">Email:</span>
${el("fEmail")?.textContent || ""}
</div>

<div class="row">
<span class="label">Address:</span>
${el("fAddress")?.textContent || ""}
</div>

<div class="row">
<span class="label">City:</span>
${el("fCity")?.textContent || ""}
</div>

<div class="row">
<span class="label">State:</span>
${el("fState")?.textContent || ""}
</div>

<div class="row">
<span class="label">Pincode:</span>
${el("fPincode")?.textContent || ""}
</div>

<div class="row">
<span class="label">GSTIN:</span>
${el("fGSTIN")?.textContent || ""}
</div>

</div>


<div class="section">

<h2>Business Details</h2>

<div class="row">
<span class="label">Business:</span>
${el("fBusiness")?.textContent || ""}
</div>

<div class="row">
<span class="label">Segment:</span>
${el("fSegment")?.textContent || ""}
</div>

<div class="row">
<span class="label">Stores:</span>
${el("fStores")?.textContent || ""}
</div>

<div class="row">
<span class="label">System Users:</span>
${el("fUsers")?.textContent || ""}
</div>

<div class="row">
<span class="label">Companies:</span>
${el("fCompanies")?.textContent || ""}
</div>

<div class="row">
<span class="label">Server:</span>
${el("fServer")?.textContent || ""}
</div>

<div class="row">
<span class="label">ERP Package:</span>
${el("packageDescription")?.textContent || ""}
</div>

</div>


<div class="section">

<h2>Pricing Summary</h2>

<div class="row">
<span class="label">ERP Package:</span>
${el("fPackage")?.textContent || ""}
</div>

<div class="row">
<span class="label">Additional Users:</span>
${el("fUsersAddon")?.textContent || ""}
</div>

<div class="row">
<span class="label">Cloud:</span>
${el("fCloud")?.textContent || ""}
</div>

<div class="row">
<span class="label">E-Commerce:</span>
${el("fEcommerce")?.textContent || ""}
</div>

<div class="row">
<span class="label">Shopify:</span>
${el("fShopify")?.textContent || ""}
</div>

<div class="row">
<span class="label">Unicommerce:</span>
${el("fUnicommerce")?.textContent || ""}
</div>

<div class="row">
<span class="label">Customization:</span>
${el("fCustomization")?.textContent || ""}
</div>

<div class="row">
<span class="label">Cloud Storage:</span>
${el("fStorage")?.textContent || ""}
</div>

<div class="row">
<span class="label">License Transfer:</span>
${el("fTransfer")?.textContent || ""}
</div>

<div class="row">
<span class="label">Subtotal:</span>
${el("fSubtotal")?.textContent || ""}
</div>

<div class="row">
<span class="label">Discount:</span>
${el("fDiscount")?.textContent || ""}
</div>

<div class="row">
<span class="label">Taxable Amount:</span>
${el("fTaxable")?.textContent || ""}
</div>

<div class="row">
<span class="label">GST:</span>
${el("fGST")?.textContent || ""}
</div>

<div class="total">

Grand Total:
${el("fTotal")?.textContent || ""}

</div>

</div>


<div class="section">

<h2>Renewal / Next Year</h2>

<div class="row">
<span class="label">AMC Renewal:</span>
${el("fRenewalAMC")?.textContent || ""}
</div>

<div class="row">
<span class="label">Cloud Renewal:</span>
${el("fRenewalCloud")?.textContent || ""}
</div>

<div class="row">
<span class="label">GST:</span>
${el("fRenewalGST")?.textContent || ""}
</div>

<div class="total">

Renewal Total:
${el("fRenewalTotal")?.textContent || ""}

</div>

</div>


<script>

window.onload = function() {

    setTimeout(function() {

        window.print();

    }, 500);

};

</script>

</body>

</html>

`;


    printWindow.document.open();

    printWindow.document.write(html);

    printWindow.document.close();

}


/* =========================================================
   NEW QUOTATION / CLEAR FORM
========================================================= */

function clearQuotationData() {

    const confirmed =
        confirm(
            "Are you sure you want to create a new quotation?\n\nAll current customer and quotation fields will be cleared."
        );


    if (!confirmed) {

        return;

    }


    /* -----------------------------------------------------
       IMPORTANT:
       Remove old auto-save data if it exists
    ----------------------------------------------------- */

    localStorage.removeItem(
        "peddlePlusQuotationData"
    );


    /* -----------------------------------------------------
       Reset all form fields
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(
            field => {

                if (
                    field.type === "checkbox" ||
                    field.type === "radio"
                ) {

                    field.checked =
                        false;

                }
                else {

                    field.value =
                        "";

                }

            }
        );


    /* -----------------------------------------------------
       Hide quotation
    ----------------------------------------------------- */

    const quotation =
        el("quotationFooter");


    if (quotation) {

        quotation.classList.remove(
            "show"
        );

    }


    /* -----------------------------------------------------
       Reset package category
    ----------------------------------------------------- */

    const category =
        el("category");


    if (category) {

        const firstCategory =
            Object.keys(
                packages
            )[0];


        category.value =
            firstCategory;

    }


    loadPackages();


    updateSystemUserInfo();


    updateServerInfo();


    /* -----------------------------------------------------
       Clear package information
    ----------------------------------------------------- */

    setText(
        "packageInfo",
        ""
    );


    /* -----------------------------------------------------
       Clear quotation output
    ----------------------------------------------------- */

    const outputIds = [

        "fQuotationNo",
        "fQuotationDate",
        "fCustomer",
        "fCompany",
        "fMobile",
        "fEmail",
        "fAddress",
        "fCity",
        "fState",
        "fPincode",
        "fGSTIN",
        "fBusiness",
        "fSegment",
        "fStores",
        "fUsers",
        "fCompanies",
        "fServer",
        "packageDescription",
        "fSubtotal",
        "fDiscount",
        "fTaxable",
        "fGST",
        "fTotal",
        "fRenewalAMC",
        "fRenewalCloud",
        "fRenewalGST",
        "fRenewalTotal"

    ];


    outputIds.forEach(
        id => {

            setText(
                id,
                ""
            );

        }
    );


    /* -----------------------------------------------------
       Clear marketplace quotation rows
    ----------------------------------------------------- */

    const marketplaceRows =
        el("platformQuotationRows");


    if (marketplaceRows) {

        marketplaceRows.innerHTML =
            "";

    }


    /* -----------------------------------------------------
       Hide optional rows
    ----------------------------------------------------- */

    const rowsToHide = [

        "rowPackage",
        "rowUsers",
        "rowCloud",
        "rowEcommerce",
        "rowShopify",
        "rowUnicommerce",
        "rowCustomization",
        "rowStorage",
        "rowTransfer",
        "rowDiscount",
        "rowRenewalCloud"

    ];


    rowsToHide.forEach(
        rowId => {

            const row =
                el(rowId);


            if (row) {

                row.style.display =
                    "none";

            }

        }
    );


    /* -----------------------------------------------------
       Scroll top
    ----------------------------------------------------- */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* -------------------------------------------------
           CATEGORY DROPDOWN
        ------------------------------------------------- */

        const category =
            el("category");


        if (category) {

            category.innerHTML =

                Object.keys(
                    packages
                )
                .map(
                    categoryName => {

                        return `

<option value="${categoryName}">

${categoryName}

</option>

`;

                    }
                )
                .join("");

        }


        /* -------------------------------------------------
           LOAD ERP PACKAGES
        ------------------------------------------------- */

        loadPackages();


        /* -------------------------------------------------
           DEFAULT VALUES
        ------------------------------------------------- */

        const users =
            el("users");


        if (
            users &&
            !users.value
        ) {

            users.value =
                "1";

        }


        const stores =
            el("stores");


        if (
            stores &&
            !stores.value
        ) {

            stores.value =
                "1";

        }


        const multiCompany =
            el("multiCompany");


        if (
            multiCompany &&
            !multiCompany.value
        ) {

            multiCompany.value =
                "1";

        }


        /* -------------------------------------------------
           USER INFO
        ------------------------------------------------- */

        updateSystemUserInfo();


        /* -------------------------------------------------
           SERVER INFO
        ------------------------------------------------- */

        updateServerInfo();


        /* -------------------------------------------------
           USERS EVENTS
        ------------------------------------------------- */

        el("users")?.addEventListener(
            "input",
            updateSystemUserInfo
        );


        el("users")?.addEventListener(
            "change",
            updateSystemUserInfo
        );


        /* -------------------------------------------------
           SERVER EVENT
        ------------------------------------------------- */

        el("server")?.addEventListener(
            "change",
            updateServerInfo
        );


        /* -------------------------------------------------
           CATEGORY EVENT
        ------------------------------------------------- */

        el("category")?.addEventListener(
            "change",
            () => {

                loadPackages();

            }
        );


        /* -------------------------------------------------
           PACKAGE EVENT
        ------------------------------------------------- */

        el("package")?.addEventListener(
            "change",
            showPackageInfo
        );


        /* -------------------------------------------------
           CALCULATOR INPUT EVENTS
        ------------------------------------------------- */

        document.addEventListener(
            "input",
            event => {

                if (
                    event.target.matches(
                        "input, select, textarea"
                    )
                ) {

                    updateSystemUserInfo();

                    updateServerInfo();

                }

            }
        );


        /* -------------------------------------------------
           CLEAR / NEW QUOTATION BUTTON
           
           Works if HTML button has:
           id="clearQuotation"
           
           OR:
           onclick="clearQuotationData()"
        ------------------------------------------------- */

        el(
            "clearQuotation"
        )?.addEventListener(
            "click",
            clearQuotationData
        );


        /* -------------------------------------------------
           REMOVE OLD AUTO-SAVE DATA
           
           This is intentionally done ONCE.
           
           It prevents your old version from
           filling the form again.
        ------------------------------------------------- */

        localStorage.removeItem(
            "peddlePlusQuotationData"
        );


        console.log(
            "Peddle Plus One ERP Pricing Calculator loaded successfully."
        );

    }
);