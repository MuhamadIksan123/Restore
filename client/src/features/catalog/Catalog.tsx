import { Grid } from "@mui/material";
import ProductList from "./ProductList";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./catalogApi";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "./catalogSlice";

export default function Catalog() {
  const productParams = useAppSelector((state) => state.catalog);
  const { data: filterData, isLoading: filtersLoading } =
    useFetchFiltersQuery();
  const { data, isLoading } = useFetchProductsQuery(productParams);
  const dispatch = useAppDispatch();

  if (isLoading || !data || filtersLoading || !filterData)
    return <div>Loading...</div>;

  return (
    <Grid container spacing={4}>
      <Grid size={3}>
        <Filters filtersData={filterData} />
      </Grid>
      <Grid size={9}>
        <ProductList products={data.items} />
        <AppPagination
          metadata={data.pagination}
          onPageChange={(page: number) => {
            dispatch(setPageNumber(page));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </Grid>
    </Grid>
  );
}
