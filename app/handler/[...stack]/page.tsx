import { StackHandler } from "@stackframe/stack";
import { stack } from "@/stack";

export default async function StackHandlerPage(props: {
  params: Promise<{ stack: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await props.params;
  const resolvedSearchParams = await props.searchParams;

  return (
    <StackHandler
      app={stack}
      fullPage={true}
      routeProps={{
        params: resolvedParams,
        searchParams: resolvedSearchParams,
      }}
    />
  );
}
