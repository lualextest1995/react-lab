import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function TanstackQueryExample() {
  const queryClient = useQueryClient();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ["todos", page, pageSize, pagination],
    queryFn: getTodos,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 0,
    enabled: count % 2 === 0, // only fetch when count is even
    retry: 1,
    retryDelay: 1000,
    gcTime: 0, // 1 second
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Error creating todo:", error);
    },
    onSettled: () => {
      console.log("Mutation settled");
    },
  });

  function getTodos() {
    return axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.data);
  }

  function createTodo() {
    return axios
      .post("https://jsonplaceholder.typicode.com/posts", {
        title: "foo",
        body: "bar",
        userId: 1,
      })
      .then((res) => res.data);
  }

  function invalidateQueries() {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  }

  function removeQueries() {
    queryClient.removeQueries({ queryKey: ["todos"] });
  }

  function updatePagination() {
    setPage((prev) => prev + 1);
    setPageSize((prev) => prev + 10);
  }

  function updatePaginationObject() {
    setPagination((prev) => ({
      page: prev.page + 1,
      pageSize: prev.pageSize + 10,
    }));
  }

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full">
      <h1>TanstackQueryExample</h1>
      <Button onClick={() => refetch()}>Refetch Data</Button>
      <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
      <Button onClick={invalidateQueries}>Invalidate Queries</Button>
      <Button onClick={removeQueries}>Remove Queries</Button>
      <Button onClick={() => setPage(page + 1)}>Next Page: {page}</Button>
      <Button onClick={() => setPageSize(pageSize + 10)}>
        Increase Page Size: {pageSize}
      </Button>
      <Button onClick={updatePagination}>Update Page & Page Size</Button>
      <Button onClick={updatePaginationObject}>Update Pagination Object</Button>
      <Button onClick={() => mutateAsync()} disabled={isPending}>
        Create Todo
      </Button>
      <br />
      {JSON.stringify(pagination, null, 2)}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
