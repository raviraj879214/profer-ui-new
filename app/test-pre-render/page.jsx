// app/page.jsx
import { Suspense } from 'react';
import {StaticSection} from "./StaticSection";
import {DynamicSection} from "./DynamicSection";
import {AvatarSkeleton} from "./AvatarSkeleton";
export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <StaticSection />
      <Suspense fallback={<AvatarSkeleton></AvatarSkeleton>}>
        <DynamicSection />
      </Suspense>
    </main>
  );
}
