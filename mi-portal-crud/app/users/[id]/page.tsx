import ClientUserDetailPage from "./client-page";

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params: awaitedParams }: UserDetailPageProps) {
  const resolvedParams = await awaitedParams;
  const userId = parseInt(resolvedParams.id);
  return <ClientUserDetailPage userId={userId} />;
}