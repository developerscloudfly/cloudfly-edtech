import { Award, Download, Share2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import connectDB from '@/lib/db';
import Certificate from '@/models/Certificate';
import { notFound } from 'next/navigation';

interface CertificatePageProps {
  params: { shareableToken: string };
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  await connectDB();
  const cert = await Certificate.findOne({ shareableToken: params.shareableToken })
    .populate('userId', 'name')
    .populate('courseId', 'title');

  if (!cert) notFound();

  const userName = (cert.userId as { name?: string })?.name ?? 'Student';
  const courseTitle = (cert.courseId as { title?: string })?.title ?? 'Course';
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Certificate */}
        <div className="bg-surface border-4 border-blue-deep rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-yellow-accent rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-yellow-accent rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-yellow-accent rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-yellow-accent rounded-br-xl" />

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-accent/20 flex items-center justify-center">
            <Award className="w-10 h-10 text-yellow-600" />
          </div>

          <p className="text-slate text-sm uppercase tracking-widest mb-2 font-medium">
            Certificate of Completion
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-blue-primary to-yellow-accent mx-auto mb-6 rounded-full" />

          <p className="text-slate text-base mb-2">This certifies that</p>
          <h1 className="font-heading text-3xl font-bold text-blue-deep mb-2">{userName}</h1>
          <p className="text-slate text-base mb-2">has successfully completed</p>
          <h2 className="font-heading text-xl font-semibold text-blue-primary mb-6">{courseTitle}</h2>

          <div className="flex items-center justify-center gap-2 text-sm text-slate mb-8">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Issued on {issuedDate}
          </div>

          <div className="border-t border-ash pt-6">
            <p className="text-xs text-slate mb-1">Verification ID</p>
            <p className="font-mono text-xs text-blue-primary break-all">{params.shareableToken}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 justify-center">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
