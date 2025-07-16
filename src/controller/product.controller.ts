import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
 
const prisma = new PrismaClient();

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { sku, name, price } = req.body;
    const file = req.file;

    if (!sku || !name || !price || !file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imagePath = `/uploads/${file.filename}`;

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        price: parseFloat(price),
        images: [imagePath], // Single image stored as array
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { sku, name, price } = req.body;
    const file = req.file;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        sku: sku ?? existing.sku,
        name: name ?? existing.name,
        price: price ? parseFloat(price) : existing.price,
        images: file ? [`/uploads/${file.filename}`] : existing.images,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Step 1: Find the existing product
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Step 2: Delete the associated image file(s)
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgPath) => {
        // Get the filename from the image path (e.g. "/uploads/xyz.jpg")
        const filename = path.basename(imgPath);
        const fullPath = path.join(__dirname, "../../uploads", filename);

        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error("Failed to delete image file:", filename, err.message);
          } else {
            console.log("Deleted image file:", filename);
          }
        });
      });
    }

    // Step 3: Delete the product from the database
    await prisma.product.delete({ where: { id } });

    res.json({ message: "✅ Product and associated image(s) deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

