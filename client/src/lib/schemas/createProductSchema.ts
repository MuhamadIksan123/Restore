import { z } from "zod";

export type FieldFile = File & { preview?: string };

const fileSchema = z
  .custom<FieldFile>((val) => val instanceof File, "Invalid file")
  .refine((file) => file.size > 0, {
    message: "A file must be uploaded",
  })
  .transform((file) =>
    Object.assign(file, {
      preview: URL.createObjectURL(file),
    }),
  );

export const createProductSchema = z
  .object({
    name: z
      .string({ message: "Name of product is required" })
      .min(1, "Name of product is required"),
    description: z
      .string({ message: "Description is required" })
      .min(10, "Description must be at least 10 characters"),
    price: z.coerce
      .number({ message: "Price is required" })
      .min(100, "Price must be at least $1.00"),
    type: z
      .string({ message: "Type of product is required" })
      .min(1, "Type of product is required"),
    brand: z
      .string({ message: "Brand of product is required" })
      .min(1, "Brand of product is required"),
    quantityInStock: z.coerce
      .number({ message: "Quantity is required" })
      .min(1, "Quantity must be at least 1"),
    pictureUrl: z.string().optional(),
    file: fileSchema.optional(),
  })
  .refine((data) => data.pictureUrl || data.file, {
    message: "Please provide an image",
    path: ["file"],
  });

export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
