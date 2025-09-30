import { db } from '@/database/drizzle';
import { candidates } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import CandidatePageClient from '@/app/candidates/Client/Client';

interface PageProps {
    params: {
        id: string;
    };
}

const Page = async ({ params }: PageProps) => {
    const { id } = params;

    const candidateResult = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, id))
        .limit(1);

    if (!candidateResult || candidateResult.length === 0) {
        notFound();
    }

    const candidate = candidateResult[0];

    return <CandidatePageClient candidate={candidate} />;
};

export default Page;
