import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">LiveKit Test Application</h1>
        <p className="text-muted-foreground">
          Test LiveKit features including chat, audio, and video
        </p>
        <Badge className="mt-2">Beta</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Choose a feature to test below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>Start Chat Test</Button>
            <Button variant="outline">Start Video Test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
