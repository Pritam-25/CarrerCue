export default async function CoverLetter({
  params,
}: {
  params: { id: string };
}) {
  //   const id = await params.id;
  return <div>dynamic route: {params.id}</div>;
}
