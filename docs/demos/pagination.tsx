import * as React from "react";
import { Pagination } from "../../src";

export function Default() {
  const [page, setPage] = React.useState(5);
  return <Pagination page={page} total={20} onPageChange={setPage} />;
}

export function Simple() {
  const [page, setPage] = React.useState(2);
  return <Pagination variant="simple" page={page} total={10} onPageChange={setPage} />;
}
