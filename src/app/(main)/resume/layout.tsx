import { Loader } from "lucide-react";
import { Suspense } from "react";

export default function ResumeBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            <Loader className="animate-spin h-6 w-6 text-muted-foreground" />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
