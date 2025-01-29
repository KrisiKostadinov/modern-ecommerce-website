import { prisma } from "../db/prisma";
import * as fs from "fs";

const SITE_URL = "https://www.missisrose.com";

const generateSitemap = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    const products = await prisma.product.findMany({
      select: { slug: true },
    });
    
    const urls = [
      `${SITE_URL}/`,
      `${SITE_URL}/login`,
      `${SITE_URL}/register`,
      `${SITE_URL}/forgot-password`,
      `${SITE_URL}/products`,
      `${SITE_URL}/categories`,
      ...categories.map((category) => `${SITE_URL}/categories/${category.slug}`),
      ...products.map((product) => `${SITE_URL}/products/${product.slug}`),
    ];

    // Създаваме `sitemap.xml`
    const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls
          .map(
            (url) => `
          <url>
            <loc>${url}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>
        `
          )
          .join("")}
      </urlset>
    `;

    // Записваме във `public/sitemap.xml`
    fs.writeFileSync("./public/sitemap.xml", sitemap.trim());
    console.log("✅ Sitemap generated successfully!");
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
  } finally {
    await prisma.$disconnect();
  }
};

generateSitemap();
