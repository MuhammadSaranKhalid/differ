import { loadDiffByToken } from '@/lib/diff-service';
import { redirect } from 'next/navigation';
import SharedDiffView from './shared-diff-view';

// Force dynamic rendering since this page depends on Supabase data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SharedDiffPage({
  params,
}: {
  params: { token: string };
}) {
  const { success, diff, error } = await loadDiffByToken(params.token);

  if (!success || !diff) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Diff Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'The diff you are looking for does not exist or has been deleted.'}
          </p>
          <a
            href="/differ"
            className="text-primary hover:underline"
          >
            Create a new diff
          </a>
        </div>
      </div>
    );
  }

  return <SharedDiffView diff={diff} />;
}
