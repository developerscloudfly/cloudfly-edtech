import { MessageSquare, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ForumPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">Discussion Forum</h1>
          <p className="text-slate text-sm mt-1">Ask questions and discuss with fellow learners.</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
        <input
          type="text"
          placeholder="Search discussions..."
          className="w-full pl-9 pr-4 py-2.5 border border-ash rounded-lg text-sm bg-surface focus:outline-none focus:border-blue-primary"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Discussions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No discussions yet</p>
            <p className="text-sm mt-1">Be the first to start a discussion in your enrolled courses.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
