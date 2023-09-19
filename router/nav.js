const express = require("express");
const router = express.Router();
const puppeteer = require('puppeteer');

router.use((req, res, next) => {
  bootstrap.init();
  bootstrap.initDefault();
  next();
});




router.get("/", (req, res) => {
  theme.addVendors(["amcharts", "amcharts-maps", "amcharts-stock"]);
  res.render(theme.getPageViewPath("web_files", "render"), {
    currentLayout: theme.getLayoutPath("home"),
  });
});

router.get("/tablas", (req, res) => {
  res.render(theme.getPageViewPath("web_files", "render"), {
    currentLayout: theme.getLayoutPath("tablas"),
  });
});

router.get("/contract", (req, res) => {
  res.render(theme.getPageViewPath("web_files", "render"), {
    currentLayout: theme.getLayoutPath("contract"),
  });
});

// Función para generar el PDF
async function generatePDFFromURL(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Inyectar CSS para ocultar elementos con la clase no-export
    await page.addStyleTag({ content: '.no-export { display: none !important; }' });

    const buffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return buffer;
}

// Ruta para generar el PDF
router.get('/generate-pdf', async (req, res) => {
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/contract`;

    const buffer = await generatePDFFromURL(url);

    res.type('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=contrato.pdf'); 
    res.send(buffer);
});

module.exports = router;
