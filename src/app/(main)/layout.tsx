export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // redirect user after onboarding

  return <div className=" mt-20 mb-20 px-4">{children}</div>;
}
