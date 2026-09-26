import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductInput,
  type CreateProductSchema,
} from "../../lib/schemas/createProductSchema";
import { useForm, useWatch, type FieldValues } from "react-hook-form";
import type { Product } from "../../app/models/product";
import { useFetchFiltersQuery } from "../catalog/catalogApi";
import { useEffect } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import AppTextInput from "../../app/shared/components/AppTextInput";
import AppSelectInput from "../../app/shared/components/AppSelectInput";
import { LoadingButton } from "@mui/lab";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "./adminiApi";
import { handleApiError } from "../../lib/util";
import AppDropzone from "../../app/shared/components/AppDropzone";

type Props = {
  setEditMode: (value: boolean) => void;
  product: Product | null;
  refetch: () => void;
  setSelectedProduct: (value: Product | null) => void;
};

export default function ProductForm({
  setEditMode,
  product,
  refetch,
  setSelectedProduct,
}: Props) {
  // Masukkan CreateProductInput sebagai TFieldValues dan CreateProductSchema sebagai TransformedValues
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<CreateProductInput, undefined, CreateProductSchema>({
    mode: "onTouched",
    resolver: zodResolver(createProductSchema),
  });

  // Gunakan useWatch untuk menghindari ESLint warning tentang React Compiler
  const watchFile = useWatch({ control, name: "file" });
  const { data } = useFetchFiltersQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Reset form ketika data produk masuk/berubah
  useEffect(() => {
    if (product) reset(product);
  }, [product, reset]);

  // Cleanup URL preview saat file diganti atau komponen ditutup
  useEffect(() => {
    return () => {
      if (watchFile?.preview) {
        URL.revokeObjectURL(watchFile.preview);
      }
    };
  }, [watchFile]);

  const createFormData = (items: FieldValues) => {
    const formData = new FormData();
    for (const key in items) {
      formData.append(key, items[key]);
    }

    return formData;
  };

  const onSubmit = async (data: CreateProductSchema) => {
    try {
      const formData = createFormData(data);

      if (watchFile) formData.append("file", watchFile);

      if (product) {
        await updateProduct({ id: product.id, data: formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }

      setEditMode(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      console.log(error);
      handleApiError<CreateProductInput>(error, setError, [
        "brand",
        "description",
        "file",
        "name",
        "pictureUrl",
        "price",
        "quantityInStock",
        "type",
      ]);
    }
  };

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: "lg", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Product details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppTextInput control={control} name="name" label="Product name" />
          </Grid>
          <Grid size={6}>
            {data?.brands && (
              <AppSelectInput
                items={data.brands}
                control={control}
                name="brand"
                label="Brand"
              />
            )}
          </Grid>
          <Grid size={6}>
            {data?.types && (
              <AppSelectInput
                items={data.types}
                control={control}
                name="type"
                label="Types"
              />
            )}
          </Grid>
          <Grid size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="price"
              label="Price in cents"
            />
          </Grid>
          <Grid size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="quantityInStock"
              label="Quantity in stock"
            />
          </Grid>
          <Grid size={12}>
            <AppTextInput
              control={control}
              multiline
              rows={4}
              name="description"
              label="Description"
            />
          </Grid>
          <Grid
            size={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignCenter: "center",
            }}
          >
            <AppDropzone name="file" control={control} />
            {watchFile &&
            "preview" in watchFile &&
            typeof watchFile.preview === "string" ? (
              <img
                src={watchFile.preview}
                alt="preview of image"
                style={{ maxHeight: 200 }}
              />
            ) : product?.pictureUrl ? (
              <img
                src={product.pictureUrl}
                alt="preview of image"
                style={{ maxHeight: 200 }}
              />
            ) : null}
          </Grid>
          <Grid
            sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
          >
            <Button
              onClick={() => setEditMode(false)}
              variant="contained"
              color="inherit"
            >
              Cancel
            </Button>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              color="success"
              type="submit"
            >
              Submit
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
